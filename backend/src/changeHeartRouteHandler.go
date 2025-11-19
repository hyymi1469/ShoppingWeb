package src

import (
	"encoding/json"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func ChangeHeartRouteHandler(c *fiber.Ctx) error {

	var reqChangeHeart ReqChangeHeart

	// 요청 데이터를 파싱하여 requestData에 할당
	if err := c.BodyParser(&reqChangeHeart); err != nil {
		Logger.Error(err)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}

	userId := reqChangeHeart.LoginId
	accToken := reqChangeHeart.AccessToken
	refreshToken := reqChangeHeart.RefreshToken
	productIdStr := reqChangeHeart.ProductId

	productId, err := strconv.ParseInt(productIdStr, 10, 64)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	newAccToken, newRefreshToken := CheckAndUpdateToken(userId, accToken, refreshToken)
	if newAccToken == "" {
		return c.Status(Error_LoginAgain).JSON(fiber.Map{"error": ""})
	}

	isDbError, isLike := ChangeHeartDb(productId, userId)
	if isDbError == false {
		Logger.Error("Db error. userId:", userId, "productId:", productId)
		return c.Status(Error_LoginAgain).JSON(fiber.Map{"error": ""})
	}

	var resChangeHeart ResChangeHeart
	resChangeHeart.AccessToken = newAccToken
	resChangeHeart.RefreshToken = newRefreshToken
	resChangeHeart.IsLike = isLike

	// JSON 응답 생성
	response, err := json.Marshal(resChangeHeart)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Marshal).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.Send(response)
}
