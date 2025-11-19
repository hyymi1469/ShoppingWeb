import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { ErrorFunc, TokenGetter } from './App.js';
import { useNavigate, useLocation } from 'react-router-dom';
import CategoryChart from './CategoryChart';
import FixFrame from './FixFrame.js';
import Pagination from './Pagination.js';
import HeartControl from './HeartControl.js';

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
	padding: '20px',
	flex: 1,
	//borderRight: '1px solid #ccc',
	textAlign: 'center',
	flexBasis: '20%', // 가로로 4개의 이미지를 표시하려면 25%로 설정
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

export const bottomCenterCheckBoxPaneStyle = {
	display: 'flex',
	//alignItems: 'center', // 수직 가운데 정렬
	//justifyContent: 'center', // 가로 가운데 정렬 추가
	flexDirection: 'row', // 가로로 나열
	padding: '10px',
	flexWrap: 'wrap', // 요소가 공간 부족 시 다음 줄로 내려감
	flexBasis: '60%', // 가로로 4개의 이미지를 표시하려면 25%로 설정

	//borderBottom: '3px solid #ccc', // 언더바 스타일: '1px solid #e4e4e4', // 얇은 테두리 추가 임시 ymi
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

const getHeartMargin = (text) => {
	// 조절하고자 하는 간격을 계산하는 로직을 작성
	// 예를 들어, 글자 수에 따라 간격을 결정
	let margin = 0;
  
	margin = 100 - text.length
	

	return `${margin}px`;
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
	
	var leftPos = '-7px'
	var topPos = '-70px'
	
	if (window.innerWidth  <= 768)
	{
		leftPos = '-45px'
		topPos = '-67px'
	}
	
	return (
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', textAlign: 'left', marginTop: '100px', height: '350px',}}>
			<div>
				<img style={imageStyle} onClick={handleDetailProductClick} src={src} alt={"불러오기 실패"} />
			</div>
			<div>
				<div style={{ /*display: 'flex',*/ alignItems: 'center', height: '40px' }}>
					<span style={companyNameStyle} onClick={handleDetailProductClick}> {companyName}</span>
					<HeartControl
						customStyle={{ position: 'relative', left: leftPos, top: topPos }}
						productId={productId}
						propIsLike={isLike}/>
					
				</div>
				
				<span style={descriptionStyle} onClick={handleDetailProductClick}> {description}</span><br/><br/>
				<span style={priceStyle} onClick={handleDetailProductClick}> {price.toLocaleString()}원</span>
				
				
				
			</div>

		</div>
	);
};

const SearchPage = () => {
	
	const searchParams = new URLSearchParams(window.location.search);

	const [imagesWithDescriptions, setMainList] = useState([]);
	const [curPage, setCurPage] = useState(1); // 현재 페이지
	const [totalPage, setTotalPage] = useState(1); // 총 페이지
	const [mainWord, setMainWord] = useState(''); // 총 페이지
	const navigate = useNavigate();

	useEffect(() => {
				
		const word = searchParams.get('word');
		const page = parseInt(searchParams.get('page'), 10);
		
		fetchSearchList(page, word);
		
		return () => {
			
		};
	}, []);
	
	const RefreshSearchPage = (reqCurPage, searchWord) => {
		const queryString = `?word=${encodeURIComponent(searchWord)}&page=${reqCurPage}`;
		window.location.href = `/SearchPage${queryString}`;
	}
	
	const fetchSearchList = (reqCurPage, searchWord) => {
		
		const userId = localStorage.getItem(TokenGetter.UserID)
		
		const ReqSearch = {
			params: {
			page: reqCurPage,
			user_id: userId,
			word:searchWord,
			},
		  };
		  
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.get(`http://localhost:8001/searchPage`, ReqSearch);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.get(`/api/searchPage`, ReqSearch);
		}
		
		httpReq.then(response => {
			
			setTotalPage(response.data.TotalPageCount)
			setCurPage(reqCurPage)
			setMainWord(searchWord)
			
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
		<div style={containerStyle}>

			{/*위*/}
			<FixFrame
			curPath={"./../../"}
			isLogin={localStorage.getItem(TokenGetter.AccessToken) === "" ? false : true}
			searchWord={mainWord}/>
			{/*///////////////////////////////////////////////*/}
			
			{/*아래*/}
			<div style={bottomPaneContainerStyle}>
			{/*///////////////////////////////////////////////*/}

				{/*왼쪽*/}
				<div style={bottomLeftPaneStyle}>
					{/*강아지 카테고리*/}
					<CategoryChart/>					
				</div>
				{/*///////////////////////////////////////////////*/}
				
				{/*중앙*/}
				<div style={bottomCenterPaneStyle}>
					<div style={bottomCenterListStyle}>
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
							searchWord={mainWord}
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
	
export default SearchPage;

