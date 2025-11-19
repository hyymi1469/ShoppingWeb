import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorFunc, TokenGetter } from './App.js';
import axios from 'axios';
import "./HeartControl.css";

const HeartControl = (props) => {
	const { customStyle, productId, propIsLike } = props;
	const [isLike, setIsLike] = useState(false);
	
	
	const navigate = useNavigate();
	
	const handleLikeHeart = () => {
		const accessToken = localStorage.getItem(TokenGetter.AccessToken)
		const refreshToken = localStorage.getItem(TokenGetter.RefreshToken)
		if (accessToken === "" || refreshToken === "")
		{
			alert("로그인 후 이용 가능합니다.");
			navigate('/LoginPage');
		
			return
		}
		
		const userId = localStorage.getItem(TokenGetter.UserID)
		const ReqChangeHeart = {
			LoginId: userId,
			AccessToken: accessToken,
			RefreshToken: refreshToken,
			ProductId: productId
		  };
		
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.post('http://localhost:8001/changeHeart', ReqChangeHeart);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.post('/api/changeHeart', ReqChangeHeart);
		}
		
		httpReq.then(response => {
			
				localStorage.setItem(TokenGetter.AccessToken, response.data.AccessToken);
				localStorage.setItem(TokenGetter.RefreshToken, response.data.RefreshToken);
				
				setIsLike(response.data.IsLike);
		
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
	
	useEffect(() => {
		setIsLike(propIsLike)

		return () => {
			//console.log('컴포넌트가 화면에서 사라짐');
		};
	}, [propIsLike]);

	return (
		<div >
			{!isLike && (<span onClick={handleLikeHeart} style={customStyle} className="span-heart-none" ></span>)}
			{isLike && (<span onClick={handleLikeHeart} style={customStyle} className="span-heart-fill" ></span>)}
		</div>
	);
};

export default HeartControl;