package src

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func ProductDetailRouteHandler(c *fiber.Ctx) error {

	userId := (string)(c.Body())
	productId, err := strconv.ParseInt(c.Params("productId"), 10, 64)
	if err != nil {
		Logger.Error(err.Error())
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	// 이미지 정보
	productInfo := ProductInfoFromDBMap[productId]
	companyInfo := companyInfoFromDBMap[productInfo.companyId]
	var productImgInfo ProductImgInfo
	productImgInfo.ImgURL = fmt.Sprintf("%s/dynamic_images/%d/%s", baseURL, productInfo.productId, GetTileImgName(productInfo.imgUrl))
	// 대문 이미지
	// 이미지 확장자 목록
	exts := []string{".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"}

	// 이미지 리스트
	var notifyProductDetailInfo NotifyProductDetailInfo
	files, err := os.ReadDir(productInfo.imgUrl + "list")
	if err == nil {
		for _, file := range files {
			// 파일만 선택 (디렉토리는 제외)
			if !file.IsDir() {
				name := file.Name()
				// 확장자 검사
				if isImage(name, exts) {
					var imgInfo ProductDetailImgInfo
					imgInfo.ImgPath = fmt.Sprintf("%s/dynamic_images/%d", baseURL, productInfo.productId) + "/list/" + name

					ext := filepath.Ext(name)
					orderStr := strings.TrimSuffix(name, ext)
					orderInt, err := strconv.Atoi(orderStr)
					if err == nil {
						imgInfo.Order = orderInt
					} else {
						fmt.Println("파일명 숫자 변환 실패:", orderStr)
					}

					notifyProductDetailInfo.ImgPathList = append(notifyProductDetailInfo.ImgPathList, imgInfo)
				}
			}
		}
	}

	productImgInfo.CompanyName = productInfo.companyName
	productImgInfo.Description = productInfo.description
	productImgInfo.Price = productInfo.price
	productImgInfo.ProductId = fmt.Sprintf("%d", productInfo.productId)
	productImgInfo.IsLike = GetIsLike(productId, userId)
	notifyProductDetailInfo.ProductImgInfo = productImgInfo

	if companyInfo != nil {
		productImgInfo.DeliveryPrice = companyInfo.deliveryPrice
		notifyProductDetailInfo.FreeDeliveryCondition = companyInfo.deliveryCondition
	}

	// 옵션 정보
	optionMap := ProductOptionFromDBMap[productId]
	for _, valueIter := range optionMap {
		notifyProductDetailInfo.OptionInfoList = append(notifyProductDetailInfo.OptionInfoList, valueIter)
	}

	// 리뷰 내용 가져오기
	productReviewInfo, isExist := productReviewFromDBMap[productId]
	if isExist {
		if productReviewInfo == nil {
			return c.Status(Error_NotKnowError).JSON(fiber.Map{"error": ""})
		}

		notifyProductDetailInfo.TotalPageCount = len(productReviewInfo.productReviewList) / G_ShowReviewCount
		if len(productReviewInfo.productReviewList)%G_ShowReviewCount != 0 {
			notifyProductDetailInfo.TotalPageCount++
		}

		notifyProductDetailInfo.AvgGrade = productReviewInfo.avgGradePoint

		var maxPageCount int = G_ShowReviewCount
		if len(productReviewInfo.productReviewList) < G_ShowReviewCount {
			maxPageCount = len(productReviewInfo.productReviewList)
		}

		for _, productReview := range productReviewInfo.productReviewList[0:maxPageCount] {

			orderedProductMap, isExist := orderedListFromDBMap[productReview.userId]
			if !isExist {
				continue
			}

			orderedListInfoList, isExist := orderedProductMap[productId]
			if !isExist {
				continue
			}

			for _, orderedInfo := range orderedListInfoList {
				if productReview.orderSerial == orderedInfo.orderSerial {
					var productReviewDetailInfo ProductReviewDetailInfo
					optionMap, isExist := ProductOptionFromDBMap[productId]
					if !isExist {
						continue
					}

					productOptionInfo, isExist := optionMap[orderedInfo.optionId]
					if !isExist {
						continue
					}

					productReviewDetailInfo.OptionId = productOptionInfo.OptionId
					productReviewDetailInfo.OptionName = productOptionInfo.OptionName
					productReviewDetailInfo.ReviewDate = productReview.date
					productReviewDetailInfo.ReviewMsg = productReview.reviewMsg
					productReviewDetailInfo.UserId = GetUnknownUserId(productReview.userId)
					productReviewDetailInfo.StarGrade = productReview.gradePoint

					// 이미지 가져오기
					if productReview.isPath {
						fileNameMap := getCurrentDirectorySubdirectories(fmt.Sprintf("%d", productId), productReview.userId, fmt.Sprintf("%d", productReview.orderSerial))
						for filePath, fileNameList := range fileNameMap {
							for _, fileName := range fileNameList {

								content, err := readFile(filePath + "/" + fileName)
								if err != nil {
									continue
								}

								extensionName := GetFileExtension(fileName)
								if extensionName == "mp4" {
									productReviewDetailInfo.VideoBase64 = append(productReviewDetailInfo.VideoBase64, base64.StdEncoding.EncodeToString(content))
								} else {
									productReviewDetailInfo.ImgBase64 = append(productReviewDetailInfo.ImgBase64, base64.StdEncoding.EncodeToString(content))
								}
							}
						}
					}

					notifyProductDetailInfo.ProductReviewDetailInfoList = append(notifyProductDetailInfo.ProductReviewDetailInfoList, productReviewDetailInfo)
				}

			}
		}
	}

	// JSON 응답 생성
	response, err := json.Marshal(notifyProductDetailInfo)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Marshal).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.Send(response)
}

func getCurrentDirectorySubdirectories(productId string, userId string, orderSerial string) map[string][]string {

	fileNameMap := make(map[string][]string)

	// 현재 작업 디렉토리 가져오기
	currentDirectory := "./review/"
	currentDirectory += productId + "/"
	currentDirectory += userId + "/"
	currentDirectory += orderSerial

	files, err := os.ReadDir(currentDirectory)
	if err != nil {
		return nil
	}

	// 파일인 경우 이름을 추가
	for _, file := range files {
		if !file.IsDir() {
			fileNameList := fileNameMap[currentDirectory]
			fileNameList = append(fileNameList, file.Name())
			fileNameMap[currentDirectory] = fileNameList
		}
	}

	return fileNameMap
}

// 파일을 읽는 함수
func readFile(filePath string) ([]byte, error) {
	content, err := os.ReadFile(filePath)
	if err != nil {
		return nil, err
	}
	return content, nil
}

func getUserIdFromPath(path string) string {
	parts := strings.Split(path, "/")

	// 필요한 부분 추출 (인덱스를 확인하여 조절)
	if len(parts) >= 4 {
		return parts[3]
	} else {
		return ""
	}
}
