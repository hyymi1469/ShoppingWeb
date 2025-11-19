package src

const (
	Error_None                  = 0     // None
	Error_Parse                 = 10001 // JSON 파싱이 잘못되었습니다.
	Error_Marshal               = 10002 // JSON 으로 변환하는 중 문제가 발생했습니다.
	Error_Atoi                  = 10003 // 정수형으로 바꿀 수 없는 문자입니다.
	Error_Prepare               = 10004 // DB에 insert 방식이 잘못되었습니다.
	Error_Insert                = 10005 // DB에 insert 하는 과정에서 문제가 발생했습니다. 에러로그 참고.
	Error_Delete                = 10006 // 해당 테이블을 삭제하던 중 문제가 발생했습니다.
	Error_DeleteErr             = 10007 // DB 삭제 후 결과값이 잘못되었습니다. 에러로그 참고
	Error_Update                = 10008 // DB 업데이트문 준비 중에 문제가 발생했습니다.
	Error_UpdateErr             = 10009 // DB 업데이트문 실행 중 문제가 발생했습니다.
	Error_Select                = 10010 // 해당 테이블을 조회하던 중 문제가 발생했습니다.
	Error_SelectErr             = 10011 // 해당 테이블을 조회를 순회하던 중 문제가 발생했습니다.
	Error_NotExistId            = 10012 // 해당 아이디는 없는 아이디입니다.
	Error_NotComparePW          = 10013 // 비밀번호가 일치하지 않습니다.
	Error_FailLogout            = 10014 // 잘못된 접근입니다.
	Error_LoginAgain            = 10015 // 다시 로그인 해주세요.
	Error_AlreadyShoppingBag    = 10016 // 이미 장바구니에 있는 물건입니다.
	Error_PlzRefresh            = 10017 // 새로고침 해 주세요.
	Error_DBCountError          = 10018 // 데이터베이스 카운팅 중 에러가 났습니다.
	Error_MarshalError          = 10019 // 마샬링이 잘못되었습니다.
	Error_WringMailAddressError = 10020 // 잘못된 메일 주소입니다.
	Error_AlreadyAuthedMail     = 10021 // 이미 가입된 메일 주소입니다.
	Error_ExpiredAuthTime       = 10022 // 인증 기간이 만료되었습니다. 다시 인증해주세요.
	Error_NotTryAuth            = 10023 // 이메일 인증을 시도한 적이 없습니다. 이메일을 적고 인증요청을 해 주세요.
	Error_WrongAuthNum          = 10024 // 인증 번호가 틀렸습니다.
	Error_ServerError           = 10025 // 서버에서 에러가 났습니다.
	Error_AlreadyID             = 10026 // 이미 있는 아이디입니다.
	Error_RulePassword          = 10027 // 비밀번호는 8~16자리 영문, 숫자를 포함시켜야 합니다.
	Error_NotJoinedEmail        = 10028 // 가입되어 있지 않은 이메일입니다.
	Error_MoreReviewMsg         = 10029 // 리뷰 내용은 5글자 이상 작성 부탁드립니다 :)
	Error_WrongRate             = 10030 // 잘못된 평점입니다.
	Error_WrongReviewError      = 10031 // 리뷰를 등록하던 중 에러가 발생했습니다 :(
	Error_NotBoughtReview       = 10032 // 구매한 적이 없는 상품의 리뷰입니다.
	Error_AlreadyReviewed       = 10033 // 이미 작성한 리뷰입니다.
	Error_NotExistProduct       = 10034 // 해당 상품은 없는 상품입니다.
	Error_NotKnowError          = 10035 // 알 수 없는 에러입니다.
	Error_NotMatchCompayId      = 10036 // 해당 계정은 회사 계정이 아닙니다.
	Error_NotReviewAdmin        = 10037 // 자신의 물품을 직접 리뷰를 쓸 수 없습니다.
)
