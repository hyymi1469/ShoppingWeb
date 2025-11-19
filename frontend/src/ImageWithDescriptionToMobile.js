import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { ErrorFunc, TokenGetter } from './App.js';
import { useNavigate } from 'react-router-dom';
import CategoryChart from './CategoryChart';
import FixFrame from './FixFrame.js';
import Pagination from './Pagination.js';
import HeartControl from './HeartControl.js';
import './mediaScreen.css';




const companyNameStyle = {
	color: '#797979',
	fontSize: '15px',
	whiteSpace: 'pre-line',
	cursor: 'pointer',
	fontWeight: 'bold',
	marginTop:'-50px',
}

const descriptionStyle = {
	textAlign: "left",
	marginTop: '5px',
}

const priceStyle = {
	marginTop: '0px',
	color: '#494949',
	fontSize: '15px',
	fontWeight: 'bold',
	marginTop: '-30px',
}

export const ImageWithDescriptionToMobile = ({ src, description, price, productId, companyName, isLike}) => {
	
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
	
	return (
		<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '100px', height: '250px', width:'165px',}}>
			<div>
				<img style={{width:"150px",height: "190px", marginLeft:"0px", /*border: '1px solid #ccc',*/}} onClick={handleDetailProductClick} src={src} alt={"불러오기 실패"} />
				<HeartControl
						customStyle={{ position: 'relative', left: "-35px", top: "-48px", }}
						productId={productId}
						propIsLike={isLike}/>
			</div>
			<div>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', }}>
					<span style={companyNameStyle} onClick={handleDetailProductClick}> {companyName}</span>
					<span style={descriptionStyle} onClick={handleDetailProductClick}> {description}</span><br/><br/>
					<span style={priceStyle} onClick={handleDetailProductClick}> {price.toLocaleString()}원</span>
				</div>
				
				
				
				
				
				
			</div>

		</div>
	);
};

export default ImageWithDescriptionToMobile;

