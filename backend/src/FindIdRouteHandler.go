package src

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
)

func FindIdRouteHandler(c *fiber.Ctx) error {

	var reqFindId ReqFindId
	if err := c.BodyParser(&reqFindId); err != nil {
		Logger.Error(err)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}

	reqVerifyNum := reqFindId.VerifyNum
	reqEmail := reqFindId.Email

	errNum := UpdateAuthMail(reqEmail, reqVerifyNum)
	if errNum != Error_None {
		Logger.Error("AuthVerifyEmailRouteHandler errorNum[%d], email[%s]", errNum, reqEmail)
		return c.Status(errNum).JSON(fiber.Map{"error": ""})
	}

	var resFindId ResFindId
	resFindId.UserId = GetIdFromEmail(reqEmail)
	if resFindId.UserId == "" {
		return c.Status(Error_NotJoinedEmail).JSON(fiber.Map{"error": ""})
	}

	DeleteEmailAuth(reqEmail)

	// JSON 응답 생성
	response, err := json.Marshal(resFindId)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Marshal).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.Send(response)
}
