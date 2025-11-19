import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { ErrorFunc, TokenGetter } from './App.js';
import { useNavigate } from 'react-router-dom';
import CategoryChart from './CategoryChart';
import FixFrame from './FixFrame.js';
import Pagination from './Pagination.js';
import HeartControl from './HeartControl.js';
import './mediaScreen.css';

export const categoryStyle = {
	color: '#6E6E6E',
	marginRight: '10px', // h1과 input 사이 간격을 조절
	marginBottom: '15px', // h1과 input 사이 간격을 조절
	alignItems: 'center', // 수직 가운데 정렬
	cursor: 'pointer', // 클릭 모양 커서 설정
  };
  
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
  
export const categoryShowdownUlStyle = {
	listStyleType: 'none',
	 padding: '0',
	  margin: '0'
  };
  
export const categoryShowdownDtnStyle = {
	backgroundColor: 'white',
	border: 'none',
	padding: '10px',
	cursor: 'pointer',
	width: '100%', // 버튼의 가로 범위를 100%로 설정
  };

export const categoryMainTextStyle = {

	color: 'black',
	 fontSize: '16px',
	 marginRight: "20px",
}
  
export const categorySubTextStyle = {

	color: '#A4A4A4',
	fontSize: '15px',
}
export const categoryMarkTextStyle = {

	color: '#9F81F7',
	fontSize: '15px',
	float: 'right', // 맨 오른쪽으로 붙임
}
export const SearchInputStyle = {
	fontSize: '16px',
	border: 'none', // 테두리 없애기
	outline: 'none',
	padding: '6px',
	borderBottom: '2px solid black', // 언더바 스타일
	borderRadius: '0', // 언더바를 둥글게 하지 않도록 설정
	width: '270px', // 검색 인풋 창의 너비를 조절합니다
};
 
export const categoryShowdownDivStyle = {
	top: '100%',
	left: '0',
	display: 'block',
	backgroundColor: 'white',
	//border: '1px solid #ccc',
	borderTop: 'none',
	borderRadius: '0 0 5px 5px',
	//boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
	zIndex: '1',
	
};

export const companyNameStyle = {
	marginBottom: '10px', // description과 price 사이 간격 조절
	color: '#585858',
	fontSize: '16px',
	whiteSpace: 'pre-line',
	cursor: "pointer",
	fontWeight: 'bold', // 글ꔨ를 굵게 만드는 스타일 추가
};

export const descriptionStyle = {
	marginBottom: '10px', // description과 price 사이 간격 조절
	color: '#585858',
	fontSize: '16px',
	whiteSpace: 'pre-line',
	cursor: "pointer",
};

export const priceStyle = {
	marginTop: '10px', // price 위 간격 조절
	color: '#151515',
	fontSize: '18px',
	cursor: "pointer"
};
export const containerStyle = {
	display: 'flex',
	flexDirection: 'column',
	height: '100vh',
	overflow: 'auto',
	overflowY: 'auto', // 세로 스크롤바
};

export const userMenuStyle = {
	//backgroundColor: '#afafaf',
	color: 'white',
	padding: '4px',
	textAlign: 'center',
	//height: '270px',
};

export const bottomPaneContainerStyle = {
	display: 'flex',
	flex: 1,
};
	
export const bottomLeftPaneStyle = {
	//backgroundColor: '#f0f0f0',
	//padding: '20px',
	//flex: 1,
	//borderRight: '1px solid #ccc',
	//textAlign: 'center',
	//flexBasis: '20%', // 가로로 4개의 이미지를 표시하려면 25%로 설정
	//border: '1px solid #e4e4e4', // 얇은 테두리 추가
};

export const selectedBottomCenterPaneStyle = {
	//display: 'flex',
	//alignItems: 'center', // 수직 가운데 정렬
	//justifyContent: 'center', // 가로 가운데 정렬 추가
	//flexDirection: 'row', // 가로로 나열
	//padding: '10px',
	flexWrap: 'wrap', // 요소가 공간 부족 시 다음 줄로 내려감
	flexBasis: '60%', // 가로로 4개의 이미지를 표시하려면 25%로 설정
}

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

