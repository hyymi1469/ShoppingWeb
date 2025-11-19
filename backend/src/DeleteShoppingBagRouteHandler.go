package src

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

func DeleteShoppingBagRouteHandler(c *fiber.Ctx) error {

	var reqShoppingBagDelete ReqShoppingBagDelete
	if err := c.BodyParser(&reqShoppingBagDelete); err != nil {
		Logger.Error(err)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}
	accToken := reqShoppingBagDelete.AccessToken
	refreshToken := reqShoppingBagDelete.RefreshToken
	userId := reqShoppingBagDelete.LoginId
	productId := reqShoppingBagDelete.ProductId
	optionId := reqShoppingBagDelete.OptionId

	newAccToken, refreshToken := CheckAndUpdateToken(userId, accToken, refreshToken)
	if newAccToken == "" {
		return c.Status(Error_LoginAgain).JSON(fiber.Map{"error": ""})
	}

	var resShoppingBagDelete ResShoppingBagDelete

	resShoppingBagDelete.AccessToken = newAccToken
	resShoppingBagDelete.RefreshToken = refreshToken

	// 쇼핑목록에서 빼기
	DeleteShoppingBag(userId, productId, optionId)

	// JSON 응답 생성
	response, err := json.Marshal(resShoppingBagDelete)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Marshal).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.Send(response)
}
