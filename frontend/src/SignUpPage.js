import React, { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileAuthModal from './MobileAuthModal'; // 모달 컴포넌트 import
import "./css/signupPage.css";
import "./css/signupPageUtil.css";
import axios from 'axios';
import { ErrorFunc, TokenGetter } from './App.js';
import "./mediaScreen.css";

const mainLogoImageStyle = {
	maxWidth: '100%', // 이미지의 최대 너비를 부모 요소에 맞게 조절
	//width: '240px', // 이미지 너비 조절
	height: '170px', // 이미지 높이 조절
	//border: '1px solid #e4e4e4', // 얇은 테두리 추가
	//marginRight: '20px', // 이미지들 간의 가로 간격
	cursor: "pointer",
	
    };
	
const textStyle = {
	color: '#6E6E6E',
};

const SignUpPage = () => {
	const navigate = useNavigate();
	const [isMobileAuthModalOpen, setIsMobileAuthModalOpen] = useState(false);
	const [isAuthCompete, setIsAuthCompete] = useState(false);

	const [Id, setId] = useState('');
	const [password, setPassword] = useState('');
	const [passwordVerify, setPasswordVerify] = useState('');
	const [eMail, setEmail] = useState('');

	const openMobileAuthModal = (e) => {
		e.preventDefault(); // 기본 동작 중지
		setIsMobileAuthModalOpen(true);
	};

	const CompleteAuthModal = (eMail) => {
		setIsMobileAuthModalOpen(false);
		setIsAuthCompete(true);
		setEmail(eMail)
	};
      
	const closeMobileAuthModal = () => {
		setIsMobileAuthModalOpen(false);
	};
  
	const handleLogoClick = () => {
		navigate('/');
	};

	const ClickSignUp = (e) => {
		e.preventDefault(); // 기본 동작 중지

		if (Id === "")
		{
			alert("아이디를 입력해 주세요.")
			return
		}

		if (password === "")
		{
			alert("비밀번호를 입력해 주세요.")
			return
		}
		
		if (password !== passwordVerify)
		{
			alert("비밀번호와 비밀번호 확인이 다릅니다.")
			return
		}

		const ReqSignUp = {
			SignId: Id,
			SignPassword: password,
			Email: eMail,
		  };

		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.post('http://localhost:8001/signUp', ReqSignUp);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.post('/api/signUp', ReqSignUp);
		}
		
		httpReq.then(response => {
				alert("회원가입이 완료되었습니다.")
				navigate('/');
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

	
	const OnchangeID = (e) => {
		e.preventDefault(); // 기본 동작 중지
		const value = e.target.value;
		setId(value);
	};

	const OnchangePassword = (e) => {
		e.preventDefault(); // 기본 동작 중지
		const value = e.target.value;
		setPassword(value);
	};

	const OnchangePasswordVerify = (e) => {
		e.preventDefault(); // 기본 동작 중지
		const value = e.target.value;
		setPasswordVerify(value);
	};
	  
	
	return (
<div>

		<div class="container-login100">
		<div class="wrap-login100 p-t-50 p-b-90">
			<img style={mainLogoImageStyle} onClick={handleLogoClick} src="img/logo.png" alt={"불러오기 실패"} />
		<form class="login100-form validate-form flex-sb flex-w">
		
		<span style={textStyle}>아이디</span>
		<div class="wrap-input100 validate-input m-b-16">
			<input class="input100" type="text" placeholder="영문 4~16글자" onChange={OnchangeID}/>
		</div>

		<span style={textStyle}>비밀번호</span>
		<div class="wrap-input100 validate-input m-b-16">
			<input class="input100" type="password" placeholder="영문, 숫자를 포함한 8~16글자" onChange={OnchangePassword}/>
		</div>

		<span style={textStyle}>비밀번호 확인</span>
		<div class="wrap-input100 validate-input m-b-16" >
			<input class="input100" type="password" placeholder="비밀번호 확인" onChange={OnchangePasswordVerify}/>
		</div>

		{!isAuthCompete && (
		<button className="phone-auth-btn" onClick={openMobileAuthModal}>
     		이메일 인증
		</button>)}
		{isAuthCompete && (
		<span style={{fontSize: '14px', color: 'blue',}}>인증이 완료되었습니다.</span>
		)}

		{/* 모달을 열고 닫기 위한 조건부 렌더링 */}
		{isMobileAuthModalOpen && (
			<MobileAuthModal isOpen={isMobileAuthModalOpen} onClose={closeMobileAuthModal} completeAuthFunc={CompleteAuthModal}></MobileAuthModal>
     	)}
		


		<div class="flex-sb-m w-full p-t-3 p-b-24">
			<div>

			</div>
		</div>
		<div class="container-login100-form-btn m-t-17">
			<button class="login100-form-btn" onClick={ClickSignUp} >
				회원가입
			</button>
		</div>
		</form>
		</div>
		</div>
		
		<div id="dropDownSelect1"></div>



</div>
	);
}



export default SignUpPage;
