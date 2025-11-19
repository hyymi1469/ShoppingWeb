import './App.css';

import MainPage from './MainPage';
import MainPageToMobile from './MainPageToMobile';
import Category1of1Page from './Category1of1Page';
import Category1of1PageToMobile from './Category1of1PageToMobile';
import SignUpPage from './SignUpPage';
import LoginPage from './LoginPage';
import ProductDetail from './ProductDetail';
import ProductDetailToMobile from './ProductDetailToMobile';
import MyPage from './MyPage';
import MyPageToMobile from './MyPageToMobile';
import ShoppingBagPage from './ShoppingBagPage';
import ShoppingBagPageToMobile from './ShoppingBagPageToMobile';
import ShoppingBagDetail from './ShoppingBagDetail';
import OrderPage from './OrderPage';
import SearchPage from './SearchPage';
import SearchPageToMobile from './SearchPageToMobile';
import AdminPage from './AdminPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import "./ShoppingBagDetail.css";

const App = () => {
	return (
		<BrowserRouter>
		<Routes>
			<Route path="/" element={<MainPage />} exact/>
			<Route path="/MainPageToMobile" element={<MainPageToMobile />} exact/>
			<Route path="/Category1of1Page" element={<Category1of1Page />} exact/>
			<Route path="/Category1of1PageToMobile" element={<Category1of1PageToMobile />} exact/>
			<Route path="/SignUpPage" element={<SignUpPage />} exact/>
			<Route path="/LoginPage" element={<LoginPage />} exact/>
			<Route path="/ProductDetail/:productId" element={<ProductDetail />} exact/>
			<Route path="/ProductDetailToMobile/:productId" element={<ProductDetailToMobile />} exact/>
			<Route path="/MyPage" element={<MyPage />} exact/>
			<Route path="/MyPageToMobile" element={<MyPageToMobile />} exact/>
			<Route path="/ShoppingBagPage" element={<ShoppingBagPage />} exact/>
			<Route path="/ShoppingBagPageToMobile" element={<ShoppingBagPageToMobile />} exact/>
			<Route path="/ShoppingBagDetail" element={<ShoppingBagDetail />} exact/>
			<Route path="/OrderPage" element={<OrderPage />} exact/>
			<Route path="/SearchPage" element={<SearchPage />} />
			<Route path="/SearchPageToMobile" element={<SearchPageToMobile />} />
			<Route path="/AdminPage" element={<AdminPage />} />
		</Routes>
		</BrowserRouter>

	);
}

