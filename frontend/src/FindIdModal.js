import React, { useState, useEffect  } from 'react';
import "./css/MobileAuthModal.css";
import { ErrorFunc, TokenGetter } from './App.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const bomileAuthStyle = {
    backgroundColor: '#5858FA',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  	
let timerInterval; // 타이머를 전역 변수로 선언

function FindIdModal(props) {
	const navigate = useNavigate();
	
	const { isOpen, onClose } = props;
	const [inputEmail, setInputEmail] = useState('');
	const [inputEmailAuth, setInputEmailAuth] = useState('');

	const [authTimeText, setAuthTimeText] = useState('');

	const [isAuthTimeVisible, setIsAuthTimeVisible] = useState(false);
	const [isAuthSuccess, setIsAuthSuccess] = useState(false);
	const [findedId, setFindedId] = useState('');

	function isInputValid(value) {
		return /^[0-9]*$/.test(value);
	  }

	const handleInputEmailChange1 = (e) => {
		const value = e.target.value;

		/*
		if (value.length > 3) {
			return;
		}

		if(isInputValid(value) === false)
		{
			alert('숫자만 입력할 수 있습니다.');
			return;
		}
		*/

		setInputEmail(value);
	  };
	  
	const handleInputAuthNumChange = (e) => {
		const value = e.target.value;

		if(isInputValid(value) === false)
		{
			alert('숫자만 입력할 수 있습니다.');
			return;
		}

		setInputEmailAuth(value);
	  };

	const ClickAuthTry = (e) => { 
		e.preventDefault(); // 기본 동작 중지

		const ReqFindId = {
			VerifyNum: parseInt(inputEmailAuth, 10),
			Email: inputEmail
		  };

		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.post('http://localhost:8001/findId', ReqFindId);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.post('/api/findId', ReqFindId);
		}
		
		httpReq.then(response => {
				alert("인증에 성공하였습니다.")
				setIsAuthSuccess(true)
				setFindedId(response.data.UserId)
				
				// 기존 타이머가 있다면 중지
				if (timerInterval) {
					clearInterval(timerInterval);
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


	const handleMobileAuthClick = (e) => {
		e.preventDefault(); // 기본 동작 중지

		if (inputEmail === "")
		{
			alert("이메일을 입력해 주세요.")
			return
		}
		
		//alert("이메일 인증을 요청하였습니다.");

		// 기존 타이머가 있다면 중지
		if (timerInterval) {
			clearInterval(timerInterval);
		}

		// 시간이 흐르는 텍스트 업데이트
		let remainingTime = 180; // 3분
		timerInterval = setInterval(() => {
		  if (remainingTime <= 0) {
			clearInterval(timerInterval); // 타이머 중지
			setIsAuthTimeVisible(false); // 텍스트 숨기기
		  } else {
			const minutes = Math.floor(remainingTime / 60);
			const seconds = remainingTime % 60;

			 // 1자리 수일 경우 앞에 0 추가
			 const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
			 const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
			 setAuthTimeText(`${formattedMinutes}:${formattedSeconds}`);
			remainingTime -= 1;
		  }
		}, 1000);

		setIsAuthTimeVisible(true)

		
		const ReqAuthFindIdFromEmail = {
			Email: inputEmail
		  };

		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.post('http://localhost:8001/authFindIdFromEmail', ReqAuthFindIdFromEmail);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.post('/api/authFindIdFromEmail', ReqAuthFindIdFromEmail);
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
		
	};


	useEffect(() => {

		clearInterval(timerInterval);
		return () => {
		  clearInterval(timerInterval); // 컴포넌트 언마운트 시 타이머 정리
		};
	  }, []);

	return (
	  <div className={`modal ${isOpen ? 'open' : ''}`}>
		<div className="modal-content">
		  <span className="close" onClick={onClose}>&times;</span>
		  
		   	<div>
		  		<h3>아이디 찾기</h3>
			</div>
			{!isAuthSuccess&&<input
			type="text"
			value={inputEmail}
			onChange={handleInputEmailChange1}
			className="phonenum-box1"
			style={{marginRight: '10px', marginTop: '30px', }}
			placeholder="test@example.com"
			maxLength={40}
			/>}
		
			{!isAuthSuccess&&<button style={bomileAuthStyle} onClick={handleMobileAuthClick}>
      			인증메일 전송
    		</button>}

			{isAuthTimeVisible &&
			<div>
				{!isAuthSuccess&&<span style={{marginRight: '10px', marginTop: '30px', }}>인증번호 입력</span>}
				{!isAuthSuccess&&<input
				maxLength={6}
				type="text"
				value={inputEmailAuth}
				onChange={handleInputAuthNumChange}
				className="phonenum-box2"
				style={{width: '100px', marginRight: '10px', marginTop: '30px', }}
				/>}

				{!isAuthSuccess&&<button style={bomileAuthStyle} onClick={ClickAuthTry}>
      				인증 확인
    			</button>}


				{!isAuthSuccess && <p style={{color: 'red',}}>남은 시간: {authTimeText}</p>}
				{isAuthSuccess && (
				<div>
					<span>ID는 </span>
				    <h1 style={{ color: 'blue', fontWeight: 'bold', display: 'inline' }}>{findedId}</h1>
				    <span> 입니다. </span>
				</div>
				)}
				

			</div>}
		


		</div>
	  </div>
	);
  }

export default FindIdModal;