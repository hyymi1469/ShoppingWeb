package src

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

func MyInfoRouteHandler(c *fiber.Ctx) error {

	var reqMyInfo ReqMyInfo
	// 요청 데이터를 파싱하여 requestData에 할당
	if err := c.BodyParser(&reqMyInfo); err != nil {
		Logger.Error(err)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}
	accToken := reqMyInfo.AccessToken
	refreshToken := reqMyInfo.RefreshToken
	userId := reqMyInfo.LoginId

	newAccToken, newRefreshToken := CheckAndUpdateToken(userId, accToken, refreshToken)
	if newAccToken == "" {
		return c.Status(Error_LoginAgain).JSON(fiber.Map{"error": ""})
	}

	var resMyInfo ResMyInfo

	// 구매 정보 긁어오기
	GetOrderList(userId, &resMyInfo.OrderedInfoList)

	// 좋아요 목록 긁어오기
	var productImgInfoList []ProductImgInfo
	GetProductInfoHeart(userId, &productImgInfoList)

	resMyInfo.ProductImgInfo = productImgInfoList
	resMyInfo.AccessToken = newAccToken
	resMyInfo.RefreshToken = newRefreshToken

	// JSON 응답 생성
	response, err := json.Marshal(resMyInfo)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Marshal).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.Send(response)
}
