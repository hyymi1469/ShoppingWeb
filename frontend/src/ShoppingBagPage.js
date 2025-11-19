import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { ErrorFunc, TokenGetter } from './App.js';
import { useNavigate  } from 'react-router-dom';
import ShoppingBagDetail from './ShoppingBagDetail';
import MobileAuthModal from './MobileAuthModal'; // 모달 컴포넌트 import
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

	const myPageBottomCenterStyle = {
		display: 'flex', // Flexbox 레이아웃을 사용합니다.
		flexDirection: 'column', // 아이템들을 세로로 나열합니다.
		alignItems: 'flex-start', // 아이템들을 왼쪽에 정렬합니다.
	}
	
	const orderChartStyle = {
		display: 'flex', // Flexbox 레이아웃을 사용합니다.
		flexDirection: 'row', // 아이템들을 세로로 나열합니다.
		alignItems: 'flex-start', // 아이템들을 왼쪽에 정렬합니다.
	}

	
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

	const topTextStyle = {
		color: '#000', // 글자 색
		fontSize: '17px',
		//fontWeight: 'bold',
	};
	
	const finalTextStyle = {
		color: '#000', // 글자 색
		fontSize: '17px',
		fontWeight: 'bold',
	};

	const totalTextStyle = {
		color: '#2E2E2E', // 글자 색
		fontSize: '15px',
	};

	const deliveryStyle = {
		color: '#6E6E6E', // 글자 색
		fontSize: '13px',
	};

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
	
