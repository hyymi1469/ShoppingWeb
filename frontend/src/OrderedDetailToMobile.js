import React, { useState, useEffect  } from 'react';
import { ErrorFunc, TokenGetter, OrderState } from './App.js';
import { useNavigate } from 'react-router-dom';
import HeartControl from './HeartControl.js';
import ReviewModal from './ReviewModal'; // 모달 컴포넌트 import
import axios from 'axios';



const imageStyle = {
	width: '110px', // 이미지 너비 조절
	height: '130px', // 이미지 높이 조절
	//border: '1px solid #e4e4e4', // 얇은 테두리 추가
	marginRight: '20px', // 이미지들 간의 가로 간격
	marginLeft: '10px',
	cursor: "pointer",
	marginTop: '5px',
};

const companyNameStyle = {
	marginBottom: '10px', // description과 price 사이 간격 조절
	color: '#585858',
	fontSize: '14px',
	whiteSpace: 'pre-line',
	cursor: "pointer",
	fontWeight: 'bold', // 글ꔨ를 굵게 만드는 스타일 추가
	marginTop: '40px',
	textAlign: 'left',
};

const descriptionStyle = {
	marginBottom: '10px', // description과 price 사이 간격 조절
	color: 'black',
	fontSize: '13px',
	whiteSpace: 'pre-line',
	cursor: "pointer",
	marginTop: '0px',
};

const optionStyle = {
	marginBottom: '10px', // description과 price 사이 간격 조절
	color: '#848484',
	fontSize: '13px',
	whiteSpace: 'pre-line',
	cursor: "pointer",
	marginTop: '0px',
};

const ReviewBtnStyle = {

  fontSize: '14px',
  background: 'black',
  color: 'white', // 흰색으로 변경
  border: 'none',
  width: "70px",
  height: "40px",
  borderRadius: '3px',
  cursor: 'pointer',
  //border: '1px solid #e4e4e4', // 얇은 테두리 추가
  position: "relative",
  top: "-25px",
  left: "290px",
  };
	
