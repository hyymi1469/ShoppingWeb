package src

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var DbObject *sql.DB

type ProductInfo struct {
	productId   int64
	productType int // product_type 참조
	imgUrl      string
	price       int
	description string
	companyName string
	companyId   int64
}

type ShoppingBagDetailInfo struct {
	Entity    int
	OptionId  int
	IsChecked bool
}

type CompanyInfo struct {
	companyName       string
	deliveryPrice     int
	deliveryCondition int
	etcDeliveryPrice  int
}

type ProductReview struct {
	userId      string
	reviewMsg   string
	gradePoint  int
	date        string
	orderSerial int64
	isPath      bool
}

type ProductReviewInfo struct {
	avgGradePoint     string
	productReviewMap  map[string][]ProductReview // key:userId
	productReviewList []ProductReview
}

type OrderedListInfo struct {
	userId      string
	orderDate   string
	orderSerial int64
	productId   int64
	optionId    int
	entity      int
	totalPrice  int
	state       int
	address     string
	companyId   int64
}

var productInfoPageFromDBMap map[int][]ProductInfo                               // key:Page
var productInfoTypeFromDBMap map[int]map[int][]ProductInfo                       // key:productType key:page
var ProductInfoFromDBMap map[int64]ProductInfo                                   // key:productId
var ProductOptionFromDBMap map[int64]map[int]ProductOptionInfo                   // key:productId, key:optionId
var ProductImgPathFromDBMap map[int64][]ProductDetailImgInfo                     // key:productId
var productHeartFromDBMap map[string]map[int64]bool                              // key:userId key:productId
var userShoppingBagFromDBMap map[string]map[int64]map[int]*ShoppingBagDetailInfo // key:userId key:productId ley:optionId
var companyInfoFromDBMap map[int64]*CompanyInfo                                  // key:companyId
var productReviewFromDBMap map[int64]*ProductReviewInfo                          // key:productId
var orderedListFromDBMap map[string]map[int64][]*OrderedListInfo                 // key:userId key:productId

type ProductTypeDetail struct {
	detailType map[int]bool // product_type_detail 참조
}

var productTypeDetailFromDBMap map[int64]ProductTypeDetail // key:productId

func DbConnect() {

	dbInfo := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", "root", "113456", "127.0.0.1", "3306", "products")

	var err error
	DbObject, err = sql.Open("mysql", dbInfo)
	if err != nil {
		Logger.Error("MySQL 접속 실패:", err)
		panic(err)
	}

	// 연결이 성공했는지 확인
	err = DbObject.Ping()
	if err != nil {
		Logger.Error("MySQL 연결 실패:", err)
		panic(err)
	}

	log.Println("mysql connection Success")

	loadFromDB() // 최초 1회는 그냥 실행
	go fromDBLoad()
}

func loadFromDB() {
	var mu sync.Mutex
	mu.Lock()
	defer mu.Unlock()

	loadProductInfoFromDB()
	loadproductTypeDetailFromDB()
	loadproductOptionFromDB()
	loadproductImgPathFromDB()
	loadProductHeartFromDB()
	loadUserShoppingBagFromDB()
	loadCompanyInfoFromDB()
	loadProductReviewFromDB()
	loadOrderedListFromDB()
}

// 락을 사용하므로 DB 전체불러오기만 하는 곳이다.
func fromDBLoad() {

	interval := 1 * time.Hour // 원하는 시간 간격으로 변경

	for {
		time.Sleep(interval)
		loadFromDB()
	}

}

func loadProductInfoFromDB() {
	productInfoPageFromDBMap = make(map[int][]ProductInfo)
	productInfoTypeFromDBMap = make(map[int]map[int][]ProductInfo)
	ProductInfoFromDBMap = make(map[int64]ProductInfo)

	// SELECT 쿼리 실행
	rows, err := DbObject.Query("SELECT " +
		"A.product_id, " +
		"A.product_type, " +
		"A.img_url, " +
		"A.price, " +
		"A.description, " +
		"B.company_name, " +
		"B.company_id " +
		"FROM `products`.`product_info` AS A " +
		"INNER JOIN  `products`.`company_info` as B " +
		" ON A.company_id = B.company_id;")
	if err != nil {
		Logger.Error(err.Error())
		return
	}

	defer rows.Close() // 함수가 끝날 때 결과 집합 닫기

	// 결과 반복 처리
	for rows.Next() {
		var productInfo ProductInfo

		if err := rows.Scan(
			&productInfo.productId,
			&productInfo.productType,
			&productInfo.imgUrl,
			&productInfo.price,
			&productInfo.description,
			&productInfo.companyName,
			&productInfo.companyId); err != nil {
			panic(err.Error())
		}

		//productInfo.imgUrl = "http://" + localIpStr + ":" + strconv.Itoa(Port) + "/" + imgPath + "/" + strconv.Itoa(int(productInfo.productId)) + "/"

		ProductInfoFromDBMap[productInfo.productId] = productInfo

		// 페이지 map
		{
			curPage := len(productInfoPageFromDBMap)
			if curPage == 0 {
				curPage = 1
			}

			// 특정 갯수 이상이 되면 page를 늘려준다.
			if len(productInfoPageFromDBMap[curPage]) == G_ShowProductsCount {

				curPage += 1
			}

			value, isExist := productInfoPageFromDBMap[curPage]
			if isExist {

				value = append(value, productInfo)
				productInfoPageFromDBMap[curPage] = value
			} else {

				productInfoPageFromDBMap[curPage] = append(productInfoPageFromDBMap[curPage], productInfo)
			}

		}

		// 타입 map
		{
			pageValueMap := productInfoTypeFromDBMap[productInfo.productType]

			if pageValueMap == nil {
				pageValueMap = make(map[int][]ProductInfo)
			}

			curPage := len(pageValueMap)
			if curPage == 0 {
				curPage = 1
			}

			// 특정 갯수 이상이 되면 page를 늘려준다.
			if len(pageValueMap[curPage]) == G_ShowProductsCount {
				curPage += 1
			}

			values, isExist := pageValueMap[curPage]
			if isExist {

				values = append(values, productInfo)
				pageValueMap[curPage] = values
			} else {

				pageValueMap[curPage] = append(pageValueMap[curPage], productInfo)
			}

			productInfoTypeFromDBMap[productInfo.productType] = pageValueMap
		}
	}

	// 에러 처리
	if err := rows.Err(); err != nil {
		Logger.Error(err.Error())
	}
}

