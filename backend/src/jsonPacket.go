package src

type ReqMainPage struct {
	CurPage      int    `json:"CurPage"`
	UserId       string `json:"UserId"`
	AccessToken  string `json:"AccessToken"`
	RefreshToken string `json:"RefreshToken"`
}

type ProductImgInfo struct {
	ProductId     string `json:"ProductId"`
	ImgURL        string `json:"ImgURL"`
	Description   string `json:"Description"`
	Price         int    `json:"Price"`
	CompanyName   string `json:"CompanyName"`
	IsLike        bool   `json:"IsLike"`
	DeliveryPrice int    `json:"DeliveryPrice"`
}

type ResProductPageInfo struct {
	ProductImgInfo []ProductImgInfo `json:"ProductImgInfo"`
	TotalPageCount int              `json:"TotalPageCount"`
	UserId         string           `json:"UserId"`
	AccessToken    string           `json:"AccessToken"`
	RefreshToken   string           `json:"RefreshToken"`
}

type ReqDogFoodPage struct {
	ReqPage     int `json:"ReqPage"`
	ProductType int `json:"ProductType"`
}

type ApplyFilterPage struct {
	ProductType int `json:"ProductType"`
	DetailType  int `json:"DetailType"`
}

type ReqApplyFilterPageInfo struct {
	FilterList      []int           `json:"FilterList"`
	ApplyFilterPage ApplyFilterPage `json:"ApplyFilterPage"`
}

type ReqTryLogin struct {
	LoginId       string `json:"LoginId"`
	LoginPassword string `json:"LoginPassword"`
}

type ResTryLogin struct {
	LoginId       string `json:"LoginId"`
	AccessToken   string `json:"AccessToken"`
	RefreshToken  string `json:"RefreshToken"`
	UserCompanyId int64  `json:"UserCompanyId"`
}

type ReqDoLogout struct {
	LoginId      string `json:"LoginId"`
	RefreshToken string `json:"RefreshToken"`
}

type ProductDetailImgInfo struct {
	ImgPath string `json:"ImgPath"`
	Order   int    `json:"Order"`
}

type ProductOptionInfo struct {
	OptionId   int    `json:"OptionId"`
	AddPrice   int    `json:"AddPrice"`
	OptionName string `json:"OptionName"`
}

type ProductReviewDetailInfo struct {
	OptionId    int      `json:"OptionId"`
	OptionName  string   `json:"OptionName"`
	ReviewMsg   string   `json:"ReviewMsg"`
	ReviewDate  string   `json:"ReviewDate"`
	StarGrade   int      `json:"StarGrade"`
	UserId      string   `json:"UserId"`
	ImgBase64   []string `json:"ImgBase64"`
	VideoBase64 []string `json:"VideoBase64"`
}

type NotifyProductDetailInfo struct {
	ProductImgInfo              ProductImgInfo            `json:"ProductImgInfo"`
	ImgPathList                 []ProductDetailImgInfo    `json:"ImgPathList"`
	OptionInfoList              []ProductOptionInfo       `json:"OptionInfoList"`
	FreeDeliveryCondition       int                       `json:"FreeDeliveryCondition"`
	ProductReviewDetailInfoList []ProductReviewDetailInfo `json:"ProductReviewDetailInfoList"`
	AvgGrade                    string                    `json:"AvgGrade"`
	TotalPageCount              int                       `json:"TotalPageCount"`
}

type NotifyProductReview struct {
	ProductReviewDetailInfoList []ProductReviewDetailInfo `json:"ProductReviewDetailInfoList"`
}

type ReqChangeHeart struct {
	LoginId      string `json:"LoginId"`
	AccessToken  string `json:"AccessToken"`
	RefreshToken string `json:"RefreshToken"`
	ProductId    string `json:"ProductId"`
}

type ResChangeHeart struct {
	AccessToken  string `json:"AccessToken"`
	RefreshToken string `json:"RefreshToken"`
	IsLike       bool   `json:"IsLike"`
}

type ReqMyInfo struct {
	LoginId      string `json:"LoginId"`
	AccessToken  string `json:"AccessToken"`
	RefreshToken string `json:"RefreshToken"`
}

type OrderedInfo struct {
	UserId      string `json:"UserId"`
	OrderDate   string `json:"OrderDate"`
	OrderSerial int64  `json:"OrderSerial"`
	ProductId   int64  `json:"ProductId"`
	ImgURL      string `json:"ImgURL"`
	Description string `json:"Description"`
	CompanyName string `json:"CompanyName"`
	Entity      int    `json:"Entity"`
	TotalPrice  int    `json:"TotalPrice"`
	State       int    `json:"State"`
	IsLike      bool   `json:"IsLike"`
	OptionName  string `json:"OptionName"`
	OptionId    int    `json:"OptionId"`
	Address     string `json:"Address"`
}

type ResMyInfo struct {
	ProductImgInfo  []ProductImgInfo `json:"ProductImgInfo"`
	OrderedInfoList []OrderedInfo    `json:"OrderedInfoList"`
	AccessToken     string           `json:"AccessToken"`
	RefreshToken    string           `json:"RefreshToken"`
}

