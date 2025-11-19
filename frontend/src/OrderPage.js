import React, { useState, useEffect  } from 'react';
import { ErrorFunc, TokenGetter } from './App.js';
import { useNavigate, useLocation  } from 'react-router-dom';
import ShoppingBagDetail from './ShoppingBagDetail';
import { containerStyle,
	bottomPaneContainerStyle,
	bottomLeftPaneStyle,
	bottomCenterPaneStyle,
	selectedBottomCenterPaneStyle,
	bottomCenterListStyle,
	bottomCenterCheckBoxPaneStyle,
	bottomCenterApplyPaneStyle,
	checkBoxLabelStyle,
	applyBtnStyle,
	bottomRightPaneStyle,
	ImageWithDescription} from './MainPage'; // 스타일 파일 경로에 따라 수정하세요
import FixFrame from './FixFrame.js';
import "./OrderPage.css";

const deliveryDivStyle = {
	width: '300px',
	height: '55px',
	backgroundColor: '#E6E6E6', // 회색 배경색
	display: 'flex',
	alignItems: 'flex-start',
	position: 'relative',
	top: '25px',
	left: '-140px',
	flexDirection: 'row', // 아이템들을 세로로 나열합니다.
	justifyContent: 'flex-start', // 세로 정렬을 시작 부분에 정렬
  };
  
const finalTextStyle = {
	color: '#000', // 글자 색
	fontSize: '17px',
	fontWeight: 'bold',
};
  
const topBoxStyle = {
	width: '300px',
	height: '50px',
	backgroundColor: '#E6E6E6', // 회색 배경색
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	position: 'relative',
	top: '25px',
	left: '-140px',
	flexDirection: 'column', // 아이템들을 세로로 나열합니다.
	borderBottom: '1px solid #BDBDBD',
  };


const grayBoxStyle = {
	width: '300px',
	height: '40px',
	backgroundColor: '#E6E6E6', // 회색 배경색
	display: 'flex',
	alignItems: 'flex-start',
	position: 'relative',
	top: '25px',
	left: '-140px',
	flexDirection: 'row', // 아이템들을 세로로 나열합니다.
	justifyContent: 'flex-start', // 세로 정렬을 시작 부분에 정렬
  };
  
const totalTextStyle = {
	color: '#2E2E2E', // 글자 색
	fontSize: '15px',
};

const topTextStyle = {
	color: '#000', // 글자 색
	fontSize: '17px',
	//fontWeight: 'bold',
};
const inputStyle = {
	width: '200px',
	height: '45px',
	padding: '5px 5px',
	border: '0px solid #ccc',
	borderRadius: '0px',
	backgroundColor: '#f0f0f0',
	position: 'relative',
	top: '0px',
	left: '100px',
};

const deliveryStyle = {
	color: '#6E6E6E', // 글자 색
	fontSize: '13px',
};

const orderChartStyle = {
	display: 'flex', // Flexbox 레이아웃을 사용합니다.
	flexDirection: 'row', // 아이템들을 세로로 나열합니다.
	alignItems: 'flex-start', // 아이템들을 왼쪽에 정렬합니다.
}

const myPageBottomCenterStyle = {
	display: 'flex', // Flexbox 레이아웃을 사용합니다.
	flexDirection: 'column', // 아이템들을 세로로 나열합니다.
	alignItems: 'flex-start', // 아이템들을 왼쪽에 정렬합니다.
}

const truncateText = (text, maxDisplayLength) => {
	return text.length > maxDisplayLength ? `${text.slice(0, maxDisplayLength)}...` : text;
  };
  
const shoppingBagBtnStyle = {
	marginTop: '28px',
	marginLeft: '-322px',
	fontSize: '15px',
	background: '#000', // 검은색 바탕
	color: '#fff', // 텍스트 색상 (흰색)
	padding: '20px 120px', // 패딩 설정 (상하 10px, 좌우 20px)
	border: 'none', // 테두리 없음
	//borderRadius: '5px', // 버튼을 둥글게 만들기 위한 속성
	cursor: 'pointer', // 커서 스타일 (손가락 모양)
  };
	
