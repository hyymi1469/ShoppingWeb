import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { ErrorFunc, TokenGetter } from './App.js';
import { useNavigate } from 'react-router-dom';
import HeartControl from './HeartControl.js';
import { containerStyle,
	bottomPaneContainerStyle,
	bottomLeftPaneStyle,
	bottomCenterPaneStyle,
	selectedBottomCenterPaneStyle,
	bottomCenterListStyle,
	bottomCenterCheckBoxPaneStyle,
	bottomCenterApplyPaneStyle,
	checkBoxLabelStyle,
	bottomRightPaneStyle,
	applyBtnStyle,
	ImageWithDescription} from './MainPage'; // 스타일 파일 경로에 따라 수정하세요
	import FixFrame from './FixFrame.js';



const imageStyle = {
	width: '150px', // 이미지 너비 조절
	height: '170px', // 이미지 높이 조절
	//border: '1px solid #e4e4e4', // 얇은 테두리 추가
	marginRight: '20px', // 이미지들 간의 가로 간격
	marginLeft: '50px',
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
	
const ShoppingBagDetail = ({imgURL, productId, description, companyName, optionName, isLike, entity, price, addPrice, isChecked, optionId, refreshFunc, isHide}) => {

	const [isCheck, setIsCheck] = useState(isChecked);
	const navigate = useNavigate();
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
	
	useEffect(() => {
		setIsCheck(isChecked)
		
		return () => {
			//console.log('컴포넌트가 화면에서 사라짐');
		};
	}, [isChecked]);

	const deleteShoppingBagClick = () => {
		
		const userId = localStorage.getItem(TokenGetter.UserID)
		const accessToken = localStorage.getItem(TokenGetter.AccessToken)
		const refreshToken = localStorage.getItem(TokenGetter.RefreshToken)
		const ReqShoppingBagDelete = {
			LoginId: userId,
			AccessToken: accessToken,
			RefreshToken: refreshToken,
			ProductId: parseInt(productId, 10),
			OptionId: optionId,
		  };
		
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.post('http://localhost:8001/deleteShoppingBag', ReqShoppingBagDelete);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.post('/api/deleteShoppingBag', ReqShoppingBagDelete);
		}
		
		httpReq.then(response => {
			
			refreshFunc()
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
		
	};
	
	const totalPrice = entity * (price + addPrice)
	

const handleCheckboxChange = () => {
		const userId = localStorage.getItem(TokenGetter.UserID)
		const accessToken = localStorage.getItem(TokenGetter.AccessToken)
		const refreshToken = localStorage.getItem(TokenGetter.RefreshToken)
		const ReqShoppingBagChangeCheck = {
			LoginId: userId,
			AccessToken: accessToken,
			RefreshToken: refreshToken,
			ProductId: parseInt(productId, 10),
			IsChecked: !isCheck,
			OptionId: optionId,
		  };
		  
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.post('http://localhost:8001/shoppingBagChangeCheck', ReqShoppingBagChangeCheck);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.post('/api/shoppingBagChangeCheck', ReqShoppingBagChangeCheck);
		}
		
		httpReq.then(response => {

			localStorage.setItem(TokenGetter.AccessToken, response.data.AccessToken);
			localStorage.setItem(TokenGetter.RefreshToken, response.data.RefreshToken);
			//setIsCheck(prevState => !prevState); // 상태값을 업데이트
			refreshFunc()
			
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
  };
  
	return (
	<div>
		<div style={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start',}}>
			<img style={imageStyle} src={imgURL} onClick={handleDetailProductClick} alt={"불러오기 실패"} />
			<div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '40px',}}>
				
				<span style={companyNameStyle} onClick={handleDetailProductClick} > {companyName}</span>
				<span style={descriptionStyle} onClick={handleDetailProductClick}> {description}</span>
				<span style={optionStyle} onClick={handleDetailProductClick}>옵션: {optionName}</span>
				
			</div>
			
			<span style={{flex: 1, display: 'flex', alignItems: 'center', marginLeft: '-100px',marginTop: '78px', color: '#585858',}}>{entity}</span>
			<span style={{flex: 1, display: 'flex', alignItems: 'center', marginLeft: '-170px',marginTop: '78px', color: '#585858',}}>{totalPrice.toLocaleString()}원</span>
			{!isHide && (<span onClick={deleteShoppingBagClick} className="span-shopping_delete" ></span>)}
		</div>
		
		
		{/* 체크박스 */}
		{ !isHide &&
		(<input
		type="checkbox"
		checked={isCheck}
		onChange={handleCheckboxChange}
		className="custom-checkbox"
		/>)
		}
	 
		<hr style={{ marginLeft: '0px', marginTop: '0px', marginBottom: '0px', borderBottom: '0px grey', width:'1000px' }}></hr>

		
	</div>
	);
}

export default ShoppingBagDetail;
