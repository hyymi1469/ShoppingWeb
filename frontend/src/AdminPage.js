import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { ErrorFunc, TokenGetter } from './App.js';
import { useNavigate, useLocation } from 'react-router-dom';
import CategoryChart from './CategoryChart';
import FixFrame from './FixFrame.js';
import Pagination from './Pagination.js';
import OrderedDetail from './OrderedDetail.js';


export const categoryShowdownParDivStyle = {
	top: '100%',
	left: '0',
	display: 'block',
	backgroundColor: 'white',
	border: '1px solid #ccc',
	borderTop: 'none',
	borderRadius: '0 0 5px 5px',
	boxShadow: 'none',
	zIndex: '1',	
  };


export const containerStyle = {
	display: 'flex',
	flexDirection: 'column',
	height: '100vh',
	overflow: 'auto',
	overflowY: 'auto', // 세로 스크롤바
};

export const bottomPaneContainerStyle = {
	display: 'flex',
	flex: 1,
};
	
export const bottomLeftPaneStyle = {
	//backgroundColor: '#f0f0f0',
	padding: '20px',
	flex: 1,
	//borderRight: '1px solid #ccc',
	textAlign: 'center',
	flexBasis: '20%', // 가로로 4개의 이미지를 표시하려면 25%로 설정
	//border: '1px solid #e4e4e4', // 얇은 테두리 추가
};

export const bottomCenterPaneStyle = {
	//display: 'flex',
	//alignItems: 'center', // 수직 가운데 정렬
	//justifyContent: 'center', // 가로 가운데 정렬 추가
	//flexDirection: 'row', // 가로로 나열
	//padding: '10px',
	//flexWrap: 'wrap', // 요소가 공간 부족 시 다음 줄로 내려감
	flexBasis: '60%', // 가로로 4개의 이미지를 표시하려면 25%로 설정
	//flex: 4,
	//textAlign: 'center',
	//flex: 6, // 가로로 더 크게
	//border: '1px solid #ccc',
};

const bottomCenterListStyle = {
	display: 'flex', // Flexbox 레이아웃을 사용합니다.
    flexDirection: 'column', // 아이템들을 세로로 나열합니다.
    alignItems: 'center', // 아이템들을 왼쪽에 정렬합니다.
};


const bottomRightPaneStyle = {
	//backgroundColor: '#f0f0f0',
	padding: '20px',
	flex: 1,
	//borderLeft: '1px solid #ccc',
	textAlign: 'center',
	flexBasis: '20%', // 가로로 4개의 이미지를 표시하려면 25%로 설정
};

const orderChartStyle = {
	display: 'flex', // Flexbox 레이아웃을 사용합니다.
    flexDirection: 'row', // 아이템들을 세로로 나열합니다.
    alignItems: 'flex-start', // 아이템들을 왼쪽에 정렬합니다.
}

