package src

import (
	"github.com/gofiber/fiber/v2"
)

func ChangeStateRouteHandler(c *fiber.Ctx) error {

	var reqChangeState ReqChangeState
	if err := c.BodyParser(&reqChangeState); err != nil {
		Logger.Error(err)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}

	accToken := reqChangeState.AccessToken
	refreshToken := reqChangeState.RefreshToken
	userId := reqChangeState.UserId
	reqState := reqChangeState.ReqState
	productId := reqChangeState.ProductId
	optionId := reqChangeState.OptionId
	orderSerial := reqChangeState.OrderSerial

	newAccToken, refreshToken := CheckAndUpdateToken(userId, accToken, refreshToken)
	if newAccToken == "" {
		return c.Status(Error_LoginAgain).JSON(fiber.Map{"error": ""})
	}

	// 해당 상품의 compayid와 계정의 companyid가 같아야 state를 바꿀 있도록 체크
	returnNun := CheckAdminAccount(userId, productId)
	if Error_NotReviewAdmin != returnNun {
		Logger.Error("CheckAdminAccount Not match. productId:", productId, ", userId:", userId)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}

	ChangeOrderedState(userId, productId, optionId, reqState, orderSerial)

	// JSON 응답 보내기
	return c.SendStatus(200)
}