type AddShoppingBagInfo struct {
	OptionName string `json:"option"`
	Entity     int    `json:"quantity"`
	AddedPrice int    `json:"addedPrice"`
	TotalPrice int    `json:"totalPrice"`
	Id         int    `json:"id"`
	OptionId   int    `json:"optionId"`
}

type ReqAddShoppingBag struct {
	LoginId                string               `json:"LoginId"`
	AccessToken            string               `json:"AccessToken"`
	RefreshToken           string               `json:"RefreshToken"`
	ProductId              string               `json:"ProductId"`
	AddShoppingBagInfoList []AddShoppingBagInfo `json:"selectedOptionsList"`
}

type ReqShoppingBagList struct {
	LoginId      string `json:"LoginId"`
	AccessToken  string `json:"AccessToken"`
	RefreshToken string `json:"RefreshToken"`
}

type ShoppingBagInfo struct {
	ProductId   string `json:"ProductId"`
	ImgURL      string `json:"ImgURL"`
	Description string `json:"Description"`
	Price       int    `json:"Price"`
	CompanyName string `json:"CompanyName"`
	Entity      int    `json:"Entity"`
	OptionName  string `json:"OptionName"`
	OptionId    int    `json:"OptionId"`
	AddPrice    int    `json:"AddPrice"`
	IsLike      bool   `json:"IsLike"`
	IsChecked   bool   `json:"IsChecked"`
}

type DeliveryPriceInfo struct {
	CompanyName   string `json:"CompanyName"`
	DeliveryPrice int    `json:"DeliveryPrice"`
}

type ResShoppingBagList struct {
	AccessToken       string              `json:"AccessToken"`
	RefreshToken      string              `json:"RefreshToken"`
	ShoppingBagInfo   []ShoppingBagInfo   `json:"ShoppingBagInfo"`
	DeliveryPriceInfo []DeliveryPriceInfo `json:"DeliveryPriceInfo"`
}

type ReqShoppingBagChangeCheck struct {
	LoginId      string `json:"LoginId"`
	AccessToken  string `json:"AccessToken"`
	RefreshToken string `json:"RefreshToken"`
	ProductId    int64  `json:"ProductId"`
	IsChecked    bool   `json:"IsChecked"`
	OptionId     int    `json:"OptionId"`
}

type ResShoppingBagChangeCheck struct {
	AccessToken  string `json:"AccessToken"`
	RefreshToken string `json:"RefreshToken"`
}

type ReqShoppingBagDelete struct {
	LoginId      string `json:"LoginId"`
	AccessToken  string `json:"AccessToken"`
	RefreshToken string `json:"RefreshToken"`
	ProductId    int64  `json:"ProductId"`
	OptionId     int    `json:"OptionId"`
}

type ResShoppingBagDelete struct {
	AccessToken  string `json:"AccessToken"`
	RefreshToken string `json:"RefreshToken"`
}

type ReqShoppingBagAllCheck struct {
	LoginId      string `json:"LoginId"`
	AccessToken  string `json:"AccessToken"`
	RefreshToken string `json:"RefreshToken"`
}

type ResShoppingBagAllCheck struct {
	AccessToken  string `json:"AccessToken"`
	RefreshToken string `json:"RefreshToken"`
}

type ReqSearch struct {
	CurPage int    `json:"CurPage"`
	UserId  string `json:"UserId"`
}

type ResSearch struct {
	ProductImgInfo []ProductImgInfo `json:"ProductImgInfo"`
	TotalPageCount int              `json:"TotalPageCount"`
}

type ReqAuthFromEmail struct {
	Email string `json:"Email"`
}

type ReqAuthVerifyEmail struct {
	VerifyNum int    `json:"VerifyNum"`
	Email     string `json:"Email"`
}

type ReqSignUp struct {
	SignId       string `json:"SignId"`
	SignPassword string `json:"SignPassword"`
	Email        string `json:"Email"`
}

type ReqAuthFindIdFromEmail struct {
	Email string `json:"Email"`
}

type ReqFindId struct {
	VerifyNum int    `json:"VerifyNum"`
	Email     string `json:"Email"`
}

type ResFindId struct {
	UserId string `json:"UserId"`
}

type ReqAuthFindPasswordFromEmail struct {
	Email string `json:"Email"`
	Id    string `json:"Id"`
}

type ReqFindPassword struct {
	VerifyNum int    `json:"VerifyNum"`
	Email     string `json:"Email"`
	Id        string `json:"Id"`
}

type ResFindPassword struct {
	UserId string `json:"UserId"`
}

type ReqChangePassword struct {
	Email    string `json:"Email"`
	Password string `json:"Password"`
}

type NotifyAdminOrder struct {
	OrderedInfoList []OrderedInfo `json:"OrderedInfoList"`
	AccessToken     string        `json:"AccessToken"`
	RefreshToken    string        `json:"RefreshToken"`
	TotalPageCount  int           `json:"TotalPageCount"`
}

type ReqChangeState struct {
	AccessToken  string `json:"AccessToken"`
	RefreshToken string `json:"RefreshToken"`
	UserId       string `json:"UserId"`
	ReqState     int    `json:"ReqState"`
	ProductId    int64  `json:"ProductId"`
	OptionId     int    `json:"OptionId"`
	OrderSerial  int64  `json:"OrderSerial"`
}