export const bottomCenterListStyle = {
	display: 'flex',
	alignItems: 'center', // 수직 가운데 정렬
	justifyContent: 'center', // 가로 가운데 정렬 추가
	flexDirection: 'row', // 가로로 나열
	padding: '10px',
	flexWrap: 'wrap', // 요소가 공간 부족 시 다음 줄로 내려감
	flexBasis: '60%', // 가로로 4개의 이미지를 표시하려면 25%로 설정
	flex: 4,
	//textAlign: 'center',
	//border: '1px solid #ccc',
};

export const bottomCenterItemsStyle = {
	display: 'flex',
	alignItems: 'center', // 수직 가운데 정렬
	justifyContent: 'center', // 가로 가운데 정렬 추가
	flexDirection: 'row', // 가로로 나열
	padding: '10px',
	flexWrap: 'wrap', // 요소가 공간 부족 시 다음 줄로 내려감
	flexBasis: '60%', // 가로로 4개의 이미지를 표시하려면 25%로 설정

	//flex: 4,
	//textAlign: 'center',
	//flex: 6, // 가로로 더 크게
};


export const bottomCenterApplyPaneStyle = {
	//display: 'flex',
	//alignItems: 'center', // 수직 가운데 정렬
	//justifyContent: 'center', // 가로 가운데 정렬 추가
	//flexDirection: 'row', // 가로로 나열
	//flexWrap: 'wrap', // 요소가 공간 부족 시 다음 줄로 내려감
	//flexBasis: '60%', // 가로로 4개의 이미지를 표시하려면 25%로 설정

	//borderBottom: '1px solid #ccc', // 언더바 스타일: '1px solid #e4e4e4', // 얇은 테두리 추가 임시 ymi
};

export const checkBoxLabelStyle = {
	marginRight: '50px',
}


export const bottomRightPaneStyle = {
	//backgroundColor: '#f0f0f0',
	padding: '20px',
	flex: 1,
	//borderLeft: '1px solid #ccc',
	textAlign: 'center',
	flexBasis: '20%', // 가로로 4개의 이미지를 표시하려면 25%로 설정
};

export const imageStyle = {
	width: '240px', // 이미지 너비 조절
	height: '280px', // 이미지 높이 조절
	border: '1px solid #e4e4e4', // 얇은 테두리 추가
	marginRight: '20px', // 이미지들 간의 가로 간격
	cursor: "pointer"
};

export const mainLogoImageStyle = {
	maxWidth: '100%', // 이미지의 최대 너비를 부모 요소에 맞게 조절
	//width: '240px', // 이미지 너비 조절
	height: '170px', // 이미지 높이 조절
	//border: '1px solid #e4e4e4', // 얇은 테두리 추가
	//marginRight: '20px', // 이미지들 간의 가로 간격
	cursor: "pointer"
};

export const searchImageStyle = {
	maxWidth: '100%', // 이미지의 최대 너비를 부모 요소에 맞게 조절
	width: '25px', // 이미지 너비 조절
	height: '25px', // 이미지 높이 조절
	//border: '1px solid #e4e4e4', // 얇은 테두리 추가
	marginRight: '20px', // 이미지들 간의 가로 간격
	cursor: "pointer"
};

export const userInfoImageStyle = {
	maxWidth: '100%', // 이미지의 최대 너비를 부모 요소에 맞게 조절
	width: '60px', // 이미지 너비 조절
	height: '50px', // 이미지 높이 조절
	//border: '1px solid #e4e4e4', // 얇은 테두리 추가
	marginRight: '20px', // 이미지들 간의 가로 간격
	cursor: "pointer"
};

export const handleCategory1_1Click = () => {
};
  
export const handleCategory1_2Click = () => {
		
	alert("배변/위생 항목을 클릭했습니다.");
	
};
export const handleCategory1_3Click = () => {
	
	alert("배변/위생 항목을 클릭했습니다.");
	
};