func loadproductTypeDetailFromDB() {
	productTypeDetailFromDBMap = make(map[int64]ProductTypeDetail)
	// SELECT 쿼리 실행
	rows, err := DbObject.Query("SELECT " +
		"`product_type_detail`.`product_id`, " +
		"`product_type_detail`.`detail_type` " +
		"FROM `products`.`product_type_detail`;")
	if err != nil {
		panic(err.Error())
	}

	defer rows.Close() // 함수가 끝날 때 결과 집합 닫기

	// 결과 반복 처리
	for rows.Next() {
		var productId int64
		var detailType int
		if err := rows.Scan(
			&productId,
			&detailType); err != nil {
			Logger.Error(err.Error())
		}

		value, isExist := productTypeDetailFromDBMap[productId]
		if isExist {
			value.detailType[detailType] = true
			productTypeDetailFromDBMap[productId] = value
		} else {
			var productTypeDetail ProductTypeDetail
			productTypeDetail.detailType = make(map[int]bool)
			productTypeDetail.detailType[detailType] = true
			productTypeDetailFromDBMap[productId] = productTypeDetail
		}
	}
}

func loadproductOptionFromDB() {
	ProductOptionFromDBMap = make(map[int64]map[int]ProductOptionInfo)

	// SELECT 쿼리 실행
	rows, err := DbObject.Query("SELECT " +
		"`product_option`.`product_id`, " +
		"`product_option`.`option_id`, " +
		"`product_option`.`add_price`, " +
		"`product_option`.`option_name` " +
		"FROM `products`.`product_option`;")
	if err != nil {
		panic(err.Error())
	}

	defer rows.Close() // 함수가 끝날 때 결과 집합 닫기

	// 결과 반복 처리
	for rows.Next() {
		var productId int64
		var optionId int
		var addPrice int
		var optionName string
		if err := rows.Scan(
			&productId,
			&optionId,
			&addPrice,
			&optionName); err != nil {
			Logger.Error(err.Error())
		}

		var productOptionInfo ProductOptionInfo
		productOptionInfo.AddPrice = addPrice
		productOptionInfo.OptionId = optionId
		productOptionInfo.OptionName = optionName

		optionMap := ProductOptionFromDBMap[productId]
		if optionMap == nil {
			optionMap = make(map[int]ProductOptionInfo)
		}

		optionMap[optionId] = productOptionInfo
		ProductOptionFromDBMap[productId] = optionMap

	}
}

func loadproductImgPathFromDB() {

	ProductImgPathFromDBMap = make(map[int64][]ProductDetailImgInfo)

	// SELECT 쿼리 실행
	rows, err := DbObject.Query("SELECT " +
		"`product_imge_path`.`product_id`, " +
		"`product_imge_path`.`img_path`, " +
		"`product_imge_path`.`order` " +
		"FROM `products`.`product_imge_path`;")
	if err != nil {
		panic(err.Error())
	}

	defer rows.Close() // 함수가 끝날 때 결과 집합 닫기

	// 결과 반복 처리
	for rows.Next() {
		var productId int64
		var imgPath string
		var order int

		if err := rows.Scan(
			&productId,
			&imgPath,
			&order); err != nil {
			Logger.Error(err.Error())
		}

		resultPath := imgPath
		var productDetailImgInfo ProductDetailImgInfo
		productDetailImgInfo.ImgPath = resultPath
		productDetailImgInfo.Order = order

		value, isExist := ProductImgPathFromDBMap[productId]
		if isExist {
			value = append(value, productDetailImgInfo)
			ProductImgPathFromDBMap[productId] = value
		} else {
			var productDetailImgInfoList []ProductDetailImgInfo
			productDetailImgInfoList = append(productDetailImgInfoList, productDetailImgInfo)
			ProductImgPathFromDBMap[productId] = productDetailImgInfoList
		}
	}
}

func loadUserShoppingBagFromDB() {
	userShoppingBagFromDBMap = make(map[string]map[int64]map[int]*ShoppingBagDetailInfo)

	// SELECT 쿼리 실행
	rows, err := DbObject.Query("SELECT " +
		"`user_shopping_bag`.`user_id`, " +
		"`user_shopping_bag`.`product_id`, " +
		"`user_shopping_bag`.`entity`, " +
		"`user_shopping_bag`.`option_id`, " +
		"`user_shopping_bag`.`is_checked` " +
		"FROM `products`.`user_shopping_bag`;")
	if err != nil {
		panic(err.Error())
	}
	defer rows.Close() // 함수가 끝날 때 결과 집합 닫기

	// 결과 반복 처리
	for rows.Next() {
		var userId string
		var productId int64
		var entity int
		var optionId int
		var isChecked int

		if err := rows.Scan(
			&userId,
			&productId,
			&entity,
			&optionId,
			&isChecked); err != nil {
			Logger.Error(err.Error())
		}

		productIdMap := userShoppingBagFromDBMap[userId]
		if productIdMap == nil {
			productIdMap = make(map[int64]map[int]*ShoppingBagDetailInfo)
		}

		var shoppingBagDetailInfo ShoppingBagDetailInfo
		shoppingBagDetailInfo.OptionId = optionId
		shoppingBagDetailInfo.Entity = entity
		shoppingBagDetailInfo.IsChecked = isChecked != 0

		optionIdMap := productIdMap[productId]
		if optionIdMap == nil {
			optionIdMap = make(map[int]*ShoppingBagDetailInfo)
		}

		optionIdMap[optionId] = &shoppingBagDetailInfo

		productIdMap[productId] = optionIdMap

		userShoppingBagFromDBMap[userId] = productIdMap
	}
}

