package src

import (
	"sync"
	"time"
)

var MailAuthMap sync.Map // key:email, value:struct(EmailAuthInfo)

type EmailAuthInfo struct {
	expireTime int64
	authNum    int
	isAuthed   bool
}

func InsertMailAuth(email string, authNum int) {

	// 현재 시간을 얻습니다.
	currentTime := time.Now()

	// 3분을 더합니다.
	threeMinutesLater := currentTime.Add(3 * time.Minute)

	var emailAuthInfo EmailAuthInfo
	emailAuthInfo.expireTime = threeMinutesLater.Unix()
	emailAuthInfo.authNum = authNum
	emailAuthInfo.isAuthed = false

	MailAuthMap.Store(email, emailAuthInfo)
}

func UpdateAuthMail(email string, authNum int) int {
	value, found := MailAuthMap.Load(email)
	if found {
		if emailAuthInfo, ok := value.(EmailAuthInfo); ok {

			curTime := time.Now().Unix()

			if emailAuthInfo.expireTime < curTime {
				return Error_ExpiredAuthTime
			}

			if authNum != emailAuthInfo.authNum {
				return Error_WrongAuthNum
			}

			emailAuthInfo.isAuthed = true
			MailAuthMap.Store(email, emailAuthInfo)

			return Error_None
		}
	}

	return Error_NotTryAuth
}

func CheckSignUpAuth(email string) int {
	value, found := MailAuthMap.Load(email)
	if found {
		if emailAuthInfo, ok := value.(EmailAuthInfo); ok {

			if emailAuthInfo.isAuthed == true {
				return Error_None
			}
		}
	}

	return Error_NotTryAuth
}

func DeleteEmailAuth(email string) {
	MailAuthMap.Delete(email)
}