export const handleCategory2_1Click = () => {
	
	alert("고양이 용품 항목을 클릭했습니다.");
	
};
export const handleCategory2_2Click = () => {
	
	alert("고양이 배변/위생 항목을 클릭했습니다.");
	
};
export const handleCategory2_3Click = () => {
	
	alert("고양이 의상 항목을 클릭했습니다.");
	
};
export const handleCategory2_4Click = () => {
	
	alert("고양이 타워 항목을 클릭했습니다.");
	
};

  
const ImageWithDescription = ({ src, description, price, productId, companyName, isLike}) => {
	
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
	
	var leftPos = '-5px'
	var topPos = '-45px'
	
	if (window.innerWidth  <= 768)
	{
		leftPos = '-35px'
		topPos = '-48px'
	}
	
	return (
		<div className='main-center-list' /*style={{display: 'flex', flexDirection: 'column', alignItems: 'left', textAlign: 'left', marginTop: '100px', height: '350px', width:'250px',}}*/>
			<div>
				<img className='each-img' onClick={handleDetailProductClick} src={src} alt={"불러오기 실패"} />
				<HeartControl
						customStyle={{ position: 'relative', left: leftPos, top: topPos, }}
						productId={productId}
						propIsLike={isLike}/>
			</div>
			<div>
				<div style={{ /*display: 'flex',*/ height: '40px' }}>
					<span className='company-name-style'  /*style={companyNameStyle}*/ onClick={handleDetailProductClick}> {companyName}</span>
				</div>
				
				<span className='description-style' /*style={descriptionStyle}*/ onClick={handleDetailProductClick}> {description}</span><br/><br/>
				<span className='price-style' /*style={priceStyle}*/ onClick={handleDetailProductClick}> {price.toLocaleString()}원</span>
				
			</div>

		</div>
	);
};

const MainPageToMobile = () => {
	const searchParams = new URLSearchParams(window.location.search);
	
	const [imagesWithDescriptions, setMainList] = useState([]);
	const [curPage, setCurPage] = useState(1); // 현재 페이지
	const [totalPage, setTotalPage] = useState(1); // 총 페이지
	const navigate = useNavigate();
	
	useEffect(() => {
		var page = parseInt(searchParams.get('page'), 10);
		
		if (isNaN(page))
		{
			page = 1;
		}
		
		fetchMainList(page);
		
		return () => {
			//console.log('컴포넌트가 화면에서 사라짐');
		};
	}, []);
	
	const RefreshMainPage = (reqCurPage) => {
		const queryString = `?page=${reqCurPage}`;
		window.location.href = `/${queryString}`;
	}

	const fetchMainList = (reqCurPage) => {
		
		const ReqMainPage = {
			CurPage: reqCurPage,
			UserId: localStorage.getItem(TokenGetter.UserID),
			AccessToken: localStorage.getItem(TokenGetter.AccessToken),
			RefreshToken: localStorage.getItem(TokenGetter.RefreshToken),
		  };
		  
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.post('http://localhost:8001/main', ReqMainPage);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.post('/api/main', ReqMainPage);
		}
		
		httpReq.then(response => {
			
			setTotalPage(response.data.TotalPageCount)
			setCurPage(reqCurPage)
			
			localStorage.setItem(TokenGetter.UserID, response.data.UserId);
			localStorage.setItem(TokenGetter.AccessToken, response.data.AccessToken);
			localStorage.setItem(TokenGetter.RefreshToken, response.data.RefreshToken);
			
			if(response.data.ProductImgInfo === null)
			{
				setMainList([]);
			}
			else
			{
				const sortedItems = [...response.data.ProductImgInfo].sort((a, b) => a.Description - b.Description);
				setMainList(sortedItems);
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
		<div /*style={containerStyle}*/>

			{/*위*/}
			<FixFrame
			curPath={"./"}
			isLogin={localStorage.getItem(TokenGetter.AccessToken) === "" ? false : true}/>
			{/*///////////////////////////////////////////////*/}
			
			{/*왼쪽*/}
			<div style={{padding: '20px', flex: 1,textAlign: 'center',flexBasis: '20%',}}>
				{/*강아지 카테고리*/}
				<CategoryChart/>
			</div>
			{/*///////////////////////////////////////////////*/}
				
			{/*중앙*/}
			<div className='bottom-center-list' /*style={bottomCenterListStyle}*/>
				{imagesWithDescriptions.length > 0 ? (
					imagesWithDescriptions.map((imageInfo, index) => (
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
						<p>No images available</p>
  					)}
			</div>
				
					<Pagination
						currentPage={curPage}
						totalPages={totalPage}
						onPageChange={RefreshMainPage}
					/>
				
				
			{/*///////////////////////////////////////////////*/}
				
			{/*오른쪽*/}
			<div style={bottomRightPaneStyle}>
				
			</div>
			{/*///////////////////////////////////////////////*/}
				

		
			
		</div>
		);
	}
	
export default MainPageToMobile;

