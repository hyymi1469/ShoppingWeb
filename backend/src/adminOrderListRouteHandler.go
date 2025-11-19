package src

import (
	"encoding/json"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func AdminOrderListRouteHandler(c *fiber.Ctx) error {

	reqPageStr := c.Query("page")
	companyId := c.Query("company_id")
	userId := c.Query("user_id")
	accToken := c.Query("access_token")
	refreshToken := c.Query("refresh_token")

	newAccToken, newRefreshToken := CheckAndUpdateToken(userId, accToken, refreshToken)
	if newAccToken == "" {
		return c.Status(Error_LoginAgain).JSON(fiber.Map{"error": ""})
	}

	reqPage, err := strconv.Atoi(reqPageStr)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	reqPage -= 1

	var notifyAdminOrder NotifyAdminOrder
	var totalPageCount int
	GetAdminOrderList(userId, companyId, reqPage, &totalPageCount, &notifyAdminOrder.OrderedInfoList)

	notifyAdminOrder.AccessToken = newAccToken
	notifyAdminOrder.RefreshToken = newRefreshToken
	notifyAdminOrder.TotalPageCount = totalPageCount

	// JSON 응답 생성
	response, err := json.Marshal(notifyAdminOrder)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Marshal).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.Send(response)
}
