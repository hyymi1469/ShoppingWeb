package src

import (
	"encoding/json"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func SearchRouteHandler(c *fiber.Ctx) error {

	searchWord := c.Query("word")
	reqPageStr := c.Query("page")
	userId := c.Query("user_id")

	reqPage, err := strconv.Atoi(reqPageStr)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	reqPage -= 1

	var totalPageCount int
	var productImgInfoList []ProductImgInfo
	GetSearchList(searchWord, reqPage, userId, &totalPageCount, &productImgInfoList)

	var resSearch ResSearch
	resSearch.TotalPageCount = totalPageCount
	resSearch.ProductImgInfo = productImgInfoList

	// JSON 응답 생성
	response, err := json.Marshal(resSearch)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Marshal).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.Send(response)
}
