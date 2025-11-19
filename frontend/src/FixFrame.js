import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { ErrorFunc, TokenGetter } from './App.js';
import { useNavigate, Link  } from 'react-router-dom';
import './mediaScreen.css';

const categoryShowdownParDivStyle = {
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

const categoryShowdownDtnStyle = {
	backgroundColor: 'white',
	border: 'none',
	padding: '10px',
	cursor: 'pointer',
	width: '100%', // 버튼의 가로 범위를 100%로 설정
};

const categoryMainTextStyle = {

	color: 'black',
	 fontSize: '16px',
	 marginRight: "20px",
}

const categorySubTextStyle = {

	color: '#A4A4A4',
	fontSize: '15px',
}


const categoryMarkTextStyle = {

	color: 'black',
	fontSize: '15px',
	float: 'right', // 맨 오른쪽으로 붙임
}

const categoryShowdownDivStyle = {
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

const categoryShowdownUlStyle = {
	listStyleType: 'none',
	 padding: '0',
	  margin: '0'
};

const categoryStyle = {
	color: '#6E6E6E',
	marginRight: '10px', // h1과 input 사이 간격을 조절
	marginBottom: '15px', // h1과 input 사이 간격을 조절
	alignItems: 'center', // 수직 가운데 정렬
	cursor: 'pointer', // 클릭 모양 커서 설정
};

const userMenuStyle = {
    //backgroundColor: '#afafaf',
    color: 'white',
    padding: '4px',
    textAlign: 'center',
    //height: '270px',
};

const mainLogoImageStyle = {
    maxWidth: '100%', // 이미지의 최대 너비를 부모 요소에 맞게 조절
    //width: '240px', // 이미지 너비 조절
    height: '170px', // 이미지 높이 조절
    //border: '1px solid #e4e4e4', // 얇은 테두리 추가
    //marginRight: '20px', // 이미지들 간의 가로 간격
    cursor: "pointer"
};

const SearchInputStyle = {
	fontSize: '16px',
	border: 'none', // 테두리 없애기
	outline: 'none',
	padding: '6px',
	borderBottom: '2px solid black', // 언더바 스타일
	borderRadius: '0', // 언더바를 둥글게 하지 않도록 설정
	width: '340px', // 검색 인풋 창의 너비를 조절합니다
};

const searchImageStyle = {
	maxWidth: '100%', // 이미지의 최대 너비를 부모 요소에 맞게 조절
	width: '25px', // 이미지 너비 조절
	height: '25px', // 이미지 높이 조절
	//border: '1px solid #e4e4e4', // 얇은 테두리 추가
	marginRight: '20px', // 이미지들 간의 가로 간격
	cursor: "pointer"
};

const userInfoImageStyle = {
	maxWidth: '100%', // 이미지의 최대 너비를 부모 요소에 맞게 조절
	width: '60px', // 이미지 너비 조절
	height: '50px', // 이미지 높이 조절
	//border: '1px solid #e4e4e4', // 얇은 테두리 추가
	marginRight: '20px', // 이미지들 간의 가로 간격
	cursor: "pointer"
};

const bottomPaneContainerStyle = {
	display: 'flex',
	flex: 1,
};

const bottomLeftPaneStyle = {
	//backgroundColor: '#f0f0f0',
	padding: '20px',
	flex: 1,
	//borderRight: '1px solid #ccc',
	textAlign: 'center',
	flexBasis: '20%', // 가로로 4개의 이미지를 표시하려면 25%로 설정
};

const imageStyle = {
	maxWidth: '100%', // 이미지의 최대 너비를 부모 요소에 맞게 조절
	width: '240px', // 이미지 너비 조절
	height: '280px', // 이미지 높이 조절
	border: '1px solid #e4e4e4', // 얇은 테두리 추가
	marginRight: '20px', // 이미지들 간의 가로 간격
	cursor: "pointer"
};

const bottomCenterPaneStyle = {
	display: 'flex',
	alignItems: 'center', // 수직 가운데 정렬
	justifyContent: 'center', // 가로 가운데 정렬 추가
	flexDirection: 'row', // 가로로 나열
	padding: '20px',
	flexWrap: 'wrap', // 요소가 공간 부족 시 다음 줄로 내려감
	flexBasis: '60%', // 가로로 4개의 이미지를 표시하려면 25%로 설정
	//flex: 4,
	//textAlign: 'center',
	//flex: 6, // 가로로 더 크게
};

const descriptionStyle = {
	marginBottom: '10px', // description과 price 사이 간격 조절
	color: '#585858',
	fontSize: '16px',
	whiteSpace: 'pre-line',
	cursor: "pointer",
};


const priceStyle = {
	marginTop: '10px', // price 위 간격 조절
	color: '#151515',
	fontSize: '18px',
	cursor: "pointer"
};

const bottomRightPaneStyle = {
	backgroundColor: '#f0f0f0',
	padding: '20px',
	flex: 1,
	borderLeft: '1px solid #ccc',
	textAlign: 'center',
	flexBasis: '20%', // 가로로 4개의 이미지를 표시하려면 25%로 설정
};

const FixFrame = (props) => {

    const [searchTerm, setSearchTerm] = useState('');
	const navigate = useNavigate();
	const { curPath, isLogin, searchWord } = props;
	
	
    const handleInputSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

    const handleLogoClick = () => {
		
		//navigate('/');
		window.location.href = `/`;
			
	};

	const handleKeyPress = (event) => {
		// event.key === 'Enter' 일 때 원하는 동작 수행
		if (event.key === 'Enter') {
			handleSearch()
		  // 추가로 수행할 작업을 여기에 추가하세요.
		}
	 };

    const handleSearch = () => {
		// 검색 버튼 클릭 시 검색 로직을 여기에 추가하세요
		
		if (searchTerm === '' || searchTerm === undefined)
		{
			alert("검색어를 입력해 주세요");
			return
		}
		
		const queryString = `?word=${encodeURIComponent(searchTerm)}&page=${1}`;
		
		if (window.innerWidth  <= 768)
		{
			window.location.href = `/SearchPageToMobile${queryString}`;
		}
		else
		{
			window.location.href = `/SearchPage${queryString}`;
		}
		
		
	};

    const handleJoinClick = () => {
		navigate('/SignUpPage');
	};
	const handleLoginClick = () => {	
		navigate('/LoginPage');
	};
	const handleMyClick = () => {	
		if (isLogin === true)
		{
			if (window.innerWidth  <= 768)
			{
				navigate('/MyPageToMobile');
			}
			else
			{
				navigate('/MyPage');
			}
		}
		else
		{
			navigate('/LoginPage');
		}
	};
	const handleCartClick = () => {	
		
		if (window.innerWidth  <= 768)
		{
			navigate('/ShoppingBagPageToMobile');
		}
		else
		{
			navigate('/ShoppingBagPage');
		}
		
		 
	};
	
	const handleAdminClick = () => {	
		navigate('/AdminPage');
		 
	};
	
	const handleLogoutClick = () => {
		
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.post('http://localhost:8001/doLogout', localStorage.getItem(TokenGetter.UserID));
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.post('/api/doLogout', localStorage.getItem(TokenGetter.UserID));
		}
		
		httpReq.then(response => {
			localStorage.setItem(TokenGetter.UserID, "");
			localStorage.setItem(TokenGetter.AccessToken, "");
			localStorage.setItem(TokenGetter.RefreshToken, "");
			localStorage.setItem(TokenGetter.UserCompanyId, "");
			
			// 특정 URL로 이동
			window.location.href = '/';
			
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
	
	function handleLocalStorageChange(event) {
		if (event.key === 'yourLocalStorageKey') {
		  // 'yourLocalStorageKey'라는 특정 키에 대한 변경을 감지
		  // 원하는 동작을 여기에 추가
		  console.log(`localStorage 값이 변경되었습니다: ${event.newValue}`);
		  // 원하는 함수를 여기에서 실행
		}
	  }
	
	useEffect(() => {
		// storage 이벤트 리스너 등록
		setSearchTerm(searchWord)
		return () => {
			//console.log('컴포넌트가 화면에서 사라짐');
		};
	}, [searchWord, curPath, isLogin]);
	
	const imgLogoPath = curPath + `img/logo.png`;
	const imgSearchPath = curPath + `img/search.png`;
	const imgJoinPath = curPath + `img/join.png`;
	const imgLoginPath = curPath + `img/login.png`;
	const imgMyPath =  curPath + `img/my.png`;
	const imgCartPath = curPath +`img/cart.png`;
	const imgLogoutPath = curPath +`img/logout.png`;
	const imgAdminPath = curPath +`img/admin.png`;
	
	const isAdmin = parseInt(localStorage.getItem(TokenGetter.UserCompanyId), 10);
	
	return (
		<div>
			<div style={userMenuStyle}>
				<img className='main-logo-image-style' /*style={mainLogoImageStyle}*/ onClick={handleLogoClick} src={imgLogoPath} alt={"불러오기 실패"} />

			{/*검색어 창*/}
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
				<input
					type="text"
					placeholder=""
					value={searchTerm}
					className='search-input-style'
					/*style={SearchInputStyle}*/
					onChange={handleInputSearchChange}
					onKeyDown={handleKeyPress}
				/>

				<img style={searchImageStyle} onClick={handleSearch} src={imgSearchPath} alt={"불러오기 실패"} />

			</div>

		
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
				{(isLogin && isAdmin !== 0) && <img className='user-info-style' /*style={userInfoImageStyle}*/ onClick={handleAdminClick} src={imgAdminPath} alt={"불러오기 실패"} />}
				{!isLogin && <img className='user-info-style' /*style={userInfoImageStyle}*/ onClick={handleJoinClick} src={imgJoinPath} alt={"불러오기 실패"} />}
				{!isLogin && <img className='user-info-style' /*style={userInfoImageStyle}*/ onClick={handleLoginClick} src={imgLoginPath} alt={"불러오기 실패"} />}
				<img className='user-info-style'  /*style={userInfoImageStyle}*/ onClick={handleMyClick} src={imgMyPath} alt={"불러오기 실패"} />
				<img className='user-info-style'  /*style={userInfoImageStyle}*/ onClick={handleCartClick} src={imgCartPath} alt={"불러오기 실패"} />
				{isLogin && <img className='user-info-style' /*style={userInfoImageStyle}*/ onClick={handleLogoutClick} src={imgLogoutPath} alt={"불러오기 실패"} />}
			</div>
				
			</div>
			
		</div>
		
		);
	}
	
export default FixFrame;