func loadCompanyInfoFromDB() {
	companyInfoFromDBMap = make(map[int64]*CompanyInfo)

	// SELECT 쿼리 실행
	rows, err := DbObject.Query("SELECT " +
		"`company_info`.`company_id`, " +
		"`company_info`.`company_name`, " +
		"`company_info`.`delivery_price`, " +
		"`company_info`.`delivery_condition`, " +
		"`company_info`.`etc_delivery_price` " +
		"FROM `products`.`company_info`;")
	if err != nil {
		panic(err.Error())
	}

	defer rows.Close() // 함수가 끝날 때 결과 집합 닫기

	// 결과 반복 처리
	for rows.Next() {
		var companyId int64
		var companyName string
		var deliveryPrice int
		var deliveryCondition int
		var etcDeliveryPrice int

		if err := rows.Scan(
			&companyId,
			&companyName,
			&deliveryPrice,
			&deliveryCondition,
			&etcDeliveryPrice); err != nil {
			Logger.Error(err.Error())
		}

		companyInfo := companyInfoFromDBMap[companyId]
		if companyInfo == nil {
			companyInfo = &CompanyInfo{}
			companyInfoFromDBMap[companyId] = companyInfo
		}

		companyInfo.companyName = companyName
		companyInfo.deliveryCondition = deliveryCondition
		companyInfo.deliveryPrice = deliveryPrice
		companyInfo.etcDeliveryPrice = etcDeliveryPrice
	}
}

func loadProductReviewFromDB() {
	productReviewFromDBMap = make(map[int64]*ProductReviewInfo)

	// SELECT 쿼리 실행
	rows, err := DbObject.Query("SELECT " +
		"`product_review`.`product_id`, " +
		"`product_review`.`user_id`, " +
		"`product_review`.`review_msg`, " +
		"`product_review`.`grade_point`, " +
		"`product_review`.`date`, " +
		"`product_review`.`order_serial`, " +
		"`product_review`.`is_path` " +
		"FROM `products`.`product_review`;")
	if err != nil {
		panic(err.Error())
	}

	defer rows.Close() // 함수가 끝날 때 결과 집합 닫기

	// 결과 반복 처리
	for rows.Next() {
		var (
			productID   int64
			userID      string
			reviewMsg   string
			gradePoint  int
			date        string
			orderSerial int64
			isPath      bool
		)

		err := rows.Scan(&productID, &userID, &reviewMsg, &gradePoint, &date, &orderSerial, &isPath)
		if err != nil {
			Logger.Error(err.Error())
			log.Fatal(err)
		}

		var productReview ProductReview
		productReview.date = date
		productReview.gradePoint = gradePoint
		productReview.orderSerial = orderSerial
		productReview.isPath = isPath
		productReview.reviewMsg = reviewMsg
		productReview.userId = userID

		productReviewInfo := productReviewFromDBMap[productID]
		if productReviewInfo == nil {
			productReviewInfo = &ProductReviewInfo{}
		}

		if productReviewInfo.productReviewMap == nil {
			productReviewInfo.productReviewMap = make(map[string][]ProductReview)
		}

		reviewList := productReviewInfo.productReviewMap[userID]
		reviewList = append(reviewList, productReview)

		productReviewInfo.productReviewMap[userID] = reviewList
		productReviewInfo.productReviewList = append(productReviewInfo.productReviewList, productReview)
		productReviewFromDBMap[productID] = productReviewInfo
	}

	ProductAvgGrade()
}

func ProductAvgGrade() {
	// 평균 구하기
	for _, ProductReviewInfo := range productReviewFromDBMap {
		totalPoint := 0
		totalCount := 0
		for _, ProductReviewList := range ProductReviewInfo.productReviewMap {
			for _, iter := range ProductReviewList {
				totalPoint += iter.gradePoint
				totalCount++
			}
		}

		// 소숫점 첫 째 자리까지 표현
		ProductReviewInfo.avgGradePoint = strconv.FormatFloat(float64((float32)(totalPoint)/(float32)(totalCount)), 'f', 1, 32)
	}
}

func loadOrderedListFromDB() {
	orderedListFromDBMap = make(map[string]map[int64][]*OrderedListInfo)

	// SELECT 쿼리 실행
	rows, err := DbObject.Query("SELECT " +
		"`ordered_list`.`user_id`, " +
		"`ordered_list`.`order_date`, " +
		"`ordered_list`.`order_serial`, " +
		"`ordered_list`.`product_id`, " +
		"`ordered_list`.`option_id`, " +
		"`ordered_list`.`entity`, " +
		"`ordered_list`.`total_price`, " +
		"`ordered_list`.`state`, " +
		"`ordered_list`.`address`, " +
		"`ordered_list`.`company_id` " +
		"FROM `products`.`ordered_list`;")
	if err != nil {
		panic(err.Error())
	}

	defer rows.Close() // 함수가 끝날 때 결과 집합 닫기

	// 결과 반복 처리
	for rows.Next() {
		var (
			userId      string
			orderDate   string
			orderSerial int64
			productId   int64
			optionId    int
			entity      int
			totalPrice  int
			state       int
			address     string
			companyId   int64
		)

		err := rows.Scan(&userId, &orderDate, &orderSerial, &productId, &optionId, &entity, &totalPrice, &state, &address, &companyId)
		if err != nil {
			Logger.Error(err.Error())
			log.Fatal(err)
		}

		var newOrderedListInfo OrderedListInfo
		newOrderedListInfo.userId = userId
		newOrderedListInfo.orderDate = orderDate
		newOrderedListInfo.orderSerial = orderSerial
		newOrderedListInfo.productId = productId
		newOrderedListInfo.entity = entity
		newOrderedListInfo.totalPrice = totalPrice
		newOrderedListInfo.state = state
		newOrderedListInfo.optionId = optionId
		newOrderedListInfo.address = address
		newOrderedListInfo.companyId = companyId

		productIdMap := orderedListFromDBMap[userId]
		if productIdMap == nil {
			productIdMap = make(map[int64][]*OrderedListInfo)
		}

		orderedListInfoList := productIdMap[productId]
		orderedListInfoList = append(orderedListInfoList, &newOrderedListInfo)
		productIdMap[productId] = orderedListInfoList
		orderedListFromDBMap[userId] = productIdMap
	}
}