const ShoppingBagPage = () => {
	const navigate = useNavigate();
	const [shoppingBagInfoList, setShoppingBagInfoList] = useState([]);
	const [deliveryInfoList, setDeliveryInfoList] = useState([]);
	const [totalProductPrice, setTotalProductPrice] = useState(0);
	const [deliveryBoxHeight, setDeliveryBoxHeight] = useState(0); // 초기 높이 값
	const [finalPrice, setFinalPrice] = useState(0); // 초기 높이 값

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
	  
	const FetchShippingBagList = () => {
		const accessToken = localStorage.getItem(TokenGetter.AccessToken)
		const refreshToken = localStorage.getItem(TokenGetter.RefreshToken)
		const userId = localStorage.getItem(TokenGetter.UserID)
		if (accessToken === "" || refreshToken === "")
		{
			alert("로그인 후 이용 가능합니다.");
			navigate('/LoginPage');
		
			return
		}

		const ReqShoppingBagList = {
			LoginId: userId,
			AccessToken: accessToken,
			RefreshToken: refreshToken,
		  };
		  
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.post('http://localhost:8001/shoppingBagList', ReqShoppingBagList);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.post('/api/shoppingBagList', ReqShoppingBagList);
		}
		
		httpReq.then(response => {
			
			localStorage.setItem(TokenGetter.AccessToken, response.data.AccessToken);
			localStorage.setItem(TokenGetter.RefreshToken, response.data.RefreshToken);
			
			var totalCalculatedPrice = 0;
			var totalDeliveryPrice = 0;
			if(response.data.ShoppingBagInfo === null)
			{
				setShoppingBagInfoList([]);
			}
			else
			{
				const sortedItems = [...response.data.ShoppingBagInfo].sort((a, b) => {
					// 먼저 CompanyName으로 비교
					const companyNameComparison = a.CompanyName.localeCompare(b.CompanyName);
					
					// 만약 CompanyName이 같다면 Description으로 비교
					if (companyNameComparison === 0) {
					  const descriptionComparison = a.Description.localeCompare(b.Description);
					  
					  // 만약 description이 같다면 optionName으로 비교
					  if (descriptionComparison === 0) {
						return  a.OptionName.localeCompare(b.OptionName);
					  }
					  
					  return descriptionComparison
					}
					
					// CompanyName이 다르다면 그 결과를 반환
					return companyNameComparison;
				  });
				  
				setShoppingBagInfoList(sortedItems);

				totalCalculatedPrice = sortedItems
  				.filter(product => product.IsChecked)
  				.reduce((total, product) => total + (product.Price + product.AddPrice) * product.Entity, 0);

				setTotalProductPrice(totalCalculatedPrice);
			}
			
			if(response.data.DeliveryPriceInfo === null)
			{
				setDeliveryInfoList([]);
			}
			else
			{
				const sortedItems = [...response.data.DeliveryPriceInfo].sort((a, b) => {
					// 먼저 CompanyName으로 비교
					const companyNameComparison = a.CompanyName.localeCompare(b.CompanyName);
					return companyNameComparison;
				  });
				  
				setDeliveryInfoList(sortedItems);
				
				setDeliveryBoxHeight(40 + (sortedItems.length * 13))
				
				totalDeliveryPrice = response.data.DeliveryPriceInfo
  				.reduce((total, info) => total + info.DeliveryPrice, 0);
			}
			
			
			
			
			const finalPriceInt = totalCalculatedPrice + totalDeliveryPrice
			setFinalPrice(finalPriceInt)
			
			})
			.catch(error => {
				
				if (error.request.status === 10015) 
				{
					localStorage.setItem(TokenGetter.UserID, "");
					localStorage.setItem(TokenGetter.AccessToken, "");
					localStorage.setItem(TokenGetter.RefreshToken, "");
					localStorage.setItem(TokenGetter.UserCompanyId, "");
					
					alert("다시 로그인 해주세요.");
					navigate('/LoginPage');
				}
				
				ErrorFunc(error.request.status)
			});
		
	}
	
	const [isCheck, setIsCheck] = useState(false);

	const handleBuyClick = () => {
		
		const finalShoppingBagInfoList = shoppingBagInfoList
  				.filter(product => product.IsChecked)
		
				  
		navigate('/OrderPage', { 
			state: {
				buyList: finalShoppingBagInfoList,
				totalPrice: totalProductPrice,
				deliveryInfoList: deliveryInfoList,
				finalPrice: finalPrice,
			} });
	};
	
	const handleCheckboxAllChange = () => {
		const userId = localStorage.getItem(TokenGetter.UserID)
		const accessToken = localStorage.getItem(TokenGetter.AccessToken)
		const refreshToken = localStorage.getItem(TokenGetter.RefreshToken)
		const ReqShoppingBagAllCheck = {
			LoginId: userId,
			AccessToken: accessToken,
			RefreshToken: refreshToken,
		  };
		  
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.post('http://localhost:8001/shoppingBagAllCheck', ReqShoppingBagAllCheck);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.post('/api/shoppingBagAllCheck', ReqShoppingBagAllCheck);
		}
		
		httpReq.then(response => {

			FetchShippingBagList()
			
			})
			.catch(error => {
				
				if (error.request.status === 10015) 
				{
					localStorage.setItem(TokenGetter.UserID, "");
					localStorage.setItem(TokenGetter.AccessToken, "");
					localStorage.setItem(TokenGetter.RefreshToken, "");
					localStorage.setItem(TokenGetter.UserCompanyId, "");
					
					alert("다시 로그인 해주세요.");
					navigate('/LoginPage');
				}
				
				ErrorFunc(error.request.status)
			});
	}

	const truncateText = (text, maxDisplayLength) => {
		return text.length > maxDisplayLength ? `${text.slice(0, maxDisplayLength)}...` : text;
	  };
	  
	useEffect(() => {
		FetchShippingBagList()

		return () => {
			//console.log('컴포넌트가 화면에서 사라짐');
		};
	}, []);

	return (
		<div style={containerStyle}>

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
				<div style={myPageBottomCenterStyle}>
					
					<h3 style={{color: '#2E2E2E',}}>장바구니 상품</h3>
					<hr style={{ marginLeft: '0px', marginTop: '20px', marginBottom: '0px', borderBottom: '3px solid #000', width:'1000px' }}></hr>
						<div style={orderChartStyle}>
							{/* 체크박스 */}
							<input
							style={{ width: '20px', height: '20px', display: 'inline-block', cursor: 'pointer', position: 'relative', top: '20px', left: '10px',}}
							type="checkbox"
							checked={isCheck}
							onChange={handleCheckboxAllChange}
							
							/>
							<span style={{marginLeft: '150px', marginTop: '20px', fontWeight: 'bold', color: '#424242',}}>상품정보</span>
							<span style={{marginLeft: '230px', marginTop: '20px', fontWeight: 'bold', color: '#424242',}}>수량</span>
							<span style={{marginLeft: '130px', marginTop: '20px', fontWeight: 'bold', color: '#424242',}}>최종 가격</span>
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
							refreshFunc={FetchShippingBagList}
							/>
						))
  						) : (
							<p>목록이 없습니다.</p>
  						)}
					
			
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
			
			<button style={shoppingBagBtnStyle} onClick={handleBuyClick}  >구매하기</button>
			

			</div>
		</div>
	</div>
	);
}

export default ShoppingBagPage;