const AdminPage = () => {

	const [curPage, setCurPage] = useState(1); // 현재 페이지
	const [totalPage, setTotalPage] = useState(1); // 총 페이지
	const [orderedList, setOrderedList] = useState([]); // 주문 리스트
	const navigate = useNavigate();

	useEffect(() => {
		
		const ReqAdminOrderList = {
			params: {
				page : curPage,
				company_id: localStorage.getItem(TokenGetter.UserCompanyId),
				user_id: localStorage.getItem(TokenGetter.UserID),
				access_token: localStorage.getItem(TokenGetter.AccessToken),
				refresh_token: localStorage.getItem(TokenGetter.RefreshToken),
			},
		};
		
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.get('http://localhost:8001/adminOrderList', ReqAdminOrderList);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.get('/api/adminOrderList', ReqAdminOrderList);
		}
		
		httpReq.then(response => {

				localStorage.setItem(TokenGetter.AccessToken, response.data.AccessToken);
				localStorage.setItem(TokenGetter.RefreshToken, response.data.RefreshToken);
				setTotalPage(response.data.TotalPageCount)
				setCurPage(curPage)
				if(response.data.OrderedInfoList === null)
				{
					setOrderedList([]);
				}
				else
				{
					const sortedItems = [...response.data.OrderedInfoList].sort((a, b) => {
						// 먼저 CompanyName으로 비교
						const orderDateComparison = a.OrderDate.localeCompare(b.OrderDate);
						return orderDateComparison;
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
		
		return () => {
			
		};
	}, []);
	
	const RefreshSearchPage = (reqCurPage) => {
		const ReqAdminOrderList = {
			params: {
				page : reqCurPage,
				company_id: localStorage.getItem(TokenGetter.UserCompanyId),
				user_id: localStorage.getItem(TokenGetter.UserID),
				access_token: localStorage.getItem(TokenGetter.AccessToken),
				refresh_token: localStorage.getItem(TokenGetter.RefreshToken),
			},
		};
		
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.get('http://localhost:8001/adminOrderList', ReqAdminOrderList);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.get('/api/adminOrderList', ReqAdminOrderList);
		}
		
		httpReq.then(response => {

				localStorage.setItem(TokenGetter.AccessToken, response.data.AccessToken);
				localStorage.setItem(TokenGetter.RefreshToken, response.data.RefreshToken);
				setTotalPage(response.data.TotalPageCount)
				setCurPage(reqCurPage)
				if(response.data.OrderedInfoList === null)
				{
					setOrderedList([]);
				}
				else
				{
					const sortedItems = [...response.data.OrderedInfoList].sort((a, b) => {
						// 먼저 CompanyName으로 비교
						const orderDateComparison = a.OrderDate.localeCompare(b.OrderDate);
						return orderDateComparison;
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
	}

	  
	return (
		<div style={containerStyle}>

			{/*위*/}
			<FixFrame
			curPath={"./../../"}
			isLogin={localStorage.getItem(TokenGetter.AccessToken) === "" ? false : true}
			/>
			{/*///////////////////////////////////////////////*/}
			
			{/*아래*/}
			<div style={bottomPaneContainerStyle}>
			{/*///////////////////////////////////////////////*/}

				{/*왼쪽*/}
				<div style={bottomLeftPaneStyle}>
					{/*강아지 카테고리*/}
					{/*<CategoryChart/>*/}
				</div>
				{/*///////////////////////////////////////////////*/}
				
				{/*중앙*/}
				<div style={bottomCenterPaneStyle}>
					<div style={bottomCenterListStyle}>
					
					<h3>주문내역</h3>
					<hr style={{ marginLeft: '0px', marginTop: '30px', marginBottom: '15px', borderBottom: '2px solid #000', width:'1400px' }}></hr>
					<div style={orderChartStyle}>
					<span style={{marginLeft: '20px', fontWeight: 'bold', color: '#424242',}}>주문일자</span>
						<span style={{marginLeft: '130px', fontWeight: 'bold', color: '#424242',}}>주문번호</span>
						<span style={{marginLeft: '160px', fontWeight: 'bold', color: '#424242',}}>상품정보</span>
						<span style={{marginLeft: '200px', fontWeight: 'bold', color: '#424242',}}>수량</span>
						<span style={{marginLeft: '150px', fontWeight: 'bold', color: '#424242',}}>금액</span>
						<span style={{marginLeft: '130px', fontWeight: 'bold', color: '#424242',}}>배송주소</span>
						<span style={{marginLeft: '130px', fontWeight: 'bold', color: '#424242',}}>주문상태</span>
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
										address={orderedInfo.Address}
										optionId={orderedInfo.OptionId}
										isAdmin={true}
									/>
								))
							) : (
								<p>최근 주문내역이 없습니다.</p>
  							)}
						</div>
					
					
					</div>
					
						<Pagination
							currentPage={curPage}
							totalPages={totalPage}
							onPageChange={RefreshSearchPage}
						/>
					
					
				</div>
				{/*///////////////////////////////////////////////*/}
				
				{/*오른쪽*/}
				<div style={bottomRightPaneStyle}>
					
				</div>
				{/*///////////////////////////////////////////////*/}
				
			</div>
		
			
		</div>
		);
	}
	
export default AdminPage;

