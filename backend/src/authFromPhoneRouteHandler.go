package src

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func AuthFromPhoneRouteHandler(c *fiber.Ctx) error {

	phoneNumber := (string)(c.Body())
	fmt.Println(phoneNumber)

	// JSON 응답 보내기
	return c.SendStatus(200)
}
