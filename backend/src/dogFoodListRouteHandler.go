package src

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

func DogFoodListRouteHandler(c *fiber.Ctx) error {

	var reqDogFoodPage ReqDogFoodPage
	if err := c.BodyParser(&reqDogFoodPage); err != nil {
		Logger.Error(err)
		return c.Status(Error_MarshalError).JSON(fiber.Map{
			"error": "JSON 파싱 오류",
		})
	}

	// 페이지, 타입 필요
	reqPage := reqDogFoodPage.ReqPage
	productType := reqDogFoodPage.ProductType

	var productImgInfoList []ProductImgInfo

	var totalPageCount int
	GetFoodListPageInfo(reqPage, productType, &totalPageCount, &productImgInfoList)

	var resProductPageInfo ResProductPageInfo
	resProductPageInfo.ProductImgInfo = productImgInfoList
	resProductPageInfo.TotalPageCount = totalPageCount

	// JSON 응답 생성
	response, err := json.Marshal(resProductPageInfo)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Marshal).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.Send(response)
}
