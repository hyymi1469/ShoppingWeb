package src

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

func ShoppingBagChangeCheckRouteHandler(c *fiber.Ctx) error {

	var reqShoppingBagChangeCheck ReqShoppingBagChangeCheck
	if err := c.BodyParser(&reqShoppingBagChangeCheck); err != nil {
		Logger.Error(err)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}
	accToken := reqShoppingBagChangeCheck.AccessToken
	refreshToken := reqShoppingBagChangeCheck.RefreshToken
	userId := reqShoppingBagChangeCheck.LoginId
	productId := reqShoppingBagChangeCheck.ProductId
	isChecked := reqShoppingBagChangeCheck.IsChecked
	optionId := reqShoppingBagChangeCheck.OptionId

	newAccToken, refreshToken := CheckAndUpdateToken(userId, accToken, refreshToken)
	if newAccToken == "" {
		return c.Status(Error_LoginAgain).JSON(fiber.Map{"error": ""})
	}

	var resShoppingBagChangeCheck ResShoppingBagChangeCheck

	resShoppingBagChangeCheck.AccessToken = newAccToken
	resShoppingBagChangeCheck.RefreshToken = refreshToken

	if ShoppingBagChangeCheck(userId, productId, optionId, isChecked) == false {
		return c.Status(Error_PlzRefresh).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 생성
	response, err := json.Marshal(resShoppingBagChangeCheck)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Marshal).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.Send(response)
}
