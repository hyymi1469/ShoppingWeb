package src

import (
	"sync"
	"time" // bcrypt 패키지 import

	"github.com/dgrijalva/jwt-go"
)

var TokenMap sync.Map // key:userId, value:struct(TokenInfo)

var (
	secretKey        = []byte("yumyeongin")
	refreshSecretKey = []byte("yundahye")
)

type TokenInfo struct {
	accessToken  string
	refreshToken string
}

func TokenGenerate(userId string) (string, string) {
	// 엑세스 토큰 생성
	accessClaims := jwt.MapClaims{
		"user_id": userId,
		"exp":     time.Now().Add(time.Hour * 24 * 1).Unix(), // 엑세스 토큰 만료 시간 (1시간)
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)
	accessTokenString, _ := accessToken.SignedString(secretKey)

	// 리프레시 토큰 생성
	refreshClaims := jwt.MapClaims{
		"user_id": userId,
		"exp":     time.Now().Add(time.Hour * 24 * 3).Unix(), // 리프레시 토큰 만료 시간 (3시간)
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)
	refreshTokenString, _ := refreshToken.SignedString(refreshSecretKey)

	var tokenInfo TokenInfo
	tokenInfo.accessToken = accessTokenString
	tokenInfo.refreshToken = refreshTokenString

	TokenMap.Store(userId, tokenInfo)

	return accessTokenString, refreshTokenString
}

func UpdateToken(userId string, accessTokenStr string, refreshTokenStr string) {

	var tokenInfo TokenInfo
	tokenInfo.accessToken = accessTokenStr
	tokenInfo.refreshToken = refreshTokenStr

	TokenMap.Store(userId, tokenInfo)
}

func CheckAndUpdateToken(userId string, reqAccToken string, reqRefreshToken string) (string, string) {
	value, found := TokenMap.Load(userId)
	if found {
		if tokenInfo, ok := value.(TokenInfo); ok {

			if tokenInfo.accessToken == reqAccToken {

				if tokenInfo.refreshToken != reqRefreshToken {
					ClearToken(userId)
					return "", ""
				}

				// 만료 확인
				curAccToken, err := jwt.Parse(tokenInfo.accessToken, func(token *jwt.Token) (interface{}, error) {
					return secretKey, nil
				})

				if err != nil || !curAccToken.Valid {
					// 토큰이 유효하지 않음 또는 서명이 잘못됨(재로그인 시키기)
					ClearToken(userId)
					return "", ""
				}

				// 토큰에서 만료 시간 추출
				curAccClaims, ok := curAccToken.Claims.(jwt.MapClaims)
				if !ok {
					// 재로그인 시키기
					ClearToken(userId)
					return "", ""
				}

				// 현재 시간과 만료 시간 비교
				accessKeyExpTime := (int64)(curAccClaims["exp"].(float64))
				currentTime := time.Now().Unix()

				// 토큰 만료. refresh토큰 시간이 지나지 않았다면 두 토큰을 업데이트 해 주고 로그인 유지
				if accessKeyExpTime < currentTime {
					// 만료 확인
					curRefreshToken, err := jwt.Parse(tokenInfo.refreshToken, func(token *jwt.Token) (interface{}, error) {
						return refreshSecretKey, nil
					})

					if err != nil || !curRefreshToken.Valid {
						// 토큰이 유효하지 않음 또는 서명이 잘못됨(재로그인 시키기)
						ClearToken(userId)
						return "", ""
					}

					// 토큰에서 만료 시간 추출
					curRefreshClaims, ok := curRefreshToken.Claims.(jwt.MapClaims)
					if !ok {
						// 재로그인 시키기
						ClearToken(userId)
						return "", ""
					}

					// 현재 시간과 만료 시간 비교
					refreshKeyExpTime := (int64)(curRefreshClaims["exp"].(float64))
					if refreshKeyExpTime < currentTime {

						// 리프래시 토큰도 시간이 지났다면 로그아웃 시킨다.
						ClearToken(userId)
						return "", ""

					} else {
						// 로그인 유지하되, 토큰값 변경해서 리턴
						newAccToken, newRefreshToken := TokenGenerate(userId)
						return newAccToken, newRefreshToken
					}

				} else {
					return reqAccToken, reqRefreshToken
				}

			} else {

				ClearToken(userId)
				return "", ""
			}

		} else {
			ClearToken(userId)
			return "", ""
		}
	} else {
		ClearToken(userId)
		return "", ""
	}
}

func ClearToken(userId string) {
	TokenMap.Delete(userId)
}

func doLogout(userId string) bool {

	ClearToken(userId)
	return true
}
