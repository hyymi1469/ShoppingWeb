package src

import (
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func ChangePasswordRouteHandler(c *fiber.Ctx) error {

	var reqChangePassword ReqChangePassword
	if err := c.BodyParser(&reqChangePassword); err != nil {
		Logger.Error(err)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}

	reqEmail := reqChangePassword.Email
	reqPassword := reqChangePassword.Password

	// 비밀번호는 영문, 숫자를 포함한 8~16글자 검사
	if len(reqPassword) < 8 || len(reqPassword) > 16 {
		return c.Status(Error_RulePassword).JSON(fiber.Map{"error": ""})
	}

	if ContainsAlphanumeric(reqPassword) == false {
		return c.Status(Error_RulePassword).JSON(fiber.Map{"error": ""})
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(reqPassword), bcrypt.DefaultCost)
	if err != nil {
		Logger.Error("bcrypt fail!! email:", reqEmail, ",password:", reqPassword)
		return c.Status(Error_ServerError).JSON(fiber.Map{"error": ""})

	}

	errNum := UpdatePassword(reqEmail, string(hashedPassword))
	if errNum != Error_None {
		Logger.Error("UpdatePassword errorNum:", errNum, ",email:", reqEmail)
		return c.Status(errNum).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.SendStatus(200)
}