func loadProductHeartFromDB() {
	productHeartFromDBMap = make(map[string]map[int64]bool)

	// SELECT 쿼리 실행
	rows, err := DbObject.Query("SELECT " +
		"`product_heart_user`.`product_id`, " +
		"`product_heart_user`.`user_id` " +
		"FROM `products`.`product_heart_user`;")
	if err != nil {
		panic(err.Error())
	}

	defer rows.Close() // 함수가 끝날 때 결과 집합 닫기

	// 결과 반복 처리
	for rows.Next() {
		var productId int64
		var userId string

		if err := rows.Scan(
			&productId,
			&userId); err != nil {
			Logger.Error(err.Error())
		}

		productIdMap := productHeartFromDBMap[userId]
		if productIdMap == nil {
			productIdMap = make(map[int64]bool)
		}

		productIdMap[productId] = true
		productHeartFromDBMap[userId] = productIdMap
	}
}

func AddShoppingBag(userId string, productId int64, entity int, optionId int) bool {

	isInsert := true
	productIdMap, isExistUser := userShoppingBagFromDBMap[userId]
	if isExistUser {
		shoppingBagMap, isExistIter := productIdMap[productId]
		if isExistIter {
			_, isExistOption := shoppingBagMap[optionId]
			if isExistOption {
				isInsert = false
				updateQuery := "UPDATE `products`.`user_shopping_bag` SET " +
					"`user_id` = ?," +
					"`product_id` = ?," +
					"`entity` = ?," +
					"`option_id` = ?, " +
					"`is_checked` = ? " +
					"WHERE `user_id` = ? AND `product_id` = ? AND `option_id` = ?"
				updateStmt, err := DbObject.Prepare(updateQuery)
				if err != nil {
					Logger.Error(err)
					return false
				}
				defer updateStmt.Close()

				_, err = updateStmt.Exec(userId, productId, entity, optionId, true, userId, productId, optionId)
				if err != nil {
					Logger.Error(err)
					return false
				}
			}
		}
	}

	if isInsert == true {
		// 데이터 삽입 SQL 쿼리
		insertQuery := "INSERT INTO `products`.`user_shopping_bag` ( " +
			"`user_id`, " +
			"`product_id`," +
			"`entity`, " +
			"`option_id`, " +
			"`is_checked` ) " +
			"VALUES (?, ?, ?, ?, ?)"
		// SQL 쿼리 실행
		_, err := DbObject.Exec(insertQuery, userId, productId, entity, optionId, true)
		if err != nil {
			// 경고문구로 대체
			Logger.Error(err)
			return false // 이미 장바구니에 있습니다.
		}
	}

	// 삽입 완료(락)
	var mu sync.Mutex
	mu.Lock()
	defer mu.Unlock()

	if productIdMap == nil {
		productIdMap = make(map[int64]map[int]*ShoppingBagDetailInfo)
	}

	var shoppingBagDetailInfo ShoppingBagDetailInfo
	shoppingBagDetailInfo.OptionId = optionId
	shoppingBagDetailInfo.Entity = entity
	shoppingBagDetailInfo.IsChecked = true
	optionMap := productIdMap[productId]
	if optionMap == nil {
		optionMap = make(map[int]*ShoppingBagDetailInfo)
	}

	optionMap[optionId] = &shoppingBagDetailInfo
	productIdMap[productId] = optionMap
	userShoppingBagFromDBMap[userId] = productIdMap

	return true
}

func ChangeHeartDb(productId int64, userId string) (bool, bool) {
	isLike := true
	productIdMap, isExistUser := productHeartFromDBMap[userId]
	if isExistUser {
		_, isExistProduct := productIdMap[productId]
		if isExistProduct {
			// DB에 삭제 조치 후 map에 반영(삭제)
			query := "DELETE FROM products.product_heart_user WHERE product_id = ? AND user_id = ?"

			// SQL 쿼리 실행
			_, err := DbObject.Exec(query, productId, userId)
			if err != nil {

				// 경고문구로 대체
				Logger.Error(err)
				return false, false
			}

			// 삭제 완료(락)
			var mu sync.Mutex
			mu.Lock()
			defer mu.Unlock()

			delete(productIdMap, productId)
			productHeartFromDBMap[userId] = productIdMap
			isLike = false

		} else {

			if productIdMap == nil {
				productIdMap = make(map[int64]bool)
			}

			// DB에 insert 후 map에 반영(append)
			// 데이터 삽입 SQL 쿼리
			insertQuery := "INSERT INTO products.product_heart_user (product_id, user_id) VALUES (?, ?)"

			// SQL 쿼리 실행
			_, err := DbObject.Exec(insertQuery, productId, userId)
			if err != nil {

				// 경고문구로 대체
				Logger.Error(err)
				return false, false
			}

			// 삽입 완료(락)
			var mu sync.Mutex
			mu.Lock()
			defer mu.Unlock()

			productIdMap[productId] = true
			productHeartFromDBMap[userId] = productIdMap

		}
	} else {
		// DB에 insert 후 map에 반영(append)
		// 데이터 삽입 SQL 쿼리
		insertQuery := "INSERT INTO products.product_heart_user (product_id, user_id) VALUES (?, ?)"

		// SQL 쿼리 실행
		_, err := DbObject.Exec(insertQuery, productId, userId)
		if err != nil {

			// 경고문구로 대체
			Logger.Error(err)
			return false, false
		}

		// 삽입 완료(락)
		var mu sync.Mutex
		mu.Lock()
		defer mu.Unlock()

		newProductIdMap := make(map[int64]bool)
		newProductIdMap[productId] = true
		productHeartFromDBMap[userId] = newProductIdMap
	}

	return true, isLike
}

func isImage(filename string, exts []string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	for _, e := range exts {
		if ext == e {
			return true
		}
	}
	return false
}

func GetTileImgName(path string) string {
	// 대문 이미지
	// 이미지 확장자 목록
	exts := []string{".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"}

	// 현재 디렉토리(".")를 대상으로 탐색
	files, err := os.ReadDir(path)
	if err == nil {
		for _, file := range files {
			// 파일만 선택 (디렉토리는 제외)
			if !file.IsDir() {
				name := file.Name()
				// 확장자 검사
				if isImage(name, exts) {
					return name
				}
			}
		}
	}

	return ""
}

