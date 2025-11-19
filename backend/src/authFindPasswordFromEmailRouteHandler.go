package src

import (
	"fmt"
	"math/rand"
	"net/smtp"
	"time"

	"github.com/gofiber/fiber/v2"
)

func AuthFindPasswordFromEmailRouteHandler(c *fiber.Ctx) error {

	var reqAuthFindPasswordFromEmail ReqAuthFindPasswordFromEmail
	if err := c.BodyParser(&reqAuthFindPasswordFromEmail); err != nil {
		Logger.Error(err)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}

	reqEmail := reqAuthFindPasswordFromEmail.Email
	reqId := reqAuthFindPasswordFromEmail.Id

	// 이미 가입된 이메일인지 확인
	if IsJoinedEmail(reqEmail) == false {
		Logger.Error("Not IsJoinedEmail. mail:", reqEmail)
		return c.Status(Error_NotJoinedEmail).JSON(fiber.Map{"error": ""})
	}

	// 이미 가입된 아이디인지 확인
	if IsJoinedId(reqId) == false {
		Logger.Error("Not IsJoinedId. mail:", reqEmail)
		return c.Status(Error_NotExistId).JSON(fiber.Map{"error": ""})
	}

	// 사용자의 Gmail 계정 정보
	gmailUsername := "hyymi1469@gmail.com" // test ymi 나중에 회사 메일로 매핑
	gmailPassword := "vdkz newd qjxk ifyi"
	//vdkz newd qjxk ifyi

	// 수신자 이메일 주소
	toEmail := reqEmail

	// 이메일 제목과 내용
	emailSubject := "인증 메일" // test ymi 나중에 제목 넣기!
	emailBody := "안녕하세요, 아래 번호를 인증칸에 적어 주세요.\n"

	// 현재 시간을 seed로 사용
	rand.Seed(time.Now().UnixNano())

	// 100000부터 999999 사이의 랜덤 숫자 생성
	authRandomInt := rand.Intn(900000) + 100000
	emailBody += fmt.Sprintf("%d", authRandomInt)

	// Gmail SMTP 서버 주소와 포트
	smtpServer := "smtp.gmail.com"
	smtpPort := "587"

	// 메일 서버 설정
	auth := smtp.PlainAuth("", gmailUsername, gmailPassword, smtpServer)

	// 메일 헤더 및 본문 작성
	msg := []byte("To: " + toEmail + "\r\n" +
		"Subject: " + emailSubject + "\r\n" +
		"\r\n" +
		emailBody)

	// 이메일 전송
	err := smtp.SendMail(smtpServer+":"+smtpPort, auth, gmailUsername, []string{toEmail}, msg)
	if err != nil {
		Logger.Error(err)
		return c.Status(Error_Parse).JSON(fiber.Map{"error": ""})
	}

	Logger.Info("send to auth. mail:", toEmail)

	InsertMailAuth(reqEmail, authRandomInt)

	// JSON 응답 보내기
	return c.SendStatus(200)
}
