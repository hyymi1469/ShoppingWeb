package src

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func ShoppingBagListRouteHandler(c *fiber.Ctx) error {

	var reqShoppingBagList ReqShoppingBagList
	if err := c.BodyParser(&reqShoppingBagList); err != nil {
		Logger.Error(err)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}
	accToken := reqShoppingBagList.AccessToken
	refreshToken := reqShoppingBagList.RefreshToken
	userId := reqShoppingBagList.LoginId

	newAccToken, refreshToken := CheckAndUpdateToken(userId, accToken, refreshToken)
	if newAccToken == "" {
		return c.Status(Error_LoginAgain).JSON(fiber.Map{"error": ""})
	}

	var resShoppingBagList ResShoppingBagList

	resShoppingBagList.AccessToken = newAccToken
	resShoppingBagList.RefreshToken = refreshToken

	shoppingBagMap := userShoppingBagFromDBMap[userId]

	companyTotalPriceMap := make(map[int64]int)
	for productId, shoppintMap := range shoppingBagMap {

		for _, optionIter := range shoppintMap {
			var shoppingBagInfo ShoppingBagInfo
			shoppingBagInfo.Entity = optionIter.Entity
			shoppingBagInfo.OptionId = optionIter.OptionId

			productInfo := ProductInfoFromDBMap[productId]

			shoppingBagInfo.ImgURL = fmt.Sprintf("%s/dynamic_images/%d/%s", baseURL, productInfo.productId, GetTileImgName(productInfo.imgUrl))
			shoppingBagInfo.Description = strings.Replace(productInfo.description, "\\n", "\n", -1)
			shoppingBagInfo.Price = productInfo.price
			shoppingBagInfo.ProductId = fmt.Sprintf("%d", productInfo.productId)
			shoppingBagInfo.CompanyName = strings.Replace(productInfo.companyName, "\\n", "\n", -1)

			optionMap := ProductOptionFromDBMap[productId]
			if optionMap == nil {
				continue
			}

			productOptionInfo := optionMap[optionIter.OptionId]
			shoppingBagInfo.OptionName = productOptionInfo.OptionName
			shoppingBagInfo.AddPrice = productOptionInfo.AddPrice

			productHeartMap, isExist := productHeartFromDBMap[userId]
			if !isExist {
				continue
			}

			isHeart := productHeartMap[productId]

			shoppingBagInfo.IsLike = isHeart
			shoppingBagInfo.IsChecked = optionIter.IsChecked

			resShoppingBagList.ShoppingBagInfo = append(resShoppingBagList.ShoppingBagInfo, shoppingBagInfo)

			if optionIter.IsChecked == true {
				companyTotalPriceMap[productInfo.companyId] += optionIter.Entity * (productInfo.price + productOptionInfo.AddPrice)
			}
		}
	}

	// 배송비 계산
	for companyId, totalPrice := range companyTotalPriceMap {
		companyInfo, isExist := companyInfoFromDBMap[companyId]
		if companyInfo == nil {
			Logger.Error("companyInfo is null. companyId:", companyId)
			return c.Status(Error_FailLogout).JSON(fiber.Map{"error": ""})
		}

		var deliveryPriceInfo DeliveryPriceInfo
		deliveryPriceInfo.CompanyName = companyInfo.companyName
		deliveryPriceInfo.DeliveryPrice = companyInfo.deliveryPrice

		if isExist == false {
			Logger.Error("companyInfoFromDBMap is null. companyId:", companyId)
			return c.Status(Error_FailLogout).JSON(fiber.Map{"error": ""})
		}

		if companyInfo.deliveryCondition <= totalPrice {
			deliveryPriceInfo.DeliveryPrice = 0
		}

		resShoppingBagList.DeliveryPriceInfo = append(resShoppingBagList.DeliveryPriceInfo, deliveryPriceInfo)

	}

	// JSON 응답 생성
	response, err := json.Marshal(resShoppingBagList)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Marshal).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.Send(response)
}
