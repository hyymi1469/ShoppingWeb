package src

import (
	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
)

func SignUpRouteHandler(c *fiber.Ctx) error {

	var reqSignUp ReqSignUp
	if err := c.BodyParser(&reqSignUp); err != nil {
		Logger.Error(err)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}

	reqEmail := reqSignUp.Email
	reqId := reqSignUp.SignId
	reqPassword := reqSignUp.SignPassword

	// 아이디는 영문 4~16글자
	if len(reqId) < 4 || len(reqId) > 16 {
		return c.Status(Error_RulePassword).JSON(fiber.Map{"error": ""})
	}

	// 비밀번호는 영문, 숫자를 포함한 8~16글자 검사
	if len(reqPassword) < 8 || len(reqPassword) > 16 {
		return c.Status(Error_RulePassword).JSON(fiber.Map{"error": ""})
	}

	if ContainsAlphanumeric(reqPassword) == false {
		return c.Status(Error_RulePassword).JSON(fiber.Map{"error": ""})
	}

	errNum := CheckSignUpAuth(reqEmail)
	if errNum != Error_None {
		Logger.Error("CheckSignUpAuth. errorNum:", errNum, "email:", reqEmail)
		return c.Status(errNum).JSON(fiber.Map{"error": ""})
	}

	// 회원가입 DB에 insert 한다.
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(reqPassword), bcrypt.DefaultCost)
	if err != nil {
		Logger.Error("bcrypt fail!! email:", reqEmail, "password:", reqPassword)
		return c.Status(Error_ServerError).JSON(fiber.Map{"error": ""})

	}

	// 이미 있는 ID인지 검사한 후 insert 한다.
	errNum = CheckAndInsertAccount(reqEmail, reqId, string(hashedPassword))
	if errNum != Error_None {
		Logger.Error("insert account. email:", reqEmail, "password:", reqPassword)
		return c.Status(errNum).JSON(fiber.Map{"error": ""})
	}

	// DB 처리 후 MailAuthMap 에서 해당 메일 맵 없애주기
	DeleteEmailAuth(reqEmail)

	return c.SendStatus(200)
}