const OrderPage = () => {
	const location = useLocation();
	
	const [zoneCode, setZoneCode] = useState('우편번호');
	const [address, setAddress] = useState('주소');
	const [detailAddress, setDetailAddress] = useState('');
	const [deliveryBoxHeight, setDeliveryBoxHeight] = useState(0); // 초기 높이 값
	const shoppingBagInfoList = location.state.buyList;
	const totalProductPrice = location.state.totalPrice;
	const deliveryInfoList = location.state.deliveryInfoList;
	const finalPrice = location.state.finalPrice;
	
	
	
	const deliveryBoxStyle = {
		width: '300px',
		height: `${deliveryBoxHeight}px`, // 높이를 동적으로 계산
		backgroundColor: '#E6E6E6', // 회색 배경색
		display: 'flex',
		alignItems: 'flex-start',
		position: 'relative',
		top: '25px',
		left: '-140px',
		flexDirection: 'row', // 아이템들을 세로로 나열합니다.
		flexDirection: 'column', // 아이템들을 세로로 나열합니다.
		justifyContent: 'flex-start', // 세로 정렬을 시작 부분에 정렬
		borderBottom: '1px solid #585858'
	  };
	
  useEffect(() => {
	setDeliveryBoxHeight(40 + (deliveryInfoList.length * 13))
	
	/*왜인지 모르겠지만 이 구간 삭제하면 에러남 ㅠ*/
	const script = document.createElement('script');
	script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
	script.async = true;
	document.head.appendChild(script);
	/*왜인지 모르겠지만 이 구간 삭제하면 에러남 ㅠ*/
	
	return () => {
	};
	
  }, []);
  
  const InputDetailAddressChange = (e) => {
	setDetailAddress(e.target.value)
  };
  
  const findAddressClick  = () => {
	
	setDetailAddress('');
	// 다음 우편번호 서비스 API 스크립트 동적 추가
	const script = document.createElement('script');
	script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
	script.async = true;
	document.head.appendChild(script);
	
	const daumPostcode = new window.daum.Postcode({
		oncomplete: function (data) {
		  console.log(data);
		  setZoneCode(data.zonecode)
		  setAddress(data.address)
		},
		onclose: function (state) {
			document.head.removeChild(script);
		},
	  });

	  daumPostcode.open();
};

  return (
	<div>
	 
	  
	  {/*위*/}
		<FixFrame
		curPath={"./"}
		isLogin={localStorage.getItem(TokenGetter.AccessToken) === "" ? false : true}/>
		{/*///////////////////////////////////////////////*/}
		{/*아래*/}
		<div style={bottomPaneContainerStyle}>
		{/*///////////////////////////////////////////////*/}

			{/*왼쪽*/}
			<div style={bottomLeftPaneStyle}>

			</div>
			{/*///////////////////////////////////////////////*/}

			{/*중앙*/}
			<div style={bottomCenterPaneStyle}>
				<div style={{display: 'flex', flexDirection: 'column',alignItems: 'flex-start',}}>
					<h3 style={{color: '#2E2E2E',}}>배송 정보</h3>
					<hr style={{ marginLeft: '0px', marginTop: '20px', marginBottom: '0px', borderBottom: '3px solid #000', width:'1000px' }}></hr>
					
					<div style={{ flexDirection: 'row', marginTop: "15px", alignItems: 'center',}}>
						<span style={{color: '#585858', marginLeft:'100px', fontSize: '15px',}}>받으실 분</span>
						<input maxLength="32" style={inputStyle} type="text" placeholder="성함" />
					</div>
					<hr style={{ marginLeft: '0px', marginTop: '15px', marginBottom: '0px', borderBottom: '0px grey', width:'1000px' }}></hr>
					<div style={{display: 'flex', flexDirection: 'row', marginTop: "15px", alignItems: 'center',}}>
						<span style={{color: '#585858', marginLeft:'85px', fontSize: '15px',}}>휴대폰 번호</span>
						<input maxLength="11" style={inputStyle} type="text" placeholder="-없이 입력) 01012345678" />
					</div>
					<hr style={{ marginLeft: '0px', marginTop: '15px', marginBottom: '0px', borderBottom: '0px grey', width:'1000px' }}></hr>
					<div style={{display: 'flex', flexDirection: 'row', marginTop: "15px", alignItems: 'center',}}>
						<span style={{color: '#585858', marginLeft:'100px', fontSize: '15px',}}>배송 주소</span>
						<button id="" onClick={findAddressClick } style={{...inputStyle, color: '#585858', }}>{zoneCode}</button>
					</div>
					<div style={{display: 'flex', flexDirection: 'row', marginTop: "15px", alignItems: 'center',}}>
						<button id="" onClick={findAddressClick } style={{...inputStyle, marginLeft: '165px',width: '420px',color: '#585858',}}>{address}</button>
						<input type="text" maxLength="128" placeholder="상세 주소(직접 입력)" id="" value={detailAddress} onChange={InputDetailAddressChange} style={{...inputStyle, marginLeft: '15px', width: '300px',color: '#585858',}}/>
					</div>
					<hr style={{ marginLeft: '0px', marginTop: '15px', marginBottom: '0px', borderBottom: '0px grey', width:'1000px' }}></hr>
					<div style={{display: 'flex', flexDirection: 'row', marginTop: "15px", alignItems: 'center',}}>
						<span style={{color: '#585858', marginLeft:'85px', fontSize: '15px',}}>배송 메시지</span>
						<input maxLength="48" style={{...inputStyle, width: '600px',}} type="text" placeholder="ex)부재시 경비실에 맡겨 주세요" />
					</div>
					<hr style={{ marginLeft: '0px', marginTop: '15px', marginBottom: '0px', borderBottom: '0px grey', width:'1000px' }}></hr>
					
					<div style={myPageBottomCenterStyle}>
					
						<h3 style={{color: '#2E2E2E', marginTop:'100px',}}>주문 상품</h3>
						<hr style={{ marginLeft: '0px', marginTop: '20px', marginBottom: '0px', borderBottom: '3px solid #000', width:'1000px' }}></hr>
							<div style={orderChartStyle}>
								
								<span style={{marginLeft: '150px', marginTop: '20px', fontWeight: 'bold', color: '#848484',}}>상품정보</span>
								<span style={{marginLeft: '230px', marginTop: '20px', fontWeight: 'bold', color: '#848484',}}>수량</span>
								<span style={{marginLeft: '130px', marginTop: '20px', fontWeight: 'bold', color: '#848484',}}>최종 가격</span>
							</div>
						<hr style={{ marginLeft: '0px', marginTop: '20px', marginBottom: '0px', borderBottom: '1px solid grey', width:'1000px' }}></hr>
						
						{shoppingBagInfoList.length > 0 ? (
						shoppingBagInfoList.map((shoppingBagInfo, index) => (
							<ShoppingBagDetail
							key={index}
							imgURL={shoppingBagInfo.ImgURL}
							productId={shoppingBagInfo.ProductId}
							description={shoppingBagInfo.Description}
							companyName={shoppingBagInfo.CompanyName}
							optionName={shoppingBagInfo.OptionName}
							isLike={shoppingBagInfo.IsLike}
							entity={shoppingBagInfo.Entity}
							price={shoppingBagInfo.Price}
							addPrice={shoppingBagInfo.AddPrice}
							isChecked={shoppingBagInfo.IsChecked}
							optionId={shoppingBagInfo.OptionId}
							isHide={true}
							/>
						))
  						) : (
							<p>목록이 없습니다.</p>
  						)}
					
					<h3 style={{color: '#2E2E2E', marginTop:'100px',}}>결제 수단</h3>
						<hr style={{ marginLeft: '0px', marginTop: '20px', marginBottom: '0px', borderBottom: '3px solid #000', width:'1000px' }}></hr>
							
						<hr style={{ marginLeft: '0px', marginTop: '20px', marginBottom: '0px', borderBottom: '1px solid grey', width:'1000px' }}></hr>
						
					</div>
				</div>
			</div>
			
			{/*오른쪽*/}
			<div style={bottomRightPaneStyle}>
			<div style={topBoxStyle}>
	  			<span style={topTextStyle}>주문금액</span>
			</div>
			<div style={{...grayBoxStyle}}>
	  			<span style={{...totalTextStyle, flex: 1, display: 'flex', marginLeft: '20px', marginTop: '15px',}}>총 상품 금액</span>
				<span style={{...totalTextStyle,marginRight: '20px',marginTop: '15px',}}>{totalProductPrice.toLocaleString()}원</span> 
			</div>
			<div style={{...grayBoxStyle}}>
	  			<span style={{...totalTextStyle, flex: 1, display: 'flex', marginLeft: '20px', marginTop: '10px',}}>배송비</span>
			</div>
			<div style={{...deliveryBoxStyle}}>
				<div style={{position: 'relative',display: 'flex', alignItems: 'flex-start',flexDirection: 'row',}}>
				<div style={{display: 'flex', flexDirection: 'column',}}>
					{deliveryInfoList.map((DeliveryPriceInfo, index) => (
							<div style={{display: 'flex', flexDirection: 'row', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',}}>
								<span style={{...deliveryStyle,flex: 1, display: 'flex', marginLeft: '40px', marginTop: '0px',}}>
								{truncateText(DeliveryPriceInfo.CompanyName, 10)}
								</span>
								<span style={{...deliveryStyle, marginLeft: '60px',marginTop: '0px',}}>
								  {DeliveryPriceInfo.DeliveryPrice.toLocaleString()}원
								</span>
							</div>
					))}
				</div>
					
				</div>
			</div>
			
			<div style={deliveryDivStyle}>
	  			<span style={{...finalTextStyle, marginLeft: '20px',marginTop: '15px',}}>총 금액</span>
				<span style={{...finalTextStyle, marginLeft: '120px',marginTop: '15px',}}>{finalPrice.toLocaleString()}원</span>
			</div>

			<button style={shoppingBagBtnStyle}  >결제하기</button>
			</div>
		</div>
		
		
	</div>
  );
};

export default OrderPage;