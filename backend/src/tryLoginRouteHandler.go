package src

import (
	"encoding/json"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt" // bcrypt 패키지 import
)

func TryLoginRouteHandler(c *fiber.Ctx) error {

	var reqTryLogin ReqTryLogin
	if err := c.BodyParser(&reqTryLogin); err != nil {
		Logger.Error(err)
		return c.Status(Error_MarshalError).JSON(fiber.Map{
			"error": "JSON 파싱 오류",
		})
	}

	id := reqTryLogin.LoginId
	password := reqTryLogin.LoginPassword

	queryStr := fmt.Sprintf("SELECT `id`, `password`, `company_id` from products.account "+
		"WHERE id like '%s';", id)

	rows, err := DbObject.Query(queryStr)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Select).JSON(fiber.Map{"error": ""})
	}

	defer rows.Close() // 함수가 끝날 때 결과 집합 닫기

	for rows.Next() {
		//var productInfo ProductInfo

		var dbId string
		var dbPassword string
		var companyId int64
		if err := rows.Scan(
			&dbId,
			&dbPassword,
			&companyId); err != nil {
			Logger.Error(err)
			return c.Status(Error_SelectErr).JSON(fiber.Map{"error": ""})
		}

		// Bcrypt 해시 비교
		err := bcrypt.CompareHashAndPassword(([]byte)(dbPassword), []byte(password))

		// 로그인 성공
		if err == nil {

			// 토큰 생성
			accessTokenStr, refreshTokenStr := TokenGenerate(id)
			UpdateToken(id, accessTokenStr, refreshTokenStr)

			var resTryLogin ResTryLogin
			resTryLogin.LoginId = id
			resTryLogin.AccessToken = accessTokenStr
			resTryLogin.RefreshToken = refreshTokenStr
			resTryLogin.UserCompanyId = companyId

			response, err := json.Marshal(resTryLogin)
			if err != nil {
				Logger.Error(err)
				return c.Status(Error_Marshal).JSON(fiber.Map{"error": ""})
			}

			// JSON 응답 보내기
			return c.Send(response)

		} else {
			//fmt.Println("비밀번호 불일치")
			return c.Status(Error_NotComparePW).JSON(fiber.Map{"error": ""})
		}
	}

	// 해당 아이디는 없는 아이디입니다. 보내기
	return c.Status(Error_NotExistId).JSON(fiber.Map{"error": ""})
}
