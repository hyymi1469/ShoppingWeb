package src

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func AddShoppingBagRouteHandler(c *fiber.Ctx) error {

	var reqAddShoppingBag ReqAddShoppingBag
	if err := c.BodyParser(&reqAddShoppingBag); err != nil {
		Logger.Error(err)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}

	accToken := reqAddShoppingBag.AccessToken
	refreshToken := reqAddShoppingBag.RefreshToken
	userId := reqAddShoppingBag.LoginId
	productIdStr := reqAddShoppingBag.ProductId
	productId, err := strconv.ParseInt(productIdStr, 10, 64)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	newAccToken, _ := CheckAndUpdateToken(userId, accToken, refreshToken)
	if newAccToken == "" {
		return c.Status(Error_LoginAgain).JSON(fiber.Map{"error": ""})
	}

	addShoppingBag := reqAddShoppingBag.AddShoppingBagInfoList

	for _, iter := range addShoppingBag {
		entity := iter.Entity
		optionId := iter.OptionId

		if AddShoppingBag(userId, productId, entity, optionId) == false {
			return c.Status(Error_AlreadyShoppingBag).JSON(fiber.Map{"error": ""})
		}

	}

	// JSON 응답 보내기
	return c.SendStatus(200)

}
