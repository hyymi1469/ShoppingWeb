package src

//var G_ShowProductsCount = 2
var G_ShowProductsCount = 28 // 메인 페이지에 보일 상품 갯수

var G_ShowReviewCount = 2 // 한 번에 보일 리뷰 갯수

var G_ShowAdminOrderCount = 2 // 고객사의 상품 오더 보여지는 갯수

// product_type
const (
	ProductType_None     = 0
	ProductType_DogFood  = 1 // 강아지 사료
	ProductType_DogSnack = 2 // 강아지 간식
)

// product_type_detail
const (
	ProductTypeDetail_None   = 0
	ProductTypeDetail_Senior = 1 // 시니어
	ProductTypeDetail_Puupy  = 2 // 퍼피
	ProductTypeDetail_AllAge = 3 // 전연령
)

// DogFoodFilter
const (
	DogFoodFilter_None      = 0
	DogFoodFilter_RawFood   = 1 // 생식
	DogFoodFilter_AirDry    = 2 // 에어드라이
	DogFoodFilter_OvenBake  = 3 // 오븐베이크
	DogFoodFilter_FreshFood = 4 // 신선식품
	DogFoodFilter_DryFood   = 5 // 드라이푸드
)

// OrderedList State
const (
	OrderedListState_none           = 0
	OrderedListState_completeOrder  = 1 // 주문 완료
	OrderedListState_readyProduct   = 2 // 상품 준비중
	OrderedListState_delivery       = 3 // 배송 중
	OrderedListState_complete       = 4 // 배송 완료
	OrderedListState_completeReview = 5 // 리뷰 달음
)
