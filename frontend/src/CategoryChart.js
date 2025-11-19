import React, { useState, useEffect  } from 'react';
import { ErrorFunc, ProductType, ProductTypeDetail, TokenGetter } from './App.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './mediaScreen.css';

export const HighLightEnum = {
	RED: 'red',
	GREEN: 'green',
	BLUE: 'blue',
  };

const categoryShowdownParDivStyle = {
	top: '100%',
	left: '0',
	display: 'block',
	backgroundColor: 'white',
	border: '2px solid #ccc',
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
	alignItems: 'center', // 아이템들을 왼쪽에 정렬합니다.
	cursor: 'pointer', // 클릭 모양 커서 설정
	//border: '1px solid #ccc',
	
};

const CategoryChart = ({selectedCategory, selectedChatNum}) => {
	const [isDropdownOpen1, setDropdown1Open] = useState(false);
	const [isDropdownOpen2, setDropdown2Open] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		
		if (selectedChatNum === 1)
		{
			setDropdown1Open(true);
		}
		return () => {
			//console.log('컴포넌트가 화면에서 사라짐');
		};
	}, []);

	const getCategoryStyle = (category) => {
		// selectedCategory와 현재 카테고리가 일치하면 볼드체 스타일을 반환
		return selectedCategory === category ? { ...categoryStyle, fontWeight: 'bolder', textDecoration: 'underline' } : categoryStyle;
	};

	const toggleDropdown1 = () => {
		setDropdown1Open(!isDropdownOpen1);
	};
	const toggleDropdown2 = () => {
		setDropdown2Open(!isDropdownOpen2);
	};

	const ClickProductType = (productType, detailType, componentStr) => {
		alert("시니어 항목을 클릭했습니다.");
		/*
		const queryString = `?page=${1}
		&product_type=${productType}
		&detail_type=${detailType}`;
		
		if (window.innerWidth  <= 768)
		{
			componentStr += "ToMobile";
		}
		

		window.location.href = `${componentStr}${queryString}`;
		*/
	};
	  
	const handleCategory1_2Click = () => {
			
		alert("배변/위생 항목을 클릭했습니다.");
		
	};
	const handleCategory1_3Click = () => {
		
		alert("배변/위생 항목을 클릭했습니다.");
		
	};
	const handleCategory2_1Click = () => {
		
		alert("고양이 용품 항목을 클릭했습니다.");
		
	};
	const handleCategory2_2Click = () => {
		
		alert("고양이 배변/위생 항목을 클릭했습니다.");
		
	};
	const handleCategory2_3Click = () => {
		
		alert("고양이 의상 항목을 클릭했습니다.");
		
	};
	const handleCategory2_4Click = () => {
		
		alert("고양이 타워 항목을 클릭했습니다.");
		
	};
	

	return (
		<div className='chart-list'>
			<div style={categoryShowdownParDivStyle}>
				<button style={categoryShowdownDtnStyle} onClick={toggleDropdown1}>
					<span className='category-main-style' /*style={categoryMainTextStyle}*/>강아지 사료</span>
	  				<span style={categorySubTextStyle}>dog food</span>
					{!isDropdownOpen1 &&(<span style={categoryMarkTextStyle}>╋</span>)}
					{isDropdownOpen1 &&(<span style={categoryMarkTextStyle}>━</span>)}
				</button>
				{isDropdownOpen1 && (
					<div style={categoryShowdownDivStyle}>
					  <ul style={categoryShowdownUlStyle}>

						<li style={getCategoryStyle('시니어')} onClick={() => ClickProductType(
							ProductType.ProductType_DogFood, ProductTypeDetail.ProductTypeDetail_Senior, "/Category1of1Page")}>시니어</li>
						<li style={getCategoryStyle('퍼피')} onClick={handleCategory1_2Click}>퍼피</li>
						<li style={getCategoryStyle('전연령')} onClick={handleCategory1_3Click}>전연령</li>

					  </ul>
					</div>
				)}
			</div>
			
			<div style={categoryShowdownParDivStyle}>
				<button style={categoryShowdownDtnStyle} onClick={toggleDropdown2}>
					<span className='category-main-style' /*style={categoryMainTextStyle}*/>간식</span>
	  				<span style={categorySubTextStyle}>Cat</span>
					{!isDropdownOpen2 &&(<span style={categoryMarkTextStyle}>╋</span>)}
					{isDropdownOpen2 &&(<span style={categoryMarkTextStyle}>━</span>)}
				</button>
				{isDropdownOpen2 && (
					<div style={categoryShowdownDivStyle}>
					  <ul style={categoryShowdownUlStyle}>
						
					  	<li style={getCategoryStyle('습식간식')} onClick={handleCategory2_1Click}>습식간식</li>
					  	<li style={getCategoryStyle('건식간식')} onClick={handleCategory2_2Click}>건식간식</li>
					  	<li style={getCategoryStyle('간식샘플')} onClick={handleCategory2_3Click}>간식샘플</li>
					  	<li style={getCategoryStyle('신선식품/음료')} onClick={handleCategory2_4Click}>신선식품/음료</li>

					  </ul>
					</div>
				)}
			</div>

			
		</div>
		
		);
	}
	
export default CategoryChart;

