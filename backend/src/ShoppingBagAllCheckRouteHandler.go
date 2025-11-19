package src

import (
	"encoding/json"
	"sync"

	"github.com/gofiber/fiber/v2"
)

func ShoppingBagAllCheckRouteHandler(c *fiber.Ctx) error {

	var reqShoppingBagAllCheck ReqShoppingBagAllCheck
	if err := c.BodyParser(&reqShoppingBagAllCheck); err != nil {
		Logger.Error(err)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}
	accToken := reqShoppingBagAllCheck.AccessToken
	refreshToken := reqShoppingBagAllCheck.RefreshToken
	userId := reqShoppingBagAllCheck.LoginId

	newAccToken, refreshToken := CheckAndUpdateToken(userId, accToken, refreshToken)
	if newAccToken == "" {
		return c.Status(Error_LoginAgain).JSON(fiber.Map{"error": ""})
	}

	var resShoppingBagAllCheck ResShoppingBagAllCheck

	resShoppingBagAllCheck.AccessToken = newAccToken
	resShoppingBagAllCheck.RefreshToken = refreshToken

	errBool, isChecked := AllChangeCheck(userId)
	if errBool == false {
		return c.Status(Error_PlzRefresh).JSON(fiber.Map{"error": ""})
	}

	// 락걸고 메모리 값 바꿔주기
	{

		// 삭제 완료(락)
		var mu sync.Mutex
		mu.Lock()
		defer mu.Unlock()

		productIdMap := userShoppingBagFromDBMap[userId]
		for _, productIter := range productIdMap {
			for _, ShoppingBagDetailInfo := range productIter {
				if ShoppingBagDetailInfo == nil {
					continue
				}

				ShoppingBagDetailInfo.IsChecked = isChecked
			}
		}
	}

	// JSON 응답 생성
	response, err := json.Marshal(resShoppingBagAllCheck)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Marshal).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.Send(response)
}
