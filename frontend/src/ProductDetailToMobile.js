import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { ErrorFunc, TokenGetter } from './App.js';
import Pagination from './Pagination.js';
import { useNavigate, useLocation, useParams  } from 'react-router-dom';
import CategoryChart from './CategoryChart';
import FixFrame from './FixFrame.js';
import HeartControl from './HeartControl.js';
import Modal from 'react-modal';
import Resizer from 'react-image-file-resizer';
import Draggable from 'react-draggable';
import './mediaScreen.css';
import MultimediaCarousel from './MultimediaCarousel';


import { 
		bottomPaneContainerStyle,
		bottomLeftPaneStyle,
	  
		selectedBottomCenterPaneStyle,
		bottomCenterListStyle,
		bottomCenterCheckBoxPaneStyle,
		bottomCenterApplyPaneStyle,
		checkBoxLabelStyle,
		bottomRightPaneStyle,
		applyBtnStyle,
		bottomCenterPaneStyle} from './MainPage'; // 스타일 파일 경로에 따라 수정하세요

const countMinusBtnStyle = {
	padding: '1px 3px', // 패딩 설정
	backgroundColor: '#424242', // 배경색
	color: 'white', // 글자색
	border: '2px solid #424242',
	borderRadius: '4px', // 둥근 모서리
	cursor: 'pointer', // 커서 스타일
};
const countPlusBtnStyle = {
	padding: '1px 3px', // 패딩 설정
	backgroundColor: '#424242', // 배경색
	color: 'white', // 글자색
	border: '2px solid #424242',
	borderRadius: '4px', // 둥근 모서리
	cursor: 'pointer', // 커서 스타일
	marginLeft: '10px',
};

const containerStyle = {
	display: 'flex',
	flexDirection: 'column',
	//height: '100vh',
	//height: 'auto',
	overflow: 'hidden',
	overflowY: 'auto', // 세로 스크롤바
};

const StarRating = ({ starCount }) => {
	const maxStars = 5;
	const stars = '★'.repeat(Math.min(maxStars, Math.max(1, starCount)));
  
	return <div className='review-stars'>{stars}</div>;
  };

