import React, { useState, useEffect  } from 'react';
import "./css/ReviewModal.css";
import { ErrorFunc, TokenGetter } from './App.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const bomileAuthStyle = {
	marginTop: '30px',
	backgroundColor: '#5858FA',
	color: 'white',
	border: 'none',
	padding: '10px 20px',
	borderRadius: '5px',
	cursor: 'pointer',
  };

let timerInterval; // 타이머를 전역 변수로 선언

function ReviewModal(props) {
	const navigate = useNavigate();
	
	const { isOpen, onClose, productId, orderSerial, optionId, FetchMyInfo} = props;
	const [reviewMsg, setReviewMsg] = useState('');
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleInputReviewMsg = (e) => {
		const value = e.target.value;
		setReviewMsg(value);
	};
	
	function HandleFilesChange(e) {
		const files = e.target.files;

		var totalSize = 0;
		 // 각 파일의 크기 체크 (20MB 이상인 경우)
		for (let i = 0; i < files.length; i++) {
			totalSize += files[i].size
		}

		// 파일 크기 체크 (25MB 이상인 경우)
		if (totalSize > 25 * 1024 * 1024) {
			alert('파일 크기가 25MB를 초과할 수 없습니다.');
			return;
		}

		if (files.length > 4) {
		  alert('최대 4개의 파일만 선택할 수 있습니다.');
		  e.target.value = ''; // 선택된 파일 초기화
		  return;
		}
		
		setSelectedFiles(files);
	}
	
	const ClickFileUpload = async () => {
		
		if (reviewMsg.length < 5)
		{
			alert("리뷰 내용은 5글자 이상 작성 부탁드립니다 :)");
			return;
		}
		
		if (rating === null)
		{
			alert("별점을 주세요!");
			return;
		}
		
		const formData = new FormData();
	
		for (let i = 0; i < selectedFiles.length; i++) {
		  formData.append('files', selectedFiles[i]);
		}
		
		formData.append('reviewMsg', reviewMsg);
		formData.append('rating', rating);
		formData.append('productId', productId);
		formData.append('userId', localStorage.getItem(TokenGetter.UserID));
		formData.append('accessToken', localStorage.getItem(TokenGetter.AccessToken));
		formData.append('refreshToken', localStorage.getItem(TokenGetter.RefreshToken));
		formData.append('orderSerial', orderSerial);
		formData.append('optionId', optionId);
	
		try {
		
		setIsLoading(true)
		var response;
		if (process.env.NODE_ENV === 'development')
		{
			response = await axios.post('http://localhost:8001/reviewUpload', formData, {
			headers: {
			  'Content-Type': 'multipart/form-data',
			},
		  });
			
		}
		else if (process.env.NODE_ENV === 'production')
		{
			
			response = await axios.post('/api/reviewUpload', formData, {
			headers: {
			  'Content-Type': 'multipart/form-data',
			},
		  });
		}
	
		// 서버에서 잘 받았을 때에 대한 처리
		alert("리뷰가 성공적으로 달렸습니다.")
		FetchMyInfo()
		onClose()
		
		} catch (error) {
		  console.error('Error uploading files:', error);
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
		}
	  };

	useEffect(() => {

		clearInterval(timerInterval);
		return () => {
		  clearInterval(timerInterval); // 컴포넌트 언마운트 시 타이머 정리
		};
	  }, []);
	
	const [rating, setRating] = useState(null);
	const handleStarClick = (selectedRating) => {
		setRating(selectedRating);
	  };
	
	return (
	  <div className={`modal ${isOpen ? 'open' : ''}`}>
		<div className="modal-content" style={{width: '650px'}}>
		  <span className="close" onClick={onClose}>&times;</span>
		  
		   	<div>
		  		<span></span>
			</div>
			
			
			<textarea
				value={reviewMsg}
				onChange={handleInputReviewMsg}
				className="phonenum-box1"
				style={{ marginRight: '10px', marginTop: '30px', width: '500px', height: '200px' }}
				placeholder="리뷰를 적어주세요(200자 제한)"
				maxLength={200}
				rows={4}
				cols={50}
			/>
			
			<input style={{marginTop:'10px'}} type="file" accept="image/*, video/*" onChange={HandleFilesChange} multiple />
			{/*<button style={{marginTop: '10px'}} onClick={handleImageUpload}>Upload Image</button>*/}
			
			<p style={{marginTop: '20px'}}>Your Rating: {rating !== null ? `${rating} stars` : 'Not rated yet'}</p>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
			{[1, 2, 3, 4, 5].map((star) => (
				<span
				  key={star}
				  className={star <= rating ? 'star filled' : 'star'}
				  onClick={() => handleStarClick(star)}
				>
				  ★
				</span>
			))}
			</div>
			
			<div>
				{!isLoading && <button style={bomileAuthStyle} onClick={ClickFileUpload}>
					리뷰 달기
				</button>}
				{isLoading && <p1>
					리뷰 올리는 중...
				</p1>}
			</div>
			
		</div>
	  </div>
	);
  }

export default ReviewModal;