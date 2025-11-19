package src

import (
	"strings"
	"unicode"
)

// bcrypt 패키지 import

func ContainsAlphanumeric(s string) bool {

	isDigit := false
	isLetter := false

	for _, char := range s {
		if unicode.IsDigit(char) {
			isDigit = true
		}

		if unicode.IsLetter(char) {
			isLetter = true
		}

		if isDigit == true && isLetter == true {
			return true
		}

	}
	return false
}

func ReviewFilePath(productId string, userId string, orderSerial string) string {
	uploadsPath := "./review/"
	uploadsPath += productId
	uploadsPath += "/"
	uploadsPath += userId
	uploadsPath += "/"
	uploadsPath += orderSerial

	return uploadsPath
}

func GetUnknownUserId(userId string) string {

	if len(userId) < 3 {
		Logger.Error("id len is min. id:" + userId)
	}

	// 첫 두 글자를 제외하고 나머지를 '*'로 대체
	resultString := userId[:2] + strings.Repeat("*", len(userId)-2)
	resultString += "****"

	return resultString

}

func GetFileExtension(fileName string) string {
	// 파일명을 소문자로 변환하여 일관된 비교를 수행
	fileNameLower := strings.ToLower(fileName)

	// 마지막 점의 위치 찾기
	lastDotIndex := strings.LastIndex(fileNameLower, ".")

	// 마지막 점이 없거나 파일명이 마지막에 있는 경우 확장자가 없음
	if lastDotIndex == -1 || lastDotIndex == len(fileNameLower)-1 {
		return ""
	}

	// 마지막 점 이후의 문자열 반환
	extension := fileName[lastDotIndex+1:]
	return extension
}