const OrderedDetailToMobile = ({imgURL, productId, orderSerial, description, orderDate, optionName, optionId, companyName, entity, totalPrice, state, isLike, address, isAdmin, FetchMyInfo}) => {

	const navigate = useNavigate();
	const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

	const handleDetailProductClick = () => {
		
		if (window.innerWidth  <= 768)
		{
			navigate(`/ProductDetailToMobile/${productId}`, {isLikeParam: isLike});
		}
		else
		{
			navigate(`/ProductDetail/${productId}`, {isLikeParam: isLike});
		}
	};
	
	const ClickReview  = () => {
		setIsReviewModalOpen(true)
	}
	
	const ClickVerifyOrder  = () => {
		const userChoice = window.confirm("상품을 확인하셨습니까? '예'를 누르면 고객에게 '상품 준비 중' 으로 보이게 됩니다.");
		if (userChoice) {
			
			const userId = localStorage.getItem(TokenGetter.UserID)
			const accessToken = localStorage.getItem(TokenGetter.AccessToken)
			const refreshToken = localStorage.getItem(TokenGetter.RefreshToken)
			const ReqChangeState = {
				AccessToken: accessToken,
				RefreshToken: refreshToken,
				UserId: userId,
				ReqState:OrderState.readyProduct,
				ProductId:productId,
				OptionId:optionId,
				OrderSerial:orderSerial,
			  };
			  
			var httpReq;
			if (process.env.NODE_ENV === 'development')
			{
				httpReq = axios.post('http://localhost:8001/changeState', ReqChangeState);
			}
			else if (process.env.NODE_ENV === 'production')
			{
				httpReq = axios.post('/api/changeState', ReqChangeState);
			}
			
			httpReq.then(response => {
	
				
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
			
		  } else {
			// 사용자가 취소 버튼을 눌렀을 때의 로직
			//console.log("사용자가 취소를 선택했습니다.");
		  }
	}
	
	const ClickSendDelivery  = () => {
		const userChoice = window.confirm("상품을 택배로 보내셨습니까? '예'를 누르면 고객에게 '배송 중' 으로 보이게 됩니다.");
		if (userChoice) {
			
			const userId = localStorage.getItem(TokenGetter.UserID)
			const accessToken = localStorage.getItem(TokenGetter.AccessToken)
			const refreshToken = localStorage.getItem(TokenGetter.RefreshToken)
			const ReqChangeState = {
				AccessToken: accessToken,
				RefreshToken: refreshToken,
				UserId: userId,
				ReqState:OrderState.delivery,
				ProductId:productId,
				OptionId:optionId,
				OrderSerial:orderSerial,
			  };
			  
			var httpReq;
			if (process.env.NODE_ENV === 'development')
			{
				httpReq = axios.post('http://localhost:8001/changeState', ReqChangeState);
			}
			else if (process.env.NODE_ENV === 'production')
			{
				httpReq = axios.post('/api/changeState', ReqChangeState);
			}
			
			httpReq.then(response => {
	
				
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
			
		  } else {
			// 사용자가 취소 버튼을 눌렀을 때의 로직
			//console.log("사용자가 취소를 선택했습니다.");
		  }
	}
	
	const CloseReviewModal = () => {
		setIsReviewModalOpen(false)
	};

	const formattedDate = orderDate ? orderDate.split(' ')[0].replace(/-/g, '.') : '';
	
	return (
	<div>
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start',}}>
		<div style={{ display: 'flex', flexDirection: 'row', marginTop: '-10px' }}>
			<span style={{ marginLeft: '15px', marginTop: "5px", color: '#1C1C1C', fontWeight: 'bold', display: 'inline-block' }}> {formattedDate} </span>
			<span style={{ marginLeft: '170px', color: '#585858', fontSize:'13px',}}> 주문번호:{orderSerial}</span>
		</div>
		
		<hr style={{
				marginTop: '10px',
				marginBottom: '20px',
				backgroundColor: 'rgb(235, 235, 235)',
				width: '100%',
				height: '1px',
				border: '0',
				}}>
		</hr>
			
		<div style={{ display: 'flex', flexDirection: 'row', marginTop: '-5px' }}>
			<img style={imageStyle} src={imgURL} onClick={handleDetailProductClick} alt={"불러오기 실패"} />
			<div style={{flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '0px', marginTop:"-30px",}}>
				<span style={companyNameStyle} onClick={handleDetailProductClick}> {companyName}</span>
				<span style={descriptionStyle} onClick={handleDetailProductClick}> {description}</span>
				<span style={optionStyle} onClick={handleDetailProductClick}> 옵션:{optionName} | {entity}개</span>
				<span style={{marginLeft: '0px',marginTop: '10px', color: '#585858',}}> {totalPrice.toLocaleString()}원</span>
			</div>
		</div>
		
		<hr style={{
				marginTop: '10px',
				marginBottom: '20px',
				backgroundColor: 'rgb(235, 235, 235)',
				width: '100%',
				height: '1px',
				border: '0',
				}}>
		</hr>
		
		<div style={{width: '230px'/*원하는 너비 설정*/, wordWrap: 'break-word',/*텍스트가 넘칠 때 줄바꿈*/}}>
			{<span style={{flex: 1, display: 'flex', alignItems: 'flex-start',
			        marginLeft: '10px',marginTop: '0px', color: '#848484',maxWidth:"38ch", overflowWrap: "break-word", fontSize:"12px", }}>
				 주소:{address}</span>}
		</div>
		<div>
			{state === OrderState.completeOrder && (
				!isAdmin ? (
					<span style={{position: "relative", top: "-25px", left: "290px", color: '#424242', fontWeight:"bold",}}>주문 완료</span>
				) : (
					<button style={{ReviewBtnStyle}} onClick={ClickVerifyOrder}>
						주문 확인
					</button>
				)
		 	 )}
		  
			{state === OrderState.readyProduct && (
				!isAdmin ? (
					<span style={{position: "relative", top: "-25px", left: "270px", color: '#424242', fontWeight:"bold",}}>상품 준비 중</span>
				) : (
					<button style={{ReviewBtnStyle}} onClick={ClickSendDelivery}>
						배송 보냄 완료
					</button>
				)
			)}
		  
			{state === OrderState.delivery && (
				!isAdmin ? (
					<span style={{position: "relative", top: "-25px", left: "290px", color: '#424242', fontWeight:"bold",}}>배송 중</span>
				) : (
					<span style={{flex: 1, display: 'flex', alignItems: 'center', marginLeft: '85px', marginRight: '0px' , marginTop: '78px', color: '#585858', fontWeight: 'bold', }}>고객에게 배송 중</span>
				)
		  	)}
			
			{state === OrderState.complete && (
				!isAdmin ? (
					<button style={{...ReviewBtnStyle}} onClick={ClickReview}>
						리뷰 달기
					</button>
				) : (
					<span style={{flex: 1, display: 'flex', alignItems: 'center', marginLeft: '85px', marginRight: '0px' , marginTop: '78px', color: '#585858', fontWeight: 'bold', }}>리뷰 대기 중(주문일자로부터 14일 후 완료 처리)</span>
  				)
  			)}
			
			{state === OrderState.completeReview && (
				<span style={{position: "relative", top: "-25px", left: "260px", color: '#424242', fontWeight:"bold", }}>리뷰 작성 완료</span>
			)}
			
		</div>
			
			
			{isReviewModalOpen && (
				<ReviewModal isOpen={isReviewModalOpen} onClose={CloseReviewModal} productId={productId} orderSerial={orderSerial} optionId={optionId} FetchMyInfo={FetchMyInfo} ></ReviewModal>
			)}
			
			

		</div>
		
		<hr style={{
				marginTop: '0px',
				marginBottom: '20px',
				backgroundColor: 'rgb(235, 235, 235)',
				width: '100%',
				height: '10px',
				border: '0',
				}}>
		</hr>
		
	</div>
	);
}

export default OrderedDetailToMobile;