func GetProductInfo(reqPage int, totalPage *int, productImgInfoList *[]ProductImgInfo, userId string) {

	values, isExist := productInfoPageFromDBMap[reqPage]
	if !isExist {
		return
	}
	for _, value := range values {
		var productImgInfo ProductImgInfo
		productImgInfo.ImgURL = fmt.Sprintf("%s/dynamic_images/%d/%s", baseURL, value.productId, GetTileImgName(value.imgUrl))
		productImgInfo.Description = strings.Replace(value.description, "\\n", "\n", -1)
		productImgInfo.Price = value.price
		productImgInfo.ProductId = fmt.Sprintf("%d", value.productId)
		productImgInfo.CompanyName = strings.Replace(value.companyName, "\\n", "\n", -1)
		productImgInfo.IsLike = GetIsLike(value.productId, userId)
		*productImgInfoList = append(*productImgInfoList, productImgInfo)
	}

	*totalPage = len(productInfoPageFromDBMap)
}

func GetProductList(productId int64, userId string, productImgInfoList *[]ProductImgInfo) {

	value, isExist := ProductInfoFromDBMap[productId]
	if !isExist {
		return
	}

	var productImgInfo ProductImgInfo
	productImgInfo.ImgURL = fmt.Sprintf("%s/dynamic_images/%d/%s", baseURL, value.productId, GetTileImgName(value.imgUrl))
	productImgInfo.Description = strings.Replace(value.description, "\\n", "\n", -1)
	productImgInfo.Price = value.price
	productImgInfo.ProductId = fmt.Sprintf("%d", value.productId)
	productImgInfo.CompanyName = strings.Replace(value.companyName, "\\n", "\n", -1)
	productImgInfo.IsLike = GetIsLike(value.productId, userId)
	*productImgInfoList = append(*productImgInfoList, productImgInfo)

}

func GetProductInfoHeart(userId string, productImgInfoList *[]ProductImgInfo) {
	productIdMap := productHeartFromDBMap[userId]
	if productIdMap == nil {
		return
	}

	for key, _ := range productIdMap {
		productInfo, isExist := ProductInfoFromDBMap[key]
		if !isExist {
			continue
		}

		var productImgInfo ProductImgInfo
		productImgInfo.ImgURL = fmt.Sprintf("%s/dynamic_images/%d/%s", baseURL, productInfo.productId, GetTileImgName(productInfo.imgUrl))
		productImgInfo.Description = strings.Replace(productInfo.description, "\\n", "\n", -1)
		productImgInfo.Price = productInfo.price
		productImgInfo.ProductId = fmt.Sprintf("%d", productInfo.productId)
		productImgInfo.CompanyName = strings.Replace(productInfo.companyName, "\\n", "\n", -1)
		productImgInfo.IsLike = true
		*productImgInfoList = append(*productImgInfoList, productImgInfo)
	}
}

func GetIsLike(productId int64, userId string) bool {
	productIdMap, isExist := productHeartFromDBMap[userId]
	if isExist {
		_, isExist1 := productIdMap[productId]
		if isExist1 {
			return true
		}
	}

	return false
}

func AddCommasToNumber(number int) string {
	numberStr := fmt.Sprintf("%d", number)
	length := len(numberStr)

	if length <= 3 {
		return numberStr
	}

	commaSeparated := []string{}
	for i, char := range numberStr {
		if i > 0 && (length-i)%3 == 0 {
			commaSeparated = append(commaSeparated, ",")
		}
		commaSeparated = append(commaSeparated, string(char))
	}

	return strings.Join(commaSeparated, "")
}

func GetFoodListPageInfo(reqPage int, productType int, totalPage *int, productImgInfoList *[]ProductImgInfo) {

	pageValueMap, isExist := productInfoTypeFromDBMap[productType]
	if !isExist {
		return
	}

	productInfos, isExist := pageValueMap[reqPage]
	if !isExist {
		return
	}

	for _, value := range productInfos {

		var productImgInfo ProductImgInfo
		productImgInfo.ImgURL = value.imgUrl
		productImgInfo.Description = strings.Replace(value.description, "\\n", "\n", -1)
		productImgInfo.Price = value.price
		productImgInfo.ProductId = fmt.Sprintf("%d", value.productId)
		productImgInfo.CompanyName = strings.Replace(value.companyName, "\\n", "\n", -1)
		*productImgInfoList = append(*productImgInfoList, productImgInfo)

	}

	*totalPage = len(pageValueMap)
}

func ShoppingBagChangeCheck(userId string, productId int64, optionId int, isChecked bool) bool {
	productIdMap, isExistUser := userShoppingBagFromDBMap[userId]
	if isExistUser {
		shoppingBagMap, isExistIter := productIdMap[productId]
		if isExistIter {
			ShoppingBagDetailInfo, isExistIter := shoppingBagMap[optionId]
			if isExistIter {

				if ShoppingBagDetailInfo == nil {
					Logger.Error("ShoppingBagDetailInfo is nullptr, userId:", userId,
						"productId:", productId,
						"optionId:", optionId,
						"isChecked:", isChecked)
					return false
				}

				// db 업데이트 후 락걸고 동기화
				updateQuery := "UPDATE `products`.`user_shopping_bag` SET " +
					"`is_checked` = ? " +
					"WHERE `user_id` = ? AND `product_id` = ? AND `option_id` = ?"
				updateStmt, err := DbObject.Prepare(updateQuery)
				if err != nil {
					Logger.Error(err)
					return false
				}
				defer updateStmt.Close()

				_, err = updateStmt.Exec(isChecked, userId, productId, optionId)
				if err != nil {
					Logger.Error(err)
				}

				// 삽입 완료(락)
				var mu sync.Mutex
				mu.Lock()
				defer mu.Unlock()

				ShoppingBagDetailInfo.IsChecked = isChecked

				shoppingBagMap[optionId] = ShoppingBagDetailInfo
				productIdMap[productId] = shoppingBagMap
				userShoppingBagFromDBMap[userId] = productIdMap

				return true
			}
		}
	}

	return false
}

