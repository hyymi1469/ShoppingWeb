package src

import (
	"github.com/gofiber/fiber/v2"
)

func DoLogoutRouteHandler(c *fiber.Ctx) error {

	reqUserId := (string)(c.Body())

	if doLogout(reqUserId) == true {
		// JSON 응답 보내기

	}

	return c.SendString("")
}
