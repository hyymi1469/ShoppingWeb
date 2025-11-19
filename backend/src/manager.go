package src

import (
	"fmt"
	"log"
	"net"
	"os"
	"strconv"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/sirupsen/logrus"
	"gopkg.in/natefinch/lumberjack.v2"
)

var Logger *logrus.Logger
var baseURL string
var Port int = 8001
var ImgPath string = "dynamic_images"

func Init() {

	// 로그 설정
	setLogConf()

	app := fiber.New(fiber.Config{
		BodyLimit: 25 * 1024 * 1024, // this is the default limit of 25MB
	})

	// 프론트앤드 연결
	app.Static("/"+ImgPath, "../"+ImgPath, fiber.Static{
		ByteRange: true,
	})

	// 아이피번호
	conn, err := net.Dial("udp", "8.8.8.8:80") // 구글 DNS(외부)와 가짜 UDP 연결
	if err != nil {
		panic(err)
	}
	defer conn.Close()

	env := os.Getenv("ENV")
	if env == "production" {
		baseURL = "http://3.39.225.205"
	} else {
		baseURL = "http://localhost:8001"
	}
	fmt.Println("ENV:", env, "=> baseURL:", baseURL)
	Logger.Info(baseURL)
	//fmt.Println("현재 장비 IP:", localAddr.IP.String())

	// DB 연결
	DbConnect()

	// 세션 미들웨어 설정
	app.Use(cors.New())
	app.Use(logger.New())
	app.Use(recover.New())

	SetRoute(app)

	log.Fatal(app.Listen(":" + strconv.Itoa(Port)))

}

func Run() {

}

func setLogConf() {

	fileName := "./" + fmt.Sprintf("logfile_%s.log", time.Now().Format("2006-01-02 15"))
	lum := &lumberjack.Logger{
		Filename:   fileName,
		MaxSize:    10,
		MaxBackups: 9999999,
		MaxAge:     9999999,
		Compress:   true,
	}

	Logger = logrus.New()
	Logger.SetLevel(logrus.InfoLevel)
	Logger.SetOutput(lum)
	Logger.SetReportCaller(true) // 해당 이벤트 발생 하는 함수, 파일명이 찍힘.
	Logger.SetFormatter(&logrus.TextFormatter{
		TimestampFormat: "2006-01-02 15:04:05",
		FullTimestamp:   true,
		ForceQuote:      true,
	})

}