const ProductDetail = () => {
	
	const [mainImgPath, setMainImgPath] = useState('');
	const [companyName, setCompanyName] = useState('');
	const [description, setDescription] = useState('');
	const [deliveryPrice, setDeliveryPrice] = useState(0);
	const [productIdStr, setProductIdStr] = useState('');
	const [isLike, setIsLike] = useState(false);
	const [priceInt, setPriceInt] = useState(0);
	const [imageList, setImageList] = useState([]);
	const [optionList, setOptionList] = useState([]);
	const [totalBuyPrice, setTotalBuyPrice] = useState(0);
	const [freeDeliveryCondition, setFreeDeliveryCondition] = useState(0);
	const navigate = useNavigate();
	const [selectedImage, setSelectedImage] = useState(null);
	const [selectedVideo, setSelectedVideo] = useState(null);

	// 선택박스 //////////////////////////////////
	const [selectedOption, setSelectedOption] = useState("");
	const [selectedOptionsList, setSelectedOptionsList] = useState([]);
	const [isFixed, setIsFixed] = useState(false);
	const [productData, setProductData] = useState(null);
	const [avgGrade, setAvgGrade] = useState(false); /* 평균 별점 */
	const [hideImg, setHideImg] = useState(false); /* 이미지 펼쳐보기 */
	const [totalPageCount, setTotalPageCount] = useState(0); /* 리뷰 총 페이지 */
	const [curPage, setCurPage] = useState(1); /* 현재 페이지 */
	
	const handleScroll = () => {
		const scrollPosition = window.scrollY;
	
		// 일정 스크롤 이상 아래로 내려갔을 때
		if (scrollPosition > 200) {
		  setIsFixed(true);
		} else {
		  setIsFixed(false);
		}
	  };
	
	const openImgModal = (image) => {
		setSelectedImage(image);
	};
	
	const closeImgModal = () => {
		setSelectedImage(null);
	};
	
	const openVideoModal = (image) => {
		setSelectedVideo(image);
	};
	
	const closeVideoModal = () => {
		setSelectedVideo(null);
	};
	
	const ClickMoreImg = () => {
		setHideImg(true)
	};
	
	const ClickBuy  = () => {
		
		let localShoppingBagInfoList = [];
		var finalTotalPrice =  0;
		
		if (selectedOptionsList.length === 0) {
			alert("옵션을 선택해주세요.")
			return
		}

		 selectedOptionsList.map((item) => {
			finalTotalPrice += item.totalPrice
			const foundItem = optionList.find(optionItem => optionItem.OptionId === item.optionId);
			const newItem = {
				ProductId: productIdStr,
				ImgURL: mainImgPath,
				Description: description,
				//Price: item.totalPrice - (foundItem.AddPrice * item.quantity),
				Price: priceInt,
				CompanyName: companyName,
				Entity: item.quantity,
				OptionName: foundItem.OptionName,
				OptionId: foundItem.OptionId,  // 동적으로 설정
				AddPrice: foundItem.AddPrice,  // 동적으로 설정
				IsLike: isLike,
				IsChecked: true,
			  };
			  
			   // 로컬 변수에 데이터 추가
			   localShoppingBagInfoList.push(newItem);
		  });
		
		
		let deliveryInfoList = [];
		const deliveryInfo = {
				CompanyName: companyName,
				DeliveryPrice: deliveryPrice,
		  };
		  
		  deliveryInfoList.push(deliveryInfo);
		
		navigate('/OrderPage', { 
			state: {
				buyList: localShoppingBagInfoList,
				totalPrice: finalTotalPrice, // 물건에 대한 총 가격
				deliveryInfoList: deliveryInfoList, // CompanyName:'GIODANO', DeliveryPrice:3500
				finalPrice: finalTotalPrice + deliveryPrice, // totalPrice + 배송비 포함한 가격
			} });
			
	}
	  
	const ShoppingBagClick = () => {
		
		if (selectedOptionsList.length === 0) {
			alert("옵션을 선택해주세요.")
			return
		}

		const accessToken = localStorage.getItem(TokenGetter.AccessToken)
		const refreshToken = localStorage.getItem(TokenGetter.RefreshToken)
		const userId = localStorage.getItem(TokenGetter.UserID)
		if (accessToken === "" || refreshToken === "")
		{
			alert("로그인 후 이용 가능합니다.");
			navigate('/LoginPage');
		
			return
		}

		const ReqAddShoppingBag = {
			LoginId: userId,
			AccessToken: accessToken,
			RefreshToken: refreshToken,
			ProductId: productIdStr,
			selectedOptionsList,
		  };
		  
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.post('http://localhost:8001/addShoppingBag', ReqAddShoppingBag);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.post('/api/addShoppingBag', ReqAddShoppingBag);
		}
		
		httpReq.then(response => {
				alert("장바구니에 추가되었습니다.")
			
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
	
	const ClickExtendImg  = (here) => {
		openImgModal(here);
	}
	
	const ClickExtendVideo  = (here) => {
		openVideoModal(here);
	}

	const handleOptionChange = (event) => {

		const selectedValue = event.target.value;

		if (selectedValue === "")
		{
			alert('옵션을 선택해 주세요.');
			return
		}

		setSelectedOption(selectedValue);	

		 // 중복 체크
		 if (selectedOptionsList.some((item) => item.option === selectedValue)) {
			//alert('이미 선택된 옵션입니다.');
			return;
		}

		
		const foundItem = optionList.find(item => item.OptionName === selectedValue);

		// 선택한 옵션을 리스트에 추가
		if (selectedOptionsList.indexOf(selectedValue) === -1) {
			const priceForOne = foundItem.AddPrice + priceInt
			setSelectedOptionsList([...selectedOptionsList,
				{ option: selectedValue, quantity: 1, addedPrice: priceForOne, totalPrice: priceForOne,optionId: foundItem.OptionId, id: Date.now() }]);
			setTotalBuyPrice(totalBuyPrice + priceForOne)
		}
	  };

	const handleQuantityChange = (id, change) => {
		const updatedOptionsList = selectedOptionsList.map((item) => {
		  if (item.id === id) {
			const newQuantity = item.quantity + change;
			if (newQuantity <= 0)
			{
				return item
			}
			
			if (change < 0)
			{
				setTotalBuyPrice(totalBuyPrice - item.addedPrice)
			}
			else
			{
				setTotalBuyPrice(totalBuyPrice + item.addedPrice)
			}
			
			return { ...item, quantity: newQuantity, totalPrice: item.addedPrice * newQuantity};
		  }
		  return item;
		});
	
		setSelectedOptionsList(updatedOptionsList);
	 };

	const handleCloseOptChange = (id) => {
		const selectedOption = selectedOptionsList.find(item => item.id === id);
		setTotalBuyPrice(totalBuyPrice - selectedOption.totalPrice)
	
		const deleteOptionsList = selectedOptionsList.filter((item) => item.id !== id);
  		setSelectedOptionsList(deleteOptionsList);
	 };

	//////////////////////////////////////////////	

	useEffect(() => {

		// 스크롤 이벤트 리스너 등록
		//window.addEventListener('scroll', handleScroll);
		
		const currentURL = window.location.href;
		const urlArray = currentURL.split("/");
		
		const productIdStr = urlArray.pop()
		setProductIdStr(productIdStr)

		var body = localStorage.getItem(TokenGetter.UserID);
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.get(`http://localhost:8001/productDetail/${productIdStr}`, {
				headers: {
					UserId: `${body}` // 이 부분에서 토큰을 전송합니다.
				}
			  });
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.get(`/api/productDetail/${productIdStr}`, {
				headers: {
				  UserId: `${body}` // 이 부분에서 토큰을 전송합니다.
				}
			  });
		}
		
		httpReq.then(response => {
			const splitImgUrl = response.data.ProductImgInfo.ImgURL.split("./")
			const mainImgPath = "./../../" + splitImgUrl.pop()
			setMainImgPath(mainImgPath)

			setCompanyName(response.data.ProductImgInfo.CompanyName)
			setDescription(response.data.ProductImgInfo.Description)
			setDeliveryPrice(Number(response.data.ProductImgInfo.DeliveryPrice))
			
			const priceInt = Number(response.data.ProductImgInfo.Price);
			setPriceInt(priceInt)
			setIsLike(response.data.ProductImgInfo.IsLike)
			setFreeDeliveryCondition(response.data.FreeDeliveryCondition)
			setAvgGrade(response.data.AvgGrade)
			setTotalPageCount(response.data.TotalPageCount)

			// 이미지 리스트
			if(response.data.ImgPathList === null)
			{
				setImageList([]);
			}
			else
			{
				const sortedItems = [...response.data.ImgPathList]
					.sort((a, b) => {
					// 먼저 Order로 정렬
					if (a.Order !== b.Order) {
					  return a.Order - b.Order;
					}
				
					// Order가 같은 경우 ImgPath로 정렬
					return a.ImgPath.localeCompare(b.ImgPath);
  				})
				.map(item => item.ImgPath);
				
				setImageList(sortedItems);
			}
			
			// 옵션 리스트
			if(response.data.OptionInfoList === null)
			{
				setOptionList([]);
			}
			else
			{
				const sortedItems = [...response.data.OptionInfoList].sort((a, b) => a.OptionId - b.OptionId);
				setOptionList(sortedItems);
			}
			
			// 리뷰 설정//
			if(response.data.ProductReviewDetailInfoList === null)
			{
				setProductData([]);
			}
			else
			{
				setProductData(response.data.ProductReviewDetailInfoList);
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
		
		return () => {
			//clearInterval(intervalId); // test ymi
			window.removeEventListener('scroll', handleScroll);
		};
		
	}, []);
	
	const ChangeReviewPage = (reqCurPage) => {
		const ReqProductReviewPage = {
			params: {
				cur_page : reqCurPage,		
			},
		};
		
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.get(`http://localhost:8001/productDetailPage/${productIdStr}`, ReqProductReviewPage);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.get(`/api/productDetail/productDetailPage/${productIdStr}`, ReqProductReviewPage);
		}
		
		httpReq.then(response => {
			
			setCurPage(reqCurPage)
			
			
			// 리뷰 설정//
			if(response.data.ProductReviewDetailInfoList === null)
			{
				setProductData([]);
			}
			else
			{
				setProductData(response.data.ProductReviewDetailInfoList);
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
	
	var leftPos = '0px'
	var topPos = '-50px'
	var isMobile = false
	if (window.innerWidth  <= 768)
	{
		leftPos = '10px'
		topPos = '-45px'
		isMobile = true
	}
	
	
	
	return (
		<div /*style={containerStyle}*/>

			{/*위*/}
			<FixFrame curPath={"./../../"}
			isLogin={localStorage.getItem(TokenGetter.AccessToken) === "" ? false : true}/>

				
				{/*중앙*/}
					<img className='product-main-size' /*style={{ marginLeft: '40px', width: '500px', height: '450px' }}*/ src={mainImgPath} alt={"불러오기 실패"} />
					<div className='product-description-style' /*style={{textAlign: 'left', marginLeft: '90px' }}*/>
						<h2 className='detail-product-name'>{companyName}</h2><br/><br/>
						<span>{description}</span><br/><br/>
						<h3>{priceInt.toLocaleString()}원</h3><br/><br/>
						<select value={selectedOption} onChange={handleOptionChange} style={{width: '150px', height: '30px', borderRadius: '5px'}}>
  								<option value="">옵션선택(필수)</option>
  								{optionList.map((option, index) => (
  								  <option key={index} value={option.OptionName}>
  									{option.AddPrice > 0 ? `${option.OptionName} (+${option.AddPrice})` : option.AddPrice < 0 ? `${option.OptionName} (${option.AddPrice})` : option.OptionName}
  								</option>
  								))}
						</select>
						
						<div style={{ display: 'flex', flexDirection: 'column', marginLeft: '-5px' }}>
 							<ul>
 							  {selectedOptionsList.map((selected, index) => (
 								<li key={selected.id} className='selected-option-style'>
 								  <span style={{ flex: 1, fontSize:'13px', }}>{selected.option}</span>
 								  <button style={countMinusBtnStyle} onClick={() => handleQuantityChange(selected.id, -1)}>━</button>
 								  <span style={{ marginLeft: '10px', fontSize:'14px', }}>{selected.quantity}</span>
 								  <button style={countPlusBtnStyle} onClick={() => handleQuantityChange(selected.id, 1)}>┾</button>
 								  <span style={{ flex: 1, marginLeft: '40px', fontSize:'14px', }}>{(selected.totalPrice).toLocaleString()}원</span>
 								  <button onClick={() => handleCloseOptChange(selected.id)}>X</button>
 								</li>
 							  ))}
 							</ul>
						</div>
						
						<h2 style={{marginTop: '10px', }}>{totalBuyPrice.toLocaleString()}원</h2>
						<span style={{color: '#848484',fontSize: '13px',}}>{freeDeliveryCondition.toLocaleString()}원 이상 주문 시 무료 배송</span>
					</div>


					
					{selectedImage === null && selectedVideo === null && (
  					<div
						style={{
						  position: 'fixed',
						  left: '0%',
						  top: '92%',
						  width: '100%', // 원하는 너비로 설정
						  height: '100%', // 원하는 높이로 설정
						  backgroundColor: 'white',
						  color: 'white', // 텍스트 색상 설정 (선택 사항)
						  zIndex: '999',
						  borderTop: '1px solid #E6E6E6', // 윗 부분에 검은 테두리 설정
						}}>
					</div>
					)}
				

					{selectedImage === null && selectedVideo === null && (
  					<div className='detail-btn-style' /*style={{ marginTop: '40px', display: 'flex', flexDirection: 'row' }}*/>
						<HeartControl
						  customStyle={{ width: '100px', position: 'fixed', top: '92.5%', left: '-41%' }}
						  productId={productIdStr}
						  propIsLike={isLike}
						/>
						<button className='shopping-bag-btn-style' /*style={shoppingBagBtnStyle}*/ onClick={ShoppingBagClick}>장바구니 담기</button>
						<button className='buy-btn-style' /*style={buyBtnStyle}*/ onClick={ClickBuy}>구매</button>
  					</div>
					)}
				
					
					<div style={{ marginTop: '90px', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
						{!hideImg && (
							imageList.length > 0 ? (
							imageList.slice(0,1).map((imageInfo, index) => (
								<img className='detail-img-reduce-style' /*style={{marginLeft: '90px', width: '900px',height:'550px', marginBottom: '0px', objectFit: 'cover', objectPosition: 'top',}}*/ src={imageInfo} alt={"불러오기 실패"} />
							))
  							) : (
								<p>No images available</p>
  							)
						)}
						
						{!hideImg && (
							<button className='rolling-reduce-btn' onClick={ClickMoreImg} /*style={ReduceImgBtnStyle}*/>
								펼쳐보기 ▽
							</button>
						)}
						
						{hideImg && (
							imageList.length > 0 ? (
							imageList.map((imageInfo, index) => (
							<img className='detail-img-style' /*style={{marginLeft: '90px', width: '900px', marginBottom: '5px' }}*/ src={imageInfo} alt={"불러오기 실패"} />
							))
							) : (
								<p>No images available</p>
							)
						)}
					</div>
						
						{/*//////////////////////////////////////////////////////////////////////////////////////////*/}
						<div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start',}}>
							
						</div>
						{/*//////////////////////////////////////////////////////////////////////////////////////////*/}
						<h1 /*className='avg-grade'*/ style={{marginBottom:'20px', marginTop:'50px', marginLeft:'10px',}}>★  {avgGrade}/5</h1>
		 				{productData ? (
							<div>
								<hr className='detail-review-hyphen' /*style={{ marginLeft: '190px',}}*/></hr>
								{productData.map((reviewInfo, index) => (
								<div /*className='review-window' style={{display: 'flex', flexDirection: 'column', position: 'relative', left:'100px',}}*/>
									<div style={{marginLeft:'10px',}}>
									<StarRating starCount={reviewInfo.StarGrade} />
										<div /*className='option-text'*/ /*style={{position: 'relative', left:'120px', top:'-30px',}}*/>
											<p className='review-option' /*style={{position: 'relative', left:'230px', top:'30px', width: 'fit-content', }}*/>옵션:{reviewInfo.OptionName}</p>
											<p className='review-date' /*style={{position: 'relative', left:'720px', top:'-20px', width: 'fit-content', }}*/>{reviewInfo.ReviewDate}</p>
											<p className='review-date' /*style={{position: 'relative', left:'720px', top:'-20px', width: 'fit-content', }}*/>{reviewInfo.UserId}</p>
										</div>
									</div>
				  
				  	
								<div className='review-contents-list' /*style={{display: 'flex', flexDirection: 'row', position: 'relative', left:'120px', top:'-50px',}}*/>
											
									{/*이미지*/}
									{reviewInfo.ImgBase64 ? (
			  							reviewInfo.ImgBase64.map((imgBase64, imgIndex) => (
											<img
												key={imgIndex}
												src={`data:image/jpeg;base64,${imgBase64}`}
												className='review-media-contents'
												/*style={{ cursor: 'pointer', marginRight: '5px', width: '150px', height: '110px', }}*/
												onClick={() => ClickExtendImg(imgBase64)}
												alt={`이미지깨짐`} />
			  							))
									) : (
			  							<p></p>
									)}
												
									{/*비디오*/}
									{reviewInfo.VideoBase64 ? (
										reviewInfo.VideoBase64.map((videoBase64, videoIndex) => (
										<video
 											onClick={() => ClickExtendVideo(videoBase64)}
 											key={videoIndex}
											 className='review-media-contents'
											/*style={{marginRight:'10px', width: '150px', height: '120px',}}*/
 											autoPlay  // 추가: 페이지에 들어오면 자동으로 재생 시작
 											muted     // 추가: 음소거
 											loop      // 추가: 반복 재생
										>
  										<source src={`data:video/mp4;base64,${videoBase64}`} type="video/mp4" />
											Your browser does not support the video tag.
										</video>
										))
										) : (
										<p></p>
									)}

								</div>
								<div style={{width: '320px'/*원하는 너비 설정*/, wordWrap: 'break-word',/*텍스트가 넘칠 때 줄바꿈*/ marginLeft:'8px',}}>
									<span>{reviewInfo.ReviewMsg}</span>
								</div>
		  		  
				  <hr className='detail-review-hyphen' /*style={{ marginLeft: '90px', marginTop: '0px', marginBottom: '20px', borderBottom: '0px solid grey', width:'1000px', position: 'relative', left:'-100px',}}*/></hr>
								</div>
			  ))}
			  
			<div style={{marginTop:'-70px',}}>
							<Pagination
							currentPage={curPage}
							totalPages={totalPageCount}
							onPageChange={ChangeReviewPage}
						/>
			</div>
			<Modal
				isOpen={selectedImage !== null}
				onRequestClose={closeImgModal}
				style={isMobile === false
					? {
						overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
						content: { padding: '20px', maxWidth: '850px', margin: 'auto' },
					  }
					: {
						overlay: {
						  backgroundColor: 'rgba(0, 0, 0, 0.5)',
						  display: 'flex',
						  justifyContent: 'center',
						  alignItems: 'center',
						},
						content: {
						  position: 'relative',
						  top: '0px',
						  left: '0px',
						  right: '0px',
						  bottom: '0px',
						  margin: 0,
						  padding: 0,
						  border: 'none',
						  maxWidth: '100%',
						  maxHeight: '100%',
						  width: '100%',
						  height: '100%',
						  overflow: 'hidden',
						},
					  }
			}>
					
					
					
				{selectedImage && (
				  <div>
					<button onClick={closeImgModal} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>
					X
					</button>
					
					<Draggable>
				   <img
						/*className='modal-detail-img'*/
						style={{ width: '100%', height: '100%', pointerEvents: 'none', marginTop:"50px" }}
						src={`data:image/jpeg;base64,${selectedImage}`}
						alt={`이미지깨짐`} />
					</Draggable>
					
				  </div>
				)}
				
			</Modal>
				
		  <Modal
			isOpen={selectedVideo !== null}
			onRequestClose={closeVideoModal}
			style={isMobile === false
				? {
					overlay: {
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					},
					content: {
						position: 'relative',
						top: 'auto',
						left: 'auto',
						right: 'auto',
						bottom: 'auto',
						margin: 0,
						padding: 0,
						border: 'none',
						maxWidth: '100%',
						maxHeight: '100%',
						width: '80%', // 원하는 너비 조정
						height: '80%', // 원하는 높이 조정
						overflow: 'hidden',
					},
					
				  }
				: {
					overlay: {
					  backgroundColor: 'rgba(0, 0, 0, 0.5)',
					  display: 'flex',
					  justifyContent: 'center',
					  alignItems: 'center',
					},
					content: {
					  position: 'relative',
					  top: '0px',
					  left: '0px',
					  right: '0px',
					  bottom: '0px',
					  margin: 0,
					  padding: 0,
					  border: 'none',
					  maxWidth: '100%',
					  maxHeight: '100%',
					  width: '100%',
					  height: '100%',
					  overflow: 'hidden',
					},
				  }
		}>
			{selectedVideo && (
			  <div>
				<button onClick={closeVideoModal} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>
				X
				</button>
				
				<video
				className='modal-video-style'
				/*style={{ width: '720px', height: '480px', marginLeft:'40px', marginTop:'40px' }}*/
				/*style={{ width: '100%', height: '100%', marginLeft:'0px', marginTop:'40px' }}*/
				/*width="720" height="480"*/ controls>
					<source src={`data:video/mp4;base64,${selectedVideo}`} type="video/mp4" />
					Your browser does not support the video tag.
				</video>
			  </div>
			)}
		  </Modal>
			
			</div>
		  ) : (
			<p>Loading...</p>
		  )}


					
					

				
				{/*오른쪽*/}
				<div style={bottomRightPaneStyle}>
					{/*<button style={SideBarStyle1}>설명</button>*/}
					{/*<button style={SideBarStyle2}>review</button>*/}
				</div>
				{/*///////////////////////////////////////////////*/}
				
				
			</div>
		);
}


export default ProductDetail;