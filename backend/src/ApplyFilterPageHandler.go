package src

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func ApplyFilterPageRouteHandler(c *fiber.Ctx) error {

	// URL 쿼리 문자열에서 filter_list 파라미터 추출
	reqPage := c.Query("page")
	userId := c.Query("user_id")
	reqProductType := c.Query("product_type")
	reqDetailType := c.Query("detail_type")
	reqFilterListParam := c.Query("filter_list")

	var filterList []int
	err := json.Unmarshal([]byte(reqFilterListParam), &filterList)
	if err != nil {
		fmt.Println("JSON 파싱 에러:", err)
		return c.Status(Error_MarshalError).SendString("JSON 파싱 에러")
	}

	page, err := strconv.Atoi(reqPage)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	page -= 1

	queryStr := ""
	filterStr := ""

	// 필터가 비어있을 경우 모든 정보를 주는 것으로 처리
	if len(filterList) == 0 {
		queryStr = fmt.Sprintf("SELECT product_id "+
			"FROM products.product_type_detail "+
			"WHERE product_type=%s AND detail_type=%s "+
			"GROUP BY product_id "+
			" LIMIT %d OFFSET %d;",
			reqProductType, reqDetailType, G_ShowProductsCount, G_ShowProductsCount*page)
	} else {

		// 슬라이스의 각 요소를 문자열로 변환
		filterListStr := ""
		for _, num := range filterList {
			filterListStr += strconv.Itoa(num)
			filterListStr += ","
		}

		if len(filterListStr) <= 0 {
			Logger.Error("filterListStr size error. filterListStr:", len(filterListStr))
			return c.Status(Error_FailLogout).JSON(fiber.Map{"error": ""})
		}

		// 문자열의 마지막 문자를 제거
		filterStr = filterListStr[:len(filterListStr)-1]

		queryStr = fmt.Sprintf("SELECT product_id "+
			"FROM products.product_type_detail "+
			"WHERE product_type=%s AND detail_type=%s AND filter in(%s) "+
			"GROUP BY product_id "+
			" LIMIT %d OFFSET %d;",
			reqProductType, reqDetailType, filterStr, G_ShowProductsCount, G_ShowProductsCount*page)
	}

	rows, err := DbObject.Query(queryStr)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Select).JSON(fiber.Map{"error": ""})
	}

	var resProductPageInfo ResProductPageInfo
	for rows.Next() {

		var productId int64
		if err := rows.Scan(
			&productId); err != nil {
			Logger.Error(err)
			return c.Status(Error_SelectErr).JSON(fiber.Map{"error": ""})
		}

		GetProductList(productId, userId, &resProductPageInfo.ProductImgInfo)
	}

	productType, err := strconv.Atoi(reqProductType)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	detailType, err := strconv.Atoi(reqDetailType)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Atoi).JSON(fiber.Map{"error": ""})
	}

	if GetCategoryPage(productType, detailType, filterStr, &resProductPageInfo.TotalPageCount) == false {
		Logger.Error(err)
		return c.Status(Error_DBCountError).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 생성
	response, err := json.Marshal(resProductPageInfo)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Marshal).JSON(fiber.Map{"error": ""})
	}

	// JSON 응답 보내기
	return c.Send(response)
}