func DeleteShoppingBag(userId string, productId int64, optionId int) {

	// DB에 삭제 조치 후 map에 반영(삭제)
	query := "DELETE FROM `products`.`user_shopping_bag` " +
		"WHERE `user_id` = ? AND `product_id` = ? AND `option_id` = ?"

	// SQL 쿼리 실행
	_, err := DbObject.Exec(query, userId, productId, optionId)
	if err != nil {
		// 경고문구로 대체
		Logger.Error(err)
		return
	}

	// 삭제 완료(락)
	var mu sync.Mutex
	mu.Lock()
	defer mu.Unlock()

	productIdMap, isExist := userShoppingBagFromDBMap[userId]
	if !isExist {
		return
	}

	optionMap, isExist := productIdMap[productId]
	if !isExist {
		return
	}

	delete(optionMap, optionId)
	productIdMap[productId] = optionMap
	userShoppingBagFromDBMap[userId] = productIdMap
}

func AllChangeCheck(userId string) (bool, bool) /*에러값, 체크해제여부*/ {
	productIdMap, isExist := userShoppingBagFromDBMap[userId]
	if !isExist {
		return false, false
	}

	for _, productIter := range productIdMap {
		for _, shoppingBagDetailInfo := range productIter {
			if shoppingBagDetailInfo == nil {
				Logger.Error("shoppingBagDetailInfo is null AllChangeCheck")
				return false, false
			}
			if shoppingBagDetailInfo.IsChecked == false {
				// 올체크 on
				if changeCheck(true, userId) == false {
					return false, false
				}

				return true, true
			}
		}
	}

	// 올체크 off
	if changeCheck(false, userId) == false {
		return false, false
	}

	return true, false
}

func changeCheck(isChecked bool, userId string) bool {
	updateQuery := "UPDATE `products`.`user_shopping_bag` SET " +
		"`is_checked` = ? " +
		"WHERE `user_id` = ?"

	updateStmt, err := DbObject.Prepare(updateQuery)
	if err != nil {
		Logger.Error(err)
		return false
	}
	defer updateStmt.Close()

	_, err = updateStmt.Exec(isChecked, userId)
	if err != nil {
		Logger.Error(err)
		return false
	}

	return true
}

func GetCategoryPage(productType int, detailType int, filter string, totalCount *int) bool {

	query := ""
	var recordCount int
	if len(filter) == 0 {

		query = "SELECT COUNT(DISTINCT product_id) AS record_count FROM product_type_detail WHERE product_type = ? AND detail_type = ?"

		err := DbObject.QueryRow(query, productType, detailType).Scan(&recordCount)
		if err != nil {
			Logger.Error(err.Error())
			return false
		}

	} else {
		query = "SELECT COUNT(DISTINCT product_id) AS record_count FROM product_type_detail WHERE product_type = ? AND detail_type = ? AND filter in(?)"

		err := DbObject.QueryRow(query, productType, detailType, filter).Scan(&recordCount)
		if err != nil {
			Logger.Error(err.Error())
			return false
		}
	}

	*totalCount = recordCount / G_ShowProductsCount
	if recordCount%G_ShowProductsCount != 0 {
		*totalCount += 1
	}

	return true
}

func GetSearchList(searchWord string, reqPage int, userId string, totalPageCount *int, productImgInfoList *[]ProductImgInfo) bool {

	query := "SELECT COUNT(*) FROM products.product_info WHERE description LIKE ?"

	var totalCount int
	err := DbObject.QueryRow(query, "%"+searchWord+"%").Scan(&totalCount)
	if err != nil {
		Logger.Error(err.Error())
		return false
	}

	*totalPageCount = totalCount / G_ShowProductsCount
	if totalCount%G_ShowProductsCount != 0 {
		*totalPageCount += 1
	}

	// SELECT 쿼리 실행
	// SQL 쿼리 작성
	query = "SELECT product_id FROM products.product_info WHERE description LIKE ? LIMIT ? OFFSET ?"

	// SQL 쿼리 실행
	rows, err := DbObject.Query(query, "%"+searchWord+"%", G_ShowProductsCount, G_ShowProductsCount*reqPage)
	if err != nil {
		panic(err.Error())
	}
	defer rows.Close()

	// 결과 반복 처리
	for rows.Next() {
		var productId int64

		if err := rows.Scan(
			&productId); err != nil {
			Logger.Error(err.Error())
		}

		productInfo, isExist := ProductInfoFromDBMap[productId]
		if !isExist {
			return false
		}

		var productImgInfo ProductImgInfo
		productImgInfo.ImgURL = fmt.Sprintf("%s/dynamic_images/%d/%s", baseURL, productInfo.productId, GetTileImgName(productInfo.imgUrl))
		productImgInfo.Description = strings.Replace(productInfo.description, "\\n", "\n", -1)
		productImgInfo.Price = productInfo.price
		productImgInfo.ProductId = fmt.Sprintf("%d", productInfo.productId)
		productImgInfo.CompanyName = strings.Replace(productInfo.companyName, "\\n", "\n", -1)
		productImgInfo.IsLike = GetIsLike(productInfo.productId, userId)
		*productImgInfoList = append(*productImgInfoList, productImgInfo)
	}

	return true
}

func IsJoinedEmail(reqEmail string) bool {

	query := "SELECT EXISTS (SELECT 1 FROM products.account WHERE e_mail = ?) AS email_exists"
	var emailExists int

	// QueryRow를 사용하여 단일 결과를 가져옴
	err := DbObject.QueryRow(query, reqEmail).Scan(&emailExists)
	if err != nil {
		Logger.Error(err.Error())
		return false
	}

	// 결과 출력
	if emailExists == 1 {
		return true
	}

	return false
}

func IsJoinedId(id string) bool {
	query := "SELECT EXISTS (SELECT 1 FROM products.account WHERE id = ?) AS id_exists"
	var idExists int

	// QueryRow를 사용하여 단일 결과를 가져옴
	err := DbObject.QueryRow(query, id).Scan(&idExists)
	if err != nil {
		Logger.Error(err.Error())
		return false
	}

	// 결과 출력
	if idExists == 1 {
		return true
	}

	return false
}