export function ErrorFunc(param) {
	if(param === 10001)
	{
		alert("JSON 파싱이 잘못되었습니다.");
	}
	else if (param === 10002) 
	{
		alert("JSON 으로 변환하는 중 문제가 발생했습니다.");
	}
	else if (param === 10003) 
	{
		alert("정수형으로 바꿀 수 없는 문자입니다.");
	}
	else if (param === 10004) 
	{
		alert("DB에 insert 방식이 잘못되었습니다.");
	}
	else if (param === 10005) 
	{
		alert("DB에 insert 하는 과정에서 문제가 발생했습니다. 에러로그 참고.");
	}
	else if (param === 10006) 
	{
		alert("해당 테이블을 삭제하던 중 문제가 발생했습니다.");
	}
	else if (param === 10007) 
	{
		alert("DB 삭제 후 결과값이 잘못되었습니다. 에러로그 참고");
	}
	else if (param === 10008) 
	{
		alert("DB 업데이트문 준비 중에 문제가 발생했습니다.");
	}
	else if (param === 10009) 
	{
		alert("DB 업데이트문 실행 중 문제가 발생했습니다.");
	}
	else if (param === 10010) 
	{
		alert("해당 테이블을 조회하던 중 문제가 발생했습니다.");
	}
	else if (param === 10011) 
	{
		alert("해당 테이블을 조회를 순회하던 중 문제가 발생했습니다.");
	}
	else if (param === 10012) 
	{
		alert("해당 아이디는 없는 아이디입니다.");
	}
	else if (param === 10013) 
	{
		alert("비밀번호가 일치하지 않습니다.");
	}
	else if (param === 10014) 
	{
		alert("잘못된 접근입니다.");
	}
	else if (param === 10016) 
	{
		alert("이미 장바구니에 있는 물건입니다.");
	}
	else if (param === 10017) 
	{
		alert("새로고침 해 주세요.");
	}
	else if (param === 10018) 
	{
		alert("데이터베이스 카운팅 중 에러가 났습니다.");
	}
	else if (param === 10019) 
	{
		alert("마샬링이 잘못되었습니다.");
	}
	else if (param === 10020) 
	{
		alert("잘못된 메일 주소입니다.");
	}
	else if (param === 10021) 
	{
		alert("이미 가입된 메일 주소입니다.");
	}
	else if (param === 10022) 
	{
		alert("인증 기간이 만료되었습니다. 다시 인증해주세요.");
	}
	else if (param === 10023) 
	{
		alert("이메일 인증을 시도한 적이 없습니다. 이메일을 적고 인증요청을 해 주세요.");
	}
	else if (param === 10024) 
	{
		alert("인증 번호가 틀렸습니다.");
	}
	else if (param === 10025) 
	{
		alert("서버에서 에러가 났습니다.");
	}
	else if (param === 10026) 
	{
		alert("이미 있는 아이디입니다.");
	}
	else if (param === 10027) 
	{
		alert("비밀번호는 8~16자리 영문, 숫자를 포함시켜야 합니다.");
	}
	else if (param === 10028) 
	{
		alert("가입되어 있지 않은 이메일입니다.");
	}
	else if (param === 10029) 
	{
		alert("리뷰 내용은 5글자 이상 작성 부탁드립니다 :)");
	}
	else if (param === 10030) 
	{
		alert("잘못된 평점입니다.");
	}
	else if (param === 10031) 
	{
		alert("리뷰를 등록하던 중 에러가 발생했습니다 :(");
	}
	else if (param === 10032)
	{
		alert("구매한 적이 없는 상품의 리뷰입니다.");
	}
	else if (param === 10033) 
	{
		alert("이미 작성한 리뷰입니다.");
	}
	else if (param === 10034) 
	{
		alert("해당 상품은 없는 상품입니다.");
	}
	else if (param === 10035) 
	{
		alert("알 수 없는 에러입니다.");
	}
	else if (param === 10036) 
	{
		alert("해당 계정은 회사 계정이 아닙니다.");
	}
	else if (param === 10037) 
	{
		alert("자신의 물품을 직접 리뷰를 쓸 수 없습니다.");
	}
	
  }

export const ProductType = {
	ProductType_None     : 0,
	ProductType_DogFood  : 1, // 강아지 사료
	ProductType_DogSnack : 2, // 강아지 간식
	
  };

export const ProductTypeDetail = {
	ProductTypeDetail_None   : 0,
	ProductTypeDetail_Senior : 1, // 시니어
	ProductTypeDetail_Puupy  : 2, // 퍼피
	ProductTypeDetail_AllAge : 3, // 전연령
 };

 // 필터 리스트
export const DogFoodFilter = {
	DogFoodFilter_None      : 0,
	DogFoodFilter_RawFood   : 1, // 생식
	DogFoodFilter_AirDry    : 2, // 에어드라이
	DogFoodFilter_OvenBake  : 3, // 오븐베이크
	DogFoodFilter_FreshFood : 4, // 신선식품
	DogFoodFilter_DryFood   : 5, // 드라이푸드
	
};

export const TokenGetter = {
	UserID: "UserId",
	AccessToken: "AccessToken",
	RefreshToken: "RefreshToken",
	UserCompanyId: "UserCompanyId",
}

export const OrderState = {
	none           : 0,
	completeOrder  : 1, // 주문 완료
	readyProduct   : 2, // 상품 준비중
	delivery       : 3, // 배송 중
	complete       : 4, // 배송 완료
	completeReview : 5, // 리뷰 달음
}

export default App;
