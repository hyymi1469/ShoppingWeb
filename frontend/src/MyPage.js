import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileAuthModal from './MobileAuthModal'; // 모달 컴포넌트 import
import axios from 'axios';
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
import { ErrorFunc, TokenGetter } from './App.js';
import OrderedDetail from './OrderedDetail.js';


const bottomCenterStyle = {
	display: 'flex', /* Flexbox 레이아웃을 사용합니다. */
	justifyContent: 'flexStart', /* 텍스트를 왼쪽에 정렬합니다. */
	alignItems: 'center', /* 수직 중앙 정렬을 설정할 수 있습니다. */
}

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

const heartListStyle = {
	display: 'flex',
	alignItems: 'center', // 수직 가운데 정렬
	justifyContent: 'center', // 가로 가운데 정렬 추가
	flexDirection: 'row', // 가로로 나열
	padding: '10px',
	flexWrap: 'wrap', // 요소가 공간 부족 시 다음 줄로 내려감
	flexBasis: '60%', // 가로로 4개의 이미지를 표시하려면 25%로 설정
	flex: 4,
}

const MyPage = () => {
	
	const navigate = useNavigate();
	const [heartList, setHeartList] = useState([]);
	const [orderedList, setOrderedList] = useState([]);

	useEffect(() => {
		FetchMyInfo()
		return () => {
			//console.log('컴포넌트가 화면에서 사라짐');
		};
	}, []);
	
	const FetchMyInfo = () => {

		const userId = localStorage.getItem(TokenGetter.UserID)
		const accessToken = localStorage.getItem(TokenGetter.AccessToken)
		const refreshToken = localStorage.getItem(TokenGetter.RefreshToken)
		const ReqMyInfo = {
			AccessToken: accessToken,
			RefreshToken: refreshToken,
			LoginId: userId,
		  };
		  
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.post('http://localhost:8001/myInfo', ReqMyInfo);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.post('/api/myInfo', ReqMyInfo);
		}
		
		httpReq.then(response => {
			
			if(response.data.ProductImgInfo === null)
			{
				setHeartList([]);
			}
			else
			{
				const sortedItems = [...response.data.ProductImgInfo].sort((a, b) => a.Description - b.Description);
				setHeartList(sortedItems);
			}

			if(response.data.OrderedInfoList === null)
			{
				setOrderedList([]);
			}
			else
			{
				const sortedItems = [...response.data.OrderedInfoList].sort((a, b) => {
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
				
				setOrderedList(sortedItems);
			}


			
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
					<h3 style={{marginTop:'80px',}}>최근 주문내역</h3>
						<hr style={{ marginLeft: '0px', marginTop: '20px', marginBottom: '00px', borderBottom: '3px solid #000', width:'1400px' }}></hr><br/>
						<div style={orderChartStyle}>
							<span style={{marginLeft: '20px', fontWeight: 'bold', color: '#424242',}}>주문일자</span>
							<span style={{marginLeft: '130px', fontWeight: 'bold', color: '#424242',}}>주문번호</span>
							<span style={{marginLeft: '160px', fontWeight: 'bold', color: '#424242',}}>상품정보</span>
							<span style={{marginLeft: '250px', fontWeight: 'bold', color: '#424242',}}>수량</span>
							<span style={{marginLeft: '100px', fontWeight: 'bold', color: '#424242',}}>금액</span>
							<span style={{marginLeft: '150px', fontWeight: 'bold', color: '#424242',}}>배송주소</span>
							<span style={{marginLeft: '170px', fontWeight: 'bold', color: '#424242',}}>주문상태</span>
						</div>
						<hr style={{ marginLeft: '0px', marginTop: '20px', marginBottom: '0px', borderBottom: '1px solid grey', width:'1400px' }}></hr>

						<div style={{}}>
							{orderedList.length > 0 ? (
								orderedList.map((orderedInfo, index) => (
									<OrderedDetail
										key={index}
										imgURL={orderedInfo.ImgURL}
										productId={orderedInfo.ProductId}
										orderSerial={orderedInfo.OrderSerial}
										description={orderedInfo.Description}
										orderDate={orderedInfo.OrderDate}
										companyName={orderedInfo.CompanyName}
										entity={orderedInfo.Entity}
										totalPrice={orderedInfo.TotalPrice}
										state={orderedInfo.State}
										isLike={orderedInfo.IsLike}
										optionName={orderedInfo.OptionName}
										optionId={orderedInfo.OptionId}
										address={orderedInfo.Address}
										FetchMyInfo={FetchMyInfo}
										isAdmin={false}
									/>
								))
							) : (
								<p>최근 주문내역이 없습니다.</p>
  							)}
						</div>


						
						
						<h3 style={{marginTop: '120px',}}>Like ♡</h3>
						<hr style={{ marginLeft: '0px', marginTop: '20px', marginBottom: '00px', borderBottom: '3px solid #000', width:'1400px' }}></hr><br/>
						
						<div style={heartListStyle}>
							{heartList.length > 0 ? (
							heartList.map((imageInfo, index) => (
								<ImageWithDescription
									key={index}
									src={imageInfo.ImgURL}
									description={imageInfo.Description}
									price={imageInfo.Price}
									productId={imageInfo.ProductId}
									companyName={imageInfo.CompanyName}
									isLike={imageInfo.IsLike}
								/>
							))
  							) : (
								<p>좋아요 누른 항목이 없습니다.</p>
  							)}
						</div>
				</div>
			</div>
			
			{/*오른쪽*/}
			<div style={bottomRightPaneStyle}>
					
			</div>
		</div>
	</div>
	);
}



export default MyPage;
