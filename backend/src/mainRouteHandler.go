package src

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

func MainRouteHandler(c *fiber.Ctx) error {

	var reqMain ReqMainPage
	if err := c.BodyParser(&reqMain); err != nil {
		Logger.Error(err)
		return c.Status(Error_MarshalError).JSON(fiber.Map{
			"error": "JSON 파싱 오류",
		})
	}

	reqPage := reqMain.CurPage
	reqUserId := reqMain.UserId
	accToken := reqMain.AccessToken
	refreshToken := reqMain.RefreshToken

	if reqPage == 1 {

		newAccToken, newRefreshToken := CheckAndUpdateToken(reqUserId, accToken, refreshToken)
		if newAccToken == "" {
			reqUserId = ""
			accToken = ""
			refreshToken = ""
		} else {
			accToken = newAccToken
			refreshToken = newRefreshToken
		}
	}

	var productImgInfoList []ProductImgInfo

	var totalPageCount int
	GetProductInfo(reqPage, &totalPageCount, &productImgInfoList, reqUserId)

	var productPageInfoRes ResProductPageInfo
	productPageInfoRes.ProductImgInfo = productImgInfoList
	productPageInfoRes.TotalPageCount = totalPageCount
	productPageInfoRes.UserId = reqUserId
	productPageInfoRes.AccessToken = accToken
	productPageInfoRes.RefreshToken = refreshToken

	// JSON 응답 생성
	response, err := json.Marshal(productPageInfoRes)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Marshal).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.Send(response)
}
