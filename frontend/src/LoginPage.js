import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { ErrorFunc, TokenGetter } from './App.js';
import { useNavigate } from 'react-router-dom';
import FindIdModal from './FindIdModal'; // 모달 컴포넌트 import
import FindPasswordModal from './FindPasswordModal'; // 모달 컴포넌트 import



const mainLogoImageStyle = {
	maxWidth: '100%', // 이미지의 최대 너비를 부모 요소에 맞게 조절
	//width: '240px', // 이미지 너비 조절
	height: '170px', // 이미지 높이 조절
	//border: '1px solid #e4e4e4', // 얇은 테두리 추가
	//marginRight: '20px', // 이미지들 간의 가로 간격
	cursor: "pointer"
	};
	
const textStyle = {
	color: '#6E6E6E',
};

const LoginPage = () => {
	const navigate = useNavigate();
	
	const [isFindIdModalOpen, setIsFindIdModalOpen] = useState(false);
	const [isFindPasswordModalOpen, setIsFindPasswordModalOpen] = useState(false);
	const [loginId, setloginId] = useState('');
	const [loginPassWord, setloginPassWord] = useState('');
	
	const handleInputIdChange = (e) => {
		setloginId(e.target.value)
	  };
	  
	const handleInputPassWordChange = (e) => {
		setloginPassWord(e.target.value)
	  };

	const OpenFindIdModal = () => {
		setIsFindIdModalOpen(true);
	};
	  
	const CloseFindIdModal = () => {
		setIsFindIdModalOpen(false);
	};
	
	const OpenFindPasswordModal = () => {
		setIsFindPasswordModalOpen(true);
	};
	  
	const CloseFindPasswordModal = () => {
		setIsFindPasswordModalOpen(false);
	};
  
	const handleLogoClick = () => {
		navigate('/');
	};
	
	const onclickSignUpClick = () => {
		navigate('/SignUpPage');
	};

	const FindIdClick = () => {
		OpenFindIdModal()
	};
	
	const FindPasswordClick = () => {
		OpenFindPasswordModal()
	};
	
	const onclickTryLoginClick = (e) => {
		
		e.preventDefault(); // 기본 동작 중지
		
		const reqData = {
			LoginId: loginId,
			LoginPassword: loginPassWord,
		};
		
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.post('http://localhost:8001/tryLogin', reqData);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.post('/api/tryLogin', reqData);
		}
		
		httpReq.then(response => {
				// 액세스 토큰과 리프레시 토큰을 받아서 로컬 스토리지에 저장
				localStorage.setItem(TokenGetter.UserID, loginId);
				localStorage.setItem(TokenGetter.AccessToken, response.data.AccessToken);
				localStorage.setItem(TokenGetter.RefreshToken, response.data.RefreshToken);
				localStorage.setItem(TokenGetter.UserCompanyId, response.data.UserCompanyId);
				navigate('/');
			
			})
			.catch(error => {
				
				ErrorFunc(error.request.status)
				return;
			});
	};
	
	

	return (
<div>

		
		<div class="container-login100">
		<div class="wrap-login100 p-t-50 p-b-90">
			<img style={mainLogoImageStyle} onClick={handleLogoClick} src="img/logo.png" alt={"불러오기 실패"} />
		<form class="login100-form validate-form flex-sb flex-w">
		
		<span style={textStyle}>아이디</span>
		<div class="wrap-input100 validate-input m-b-16">
			<input class="input100" type="text" placeholder="영문 4~16글자" onChange={handleInputIdChange}/>
		</div>

		<span style={textStyle}>비밀번호</span>
		<div class="wrap-input100 validate-input m-b-16">
			<input class="input100" type="password" placeholder="영문, 숫자를 포함한 8~16글자" onChange={handleInputPassWordChange}/>
		</div>

		{isFindIdModalOpen && (
			<FindIdModal isOpen={isFindIdModalOpen} onClose={CloseFindIdModal}></FindIdModal>
	 	)}
		
		{isFindPasswordModalOpen && (
			<FindPasswordModal isOpen={isFindPasswordModalOpen} onClose={CloseFindPasswordModal}></FindPasswordModal>
	 	)}
		


		<div class="flex-sb-m w-full p-t-3 p-b-24">
			<div>

			</div>
		</div>
		<div class="container-login100-form-btn m-t-17">
			<button class="login100-form-btn" onClick={onclickTryLoginClick}>
				로그인
			</button>
		</div>
		
		<div style={{marginTop: '20px'}}>
			<span style={{marginLeft: '0px', color: 'grey', cursor: 'pointer'}} onClick={onclickSignUpClick}>
	 				회원가입
			</span>
			<span style={{marginLeft: '50px', color: 'grey', cursor: 'pointer'}} onClick={FindIdClick}>
	 				아이디 찾기
			</span>
			<span style={{marginLeft: '50px', color: 'grey', cursor: 'pointer'}} onClick={FindPasswordClick}>
	 				비밀번호 찾기
			</span>
		</div>
		</form>
		</div>
		</div>
		
		<div id="dropDownSelect1"></div>



</div>
	);
}



export default LoginPage;
