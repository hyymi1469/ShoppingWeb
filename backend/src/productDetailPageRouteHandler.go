package src

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func ProductDetailPageRouteHandler(c *fiber.Ctx) error {

	reqPage := c.Query("cur_page")
	productId, err := strconv.ParseInt(c.Params("productId"), 10, 64)
	if err != nil {
		Logger.Error(err.Error())
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	// []byte를 string으로 변환 후 strconv.Atoi를 사용하여 int로 변환
	reqPageInt, err := strconv.Atoi(string(reqPage))
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	reqPageInt -= 1
	if reqPageInt < 0 {
		reqPageInt = 0
	}

	reqPageInt *= G_ShowReviewCount

	var notifyProductReview NotifyProductReview

	// 리뷰 내용 가져오기
	productReviewInfo, isExist := productReviewFromDBMap[productId]
	if isExist {
		if productReviewInfo == nil {
			return c.Status(Error_NotKnowError).JSON(fiber.Map{"error": ""})
		}

		var maxPageCount int = reqPageInt + G_ShowReviewCount
		if len(productReviewInfo.productReviewList) < maxPageCount {
			maxPageCount = len(productReviewInfo.productReviewList)
		}

		if maxPageCount < reqPageInt {
			reqPageInt = len(productReviewInfo.productReviewList)
			maxPageCount = len(productReviewInfo.productReviewList)
		}

		for _, productReview := range productReviewInfo.productReviewList[reqPageInt:maxPageCount] {

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

					notifyProductReview.ProductReviewDetailInfoList = append(notifyProductReview.ProductReviewDetailInfoList, productReviewDetailInfo)
				}

			}
		}
	}

	// JSON 응답 생성
	response, err := json.Marshal(notifyProductReview)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Marshal).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.Send(response)
}