func GetIdFromEmail(reqEmail string) string {

	// SQL 쿼리 작성
	query := "SELECT `account`.`id` FROM `products`.`account` WHERE e_mail like ?"

	// SELECT 쿼리 실행
	rows, err := DbObject.Query(query, reqEmail)
	if err != nil {
		Logger.Error(err.Error())
		return ""
	}

	defer rows.Close() // 함수가 끝날 때 결과 집합 닫기

	// 결과 반복 처리
	for rows.Next() {
		var id string
		if err := rows.Scan(
			&id); err != nil {
			Logger.Error(err.Error())
			return ""
		}

		return id
	}

	return ""
}

func CheckAndInsertAccount(reqEmail string, reqId string, reqPassword string) int {

	// 이미 있는 이메일인지 검사
	if IsJoinedEmail(reqEmail) == true {
		Logger.Error("Already Joined mail[%s]", reqEmail)
		return Error_AlreadyAuthedMail
	}

	// 이미 있는 아이디인지 검사
	query := "SELECT EXISTS (SELECT 1 FROM products.account WHERE id = ?) AS id_exists"
	var idExists int
	err := DbObject.QueryRow(query, reqId).Scan(&idExists)
	if err != nil {
		Logger.Error(err.Error())
		return Error_Select
	}

	// 결과 출력
	if idExists == 1 {
		return Error_AlreadyID
	}

	// insert
	insertQuery := "INSERT INTO products.account (id, password, e_mail) VALUES (?, ?, ?)"

	// SQL 쿼리 실행
	_, err = DbObject.Exec(insertQuery, reqId, reqPassword, reqEmail)
	if err != nil {
		Logger.Error(err)
		return Error_Insert
	}

	return Error_None
}

func UpdatePassword(eMail string, password string) int {

	updateQuery := "UPDATE `products`.`account` SET " +
		"`password` = ? " +
		"WHERE `e_mail` = ?"
	updateStmt, err := DbObject.Prepare(updateQuery)
	if err != nil {
		Logger.Error(err)
		return Error_Update
	}
	defer updateStmt.Close()

	_, err = updateStmt.Exec(password, eMail)
	if err != nil {
		Logger.Error(err)
		return Error_UpdateErr
	}

	return Error_None
}

func GetOrderList(userId string, orderedInfoList *[]OrderedInfo) {
	productReviewMap := orderedListFromDBMap[userId]
	if productReviewMap == nil {
		return
	}

	for _, orderedList := range productReviewMap {

		for _, orderedIter := range orderedList {

			if orderedIter == nil {
				continue
			}

			var orderedInfo OrderedInfo
			orderedInfo.UserId = orderedIter.userId
			orderedInfo.Entity = orderedIter.entity
			orderedInfo.OrderDate = orderedIter.orderDate
			orderedInfo.OrderSerial = orderedIter.orderSerial
			orderedInfo.ProductId = orderedIter.productId
			orderedInfo.State = orderedIter.state
			orderedInfo.TotalPrice = orderedIter.totalPrice
			orderedInfo.Address = orderedIter.address

			productInfo, isExist := ProductInfoFromDBMap[orderedInfo.ProductId]
			if isExist {
				orderedInfo.CompanyName = strings.Replace(productInfo.companyName, "\\n", "\n", -1)
				orderedInfo.Description = strings.Replace(productInfo.description, "\\n", "\n", -1)
				orderedInfo.ImgURL = fmt.Sprintf("%s/dynamic_images/%d/%s", baseURL, productInfo.productId, GetTileImgName(productInfo.imgUrl))
			}
			orderedInfo.IsLike = GetIsLike(orderedInfo.ProductId, userId)

			optionMap, isExist := ProductOptionFromDBMap[orderedInfo.ProductId]
			if isExist {
				optionInfo, isExist := optionMap[orderedIter.optionId]
				if isExist {
					orderedInfo.OptionName = optionInfo.OptionName
					orderedInfo.OptionId = optionInfo.OptionId
				}
			}

			*orderedInfoList = append(*orderedInfoList, orderedInfo)

		}
	}
}

func InsertReview(productId string, userId string, reviewMsg string, curTimeUnix int64, ratingStr string, isFile bool, orderSerial string) int {

	curTimeFormat := time.Unix(curTimeUnix, 0).Format("2006-01-02 15:04:05")

	// 데이터 삽입 SQL 쿼리
	insertQuery := "INSERT INTO `products`.`product_review` ( " +
		"`product_id`, " +
		"`user_id`," +
		"`review_msg`, " +
		"`grade_point`, " +
		"`date`, " +
		"`order_serial`, " +
		"`is_path` ) " +
		"VALUES (?, ?, ?, ?, ?, ?, ?)"
	// SQL 쿼리 실행
	_, err := DbObject.Exec(insertQuery, productId, userId, reviewMsg, ratingStr, curTimeFormat, orderSerial, isFile)
	if err != nil {
		// 경고문구로 대체
		Logger.Error(err)
		return Error_Insert
	}

	// 락걸고 싱크 맞추기

	var mu sync.Mutex
	mu.Lock()
	defer mu.Unlock()

	// 문자열을 정수로 변환
	productIdInt, err := strconv.ParseInt(productId, 10, 64)
	if err != nil {
		Logger.Error(err)
		return Error_Atoi
	}

	// 문자열을 정수로 변환
	gradePoint, err := strconv.Atoi(ratingStr)
	if err != nil {
		Logger.Error(err)
		return Error_Atoi
	}

	// 문자열을 정수로 변환
	orderSerialInt, err := strconv.ParseInt(orderSerial, 10, 64)
	if err != nil {
		Logger.Error(err)
		return Error_Atoi
	}

	var productReview ProductReview
	productReview.date = curTimeFormat
	productReview.gradePoint = gradePoint
	productReview.orderSerial = orderSerialInt
	productReview.isPath = isFile
	productReview.reviewMsg = reviewMsg
	productReview.userId = userId

	productReviewInfo := productReviewFromDBMap[productIdInt]
	if productReviewInfo == nil {
		productReviewInfo = &ProductReviewInfo{}
	}

	if productReviewInfo.productReviewMap == nil {
		productReviewInfo.productReviewMap = make(map[string][]ProductReview)
	}

	reviewList := productReviewInfo.productReviewMap[userId]
	reviewList = append(reviewList, productReview)

	productReviewInfo.productReviewMap[userId] = reviewList
	productReviewInfo.productReviewList = append(productReviewInfo.productReviewList, productReview)
	productReviewFromDBMap[productIdInt] = productReviewInfo

	ProductAvgGrade()

	return Error_None
}

