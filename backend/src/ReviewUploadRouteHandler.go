package src

import (
	"image"
	"image/color"
	"image/jpeg"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"time"

	"github.com/disintegration/imaging"
	"github.com/gofiber/fiber/v2"
	"github.com/rwcarlsen/goexif/exif"
)

func ReviewUploadRouteHandler(c *fiber.Ctx) error {

	// 파일 데이터 가져오기
	form, err := c.MultipartForm()
	if err != nil {
		Logger.Error(err.Error())
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	// 변수 가져오기
	reviewMsg := c.FormValue("reviewMsg")
	ratingStr := c.FormValue("rating")
	productId := c.FormValue("productId")
	userId := c.FormValue("userId")
	accToken := c.FormValue("accessToken")
	refreshToken := c.FormValue("refreshToken")
	orderSerial := c.FormValue("orderSerial")
	optionId := c.FormValue("optionId")

	if len(reviewMsg) < 5 {
		return c.Status(Error_LoginAgain).JSON(fiber.Map{"error": ""})
	}

	// 문자열을 정수로 변환
	ratingInt, err := strconv.Atoi(ratingStr)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	if ratingInt < 1 || ratingInt > 5 {
		return c.Status(Error_WrongRate).JSON(fiber.Map{"error": ""})
	}

	newAccToken, refreshToken := CheckAndUpdateToken(userId, accToken, refreshToken)
	if newAccToken == "" {
		return c.Status(Error_LoginAgain).JSON(fiber.Map{"error": ""})
	}

	// 문자열을 정수로 변환
	productIdInt, err := strconv.ParseInt(productId, 10, 64)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	// 문자열을 정수로 변환
	orderSerialInt, err := strconv.ParseInt(orderSerial, 10, 64)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	// 해당 계정이 판매저 계정인지 검사
	errNum := CheckAdminAccount(userId, productIdInt)
	if errNum != Error_None {
		return c.Status(errNum).JSON(fiber.Map{"error": ""})
	}

	errorNum := isCheckDuplicateReview(userId, productIdInt, orderSerialInt)
	if errorNum != Error_None {
		Logger.Error("isCheckDuplicateReview. errorNum:", errorNum)
		return c.Status(errorNum).JSON(fiber.Map{"error": ""})
	}

	curTime := time.Now()
	curTimeUnix := curTime.Unix()

	// 파일 저장
	uploadsPath := ReviewFilePath(productId, userId, orderSerial)
	if err := os.MkdirAll(uploadsPath, os.ModePerm); err != nil {
		Logger.Error(err.Error())
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	// 파일들 저장
	files := form.File["files"]
	for _, file := range files {

		extensionName := GetFileExtension(file.Filename)
		if extensionName == "mp4" || extensionName == "avi" || extensionName == "mkv" {
			// 파일 오픈
			src, err := file.Open()
			if err != nil {
				return err
			}
			defer src.Close()

			// 저장 경로 지정
			destPath := filepath.Join(uploadsPath, file.Filename)

			// 파일 생성
			dst, err := os.Create(destPath)
			if err != nil {
				return err
			}
			defer dst.Close()

			// 파일 복사
			_, err = io.Copy(dst, src)
			if err != nil {
				return err
			}

			outPath := getOutPath(destPath)

			// 동영상 압축
			errNum := compressVideo(destPath, outPath)
			if errNum != nil {
				Logger.Error("video error.", errNum)
			}

			dst.Close()
			src.Close()

			os.Remove(destPath)

		} else {

			// 파일 리사이징
			src, err := file.Open()
			if err != nil {
				continue
			}
			defer src.Close()

			img, _, err := image.Decode(src)
			if err != nil {
				continue
			}

			// EXIF 정보 추출
			x, err := exif.Decode(src)
			if err == nil {
				// Orientation 정보 확인
				orientation, _ := x.Get(exif.Orientation)
				if orientation != nil {
					orientationValue, _ := orientation.Int(0)
					// 이미지 회전
					img = imaging.Rotate(img, getRotationAngle(orientationValue), color.White)
				}
			}

			// 이미지 회전
			//img = imaging.Rotate(img, 90, color.White)

			// 이미지 리사이징
			resizedImg := imaging.Resize(img, 800, 0, imaging.Lanczos)

			// 리사이징된 이미지 저장
			destPath := filepath.Join(uploadsPath, file.Filename)
			err = imaging.Save(resizedImg, destPath)
		}

	}

	isFile := true
	if files == nil {
		isFile = false
	}

	// DB에 내용 저장
	errorNum = InsertReview(productId, userId, reviewMsg, curTimeUnix, ratingStr, isFile, orderSerial)
	if errorNum != Error_None {
		Logger.Error(errorNum)
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	// 문자열을 정수로 변환
	optionIdInt, err := strconv.Atoi(optionId)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}
	// ordered_list에서 주문 상태 바꿔놓기
	ChangeOrderedState(userId, productIdInt, optionIdInt, OrderedListState_completeReview, orderSerialInt)

	// JSON 응답 보내기
	return c.SendStatus(200)
}

func isCheckDuplicateReview(userId string, productId int64, orderSerial int64) int {

	isExistSerial := false
	// ordered_list에 userId, 시리얼번호가 있는지 확인(있어야 함)
	productOrderedMap, exist := orderedListFromDBMap[userId]
	if exist == false {
		return Error_NotExistId
	}

	orderedList, exist := productOrderedMap[productId]
	if exist == false {
		return Error_NotExistProduct
	}

	for _, iter := range orderedList {
		if iter.orderSerial == orderSerial {
			isExistSerial = true
			break
		}
	}

	if isExistSerial == false {
		return Error_NotBoughtReview // 구매한 적이 없는 상품입니다.
	}

	//product_review에 userId, 시리얼 번호가 없는지 확인(없어야 함!)
	userReviewMap, exist := productReviewFromDBMap[productId]
	if exist == false {
		return Error_None
	}

	productReviewList, exist := userReviewMap.productReviewMap[userId]
	if exist == false {
		return Error_None
	}

	for _, iter := range productReviewList {
		if iter.orderSerial == orderSerial {
			return Error_AlreadyReviewed
		}
	}

	return Error_None
}

func saveResizedImage(uploadsPath, filename string, img image.Image) error {
	filePath := filepath.Join(uploadsPath, filename)
	dst, err := os.Create(filePath)
	if err != nil {
		return err
	}
	defer dst.Close()

	// 리사이징된 이미지를 JPEG로 인코딩하여 저장
	err = jpeg.Encode(dst, img, nil)
	if err != nil {
		return err
	}

	return nil
}

// EXIF Orientation 값에 따른 회전 각도 반환
func getRotationAngle(orientation int) float64 {
	switch orientation {
	case 3:
		return 180
	case 6:
		return 90
	case 8:
		return -90
	default:
		return 0
	}
}

func compressVideo(inputPath, outputPath string) error {

	cmd := exec.Command("ffmpeg",
		"-i", inputPath, // 입력 파일 경로
		"-c:v", "libx264", // 비디오 코덱 지정 (libx264을 사용하여 H.264로 압축)
		"-preset", "medium", // 프리셋 설정 (압축 레벨 조절, medium이 보통 사용됨)
		"-crf", "23", // 비디오 품질 조절 (23은 기본값, 낮을수록 높은 품질)
		"-c:a", "aac", // 오디오 코덱 지정 (AAC을 사용하여 압축)
		"-strict", "experimental", // AAC 인코딩을 위해 필요
		outputPath, // 출력 파일 경로
	)

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func getOutPath(destPath string) string {

	// 파일명과 확장자를 분리
	dir, file := filepath.Split(destPath)

	// 확장자를 분리
	ext := filepath.Ext(file)
	// 확장자 제거한 파일명에 "_result" 추가
	newFile := file[:len(file)-len(ext)] + "_result" + ext

	// 새로운 경로 생성
	newPath := filepath.Join(dir, newFile)

	return newPath
}
