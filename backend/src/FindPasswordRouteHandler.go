package src

import (
	"github.com/gofiber/fiber/v2"
)

func FindPasswordRouteHandler(c *fiber.Ctx) error {

	var reqFindPassword ReqFindPassword
	if err := c.BodyParser(&reqFindPassword); err != nil {
		Logger.Error(err)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}

	reqVerifyNum := reqFindPassword.VerifyNum
	reqEmail := reqFindPassword.Email

	errNum := UpdateAuthMail(reqEmail, reqVerifyNum)
	if errNum != Error_None {
		Logger.Error("UpdateAuthMail. errorNum:", errNum, "email:", reqEmail)
		return c.Status(errNum).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.SendStatus(200)
}
