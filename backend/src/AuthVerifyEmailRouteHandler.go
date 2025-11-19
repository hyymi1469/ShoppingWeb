package src

import (
	"github.com/gofiber/fiber/v2"
)

func AuthVerifyEmailRouteHandler(c *fiber.Ctx) error {

	var reqAuthVerifyEmail ReqAuthVerifyEmail
	if err := c.BodyParser(&reqAuthVerifyEmail); err != nil {
		Logger.Error(err)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}

	reqVerifyNum := reqAuthVerifyEmail.VerifyNum
	reqEmail := reqAuthVerifyEmail.Email

	errNum := UpdateAuthMail(reqEmail, reqVerifyNum)
	if errNum != Error_None {
		Logger.Error("AuthVerifyEmailRouteHandler. errorNum:", errNum, "email:", reqEmail)
		return c.Status(errNum).JSON(fiber.Map{"error": ""})
	}

	return c.SendStatus(200)
}