func ChangeOrderedState(userId string, productId int64, optionId int, state int, orderSerial int64) bool {

	updateQuery := "UPDATE `products`.`ordered_list` SET " +
		"`state` = ? " +
		"WHERE `user_id` = ? AND `product_id` = ? AND `option_id` = ? AND `order_serial` = ?"
	updateStmt, err := DbObject.Prepare(updateQuery)
	if err != nil {
		Logger.Error(err)
		return false

	}
	defer updateStmt.Close()

	_, err = updateStmt.Exec(state, userId, productId, optionId, orderSerial)
	if err != nil {
		Logger.Error(err)
		return false
	}

	// 메모리 동기화
	var mu sync.Mutex
	mu.Lock()
	defer mu.Unlock()

	productIdMap := orderedListFromDBMap[userId]
	if productIdMap == nil {
		productIdMap = make(map[int64][]*OrderedListInfo)
	}

	orderedListInfoList := productIdMap[productId]
	if orderedListInfoList == nil {
		return false
	}

	for _, iter := range orderedListInfoList {
		if iter == nil {
			continue
		}

		if iter.optionId == optionId && iter.orderSerial == orderSerial {
			iter.state = state
			break
		}
	}

	productIdMap[productId] = orderedListInfoList
	orderedListFromDBMap[userId] = productIdMap

	return true
}

func GetAdminOrderList(adminUserId string, companyId string, reqPage int, totalPageCount *int, orderedInfoList *[]OrderedInfo) int {
	// 계정이랑 맞는지 확인
	var recordCount int
	query := "SELECT COUNT(*) AS record_count FROM account WHERE id = ? AND company_id = ?"
	err := DbObject.QueryRow(query, adminUserId, companyId).Scan(&recordCount)
	if err != nil {
		Logger.Error(err.Error())
		return Error_Select
	}

	if recordCount == 0 {
		Logger.Error("Error_NotMatchCompayId adminUserId[%s] companyId[%s]", adminUserId, companyId)
		return Error_NotMatchCompayId
	}

	// 총 페이지 수
	query = "SELECT count(*) FROM products.ordered_list WHERE company_id=?"

	var totalCount int
	err = DbObject.QueryRow(query, companyId).Scan(&totalCount)
	if err != nil {
		Logger.Error(err.Error())
		return Error_NotMatchCompayId
	}

	*totalPageCount = totalCount / G_ShowAdminOrderCount
	if totalCount%G_ShowAdminOrderCount != 0 {
		*totalPageCount += 1
	}

	// 원하는 리뷰 페이지 제공하기
	query = "SELECT user_id, order_date, order_serial, product_id, option_id, entity, total_price, state, address, company_id FROM products.ordered_list WHERE company_id=? LIMIT ? OFFSET ?"

	// SQL 쿼리 실행
	rows, err := DbObject.Query(query, companyId, G_ShowAdminOrderCount, G_ShowAdminOrderCount*reqPage)
	if err != nil {
		panic(err.Error())
	}
	defer rows.Close()

	// 결과 반복 처리
	for rows.Next() {
		var userId string
		var orderDate string
		var orderSerial int64
		var productId int64
		var optionId int
		var entity int
		var totalPrice int
		var state int
		var address string
		var companyId int64

		if err := rows.Scan(
			&userId,
			&orderDate,
			&orderSerial,
			&productId,
			&optionId,
			&entity,
			&totalPrice,
			&state,
			&address,
			&companyId); err != nil {
			Logger.Error(err.Error())
		}

		var orderedInfo OrderedInfo

		companyInfo := companyInfoFromDBMap[companyId]
		if companyInfo != nil {
			orderedInfo.CompanyName = strings.Replace(companyInfo.companyName, "\\n", "\n", -1)
		}

		productInfo, isExist := ProductInfoFromDBMap[productId]
		if isExist {
			orderedInfo.Description = strings.Replace(productInfo.description, "\\n", "\n", -1)
			orderedInfo.ImgURL = fmt.Sprintf("%s/dynamic_images/%d/%s", baseURL, productInfo.productId, GetTileImgName(productInfo.imgUrl))
		}

		orderedInfo.Entity = entity

		optionMap, isExist := ProductOptionFromDBMap[productId]
		if isExist {
			optionInfo, isExist := optionMap[optionId]
			if isExist {
				orderedInfo.OptionId = optionInfo.OptionId
				orderedInfo.OptionName = optionInfo.OptionName
			}
		}

		orderedInfo.OrderDate = orderDate
		orderedInfo.OrderSerial = orderSerial
		orderedInfo.ProductId = productId
		orderedInfo.State = state
		orderedInfo.TotalPrice = totalPrice
		orderedInfo.Address = address

		*orderedInfoList = append(*orderedInfoList, orderedInfo)
	}

	return Error_None
}

func CheckAdminAccount(userId string, productId int64) int {

	productInfo, isExist := ProductInfoFromDBMap[productId]
	if !isExist {
		return Error_NotBoughtReview
	}

	// 원하는 리뷰 페이지 제공하기
	query := "SELECT company_id FROM products.account WHERE id=?"

	// SQL 쿼리 실행
	rows, err := DbObject.Query(query, userId)
	if err != nil {
		panic(err.Error())
	}
	defer rows.Close()

	// 결과 반복 처리
	for rows.Next() {
		var companyId int64

		if err := rows.Scan(
			&companyId); err != nil {
			Logger.Error(err.Error())
		}

		if productInfo.companyId == companyId {
			return Error_NotReviewAdmin
		}

		return Error_None
	}

	return Error_NotExistId
}

func GetAccountCompanyId(userId string) int64 {

	return 0
}
