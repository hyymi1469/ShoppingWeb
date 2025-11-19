import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import { ErrorFunc, ProductType, DogFoodFilter, TokenGetter } from './App.js';
import Pagination from './Pagination.js';
import { useNavigate, useLocation } from 'react-router-dom';
import CategoryChart from './CategoryChart';
import FixFrame from './FixFrame.js';
import HeartControl from './HeartControl.js';
import './mediaScreen.css';
import { containerStyle,
        bottomPaneContainerStyle,
        bottomLeftPaneStyle,
		companyNameStyle,
        selectedBottomCenterPaneStyle,
		bottomCenterListStyle,
		bottomCenterApplyPaneStyle,
		checkBoxLabelStyle,
        bottomRightPaneStyle,

		descriptionStyle,
		priceStyle} from './MainPage'; // 스타일 파일 경로에 따라 수정하세요


const bottomCenterCheckBoxPaneStyle = {
	display: 'flex',
	//alignItems: 'center', // 수직 가운데 정렬
	//justifyContent: 'center', // 가로 가운데 정렬 추가
	flexDirection: 'row', // 가로로 나열
	padding: '10px',
	flexWrap: 'wrap', // 요소가 공간 부족 시 다음 줄로 내려감
	flexBasis: '60%', // 가로로 4개의 이미지를 표시하려면 25%로 설정
	marginTop: '20px',
	//borderBottom: '3px solid #ccc', // 언더바 스타일: '1px solid #e4e4e4', // 얇은 테두리 추가 임시 ymi
};

const applyBtnStyle = {
	width: '80px', // 원하는 너비로 설정
	height: '30px', // 원하는 높이로 설정
	//display: 'flex', // 내부 컨텐츠를 중앙 정렬하기 위해 flex 사용
	//justifyContent: 'center', // 가로 중앙 정렬
	//alignItems: 'center', // 세로 중앙 정렬
	border: 'none', // 테두리 제거 (선택 사항)
	background: 'black', // 배경색 지정 (선택 사항)
	color: 'white', // 텍스트 색상 지정 (선택 사항)
    cursor: 'pointer', // 커서 스타일 지정 (선택 사항)
	fontSize: '14px',
	marginLeft:'0px',
}
		
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
		<div className='main-center-list'  /*style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', textAlign: 'left', marginTop: '100px', height: '350px',}}*/>
			<div>
				<img img className='each-img' onClick={handleDetailProductClick} src={src} alt={"불러오기 실패"} />
			</div>
			<div>
				<div style={{ /*display: 'flex',*/ alignItems: 'center', height: '40px' }}>
					<span className='company-name-style' /*style={companyNameStyle}*/ onClick={handleDetailProductClick}> {companyName}</span>
					<HeartControl
						customStyle={{ position: 'relative', left: leftPos, top: topPos }}
						productId={productId}
						propIsLike={isLike}/>
					
				</div>
				
				<span className='description-style' /*style={descriptionStyle}*/ onClick={handleDetailProductClick}> {description}</span><br/><br/>
				<span className='price-style' /*style={priceStyle}*/ onClick={handleDetailProductClick}> {price.toLocaleString()}원</span>
				
				
				
			</div>

		</div>
	);
};
		
		
const Category1of1Page = () => {
	const navigate = useNavigate();
	const searchParams = new URLSearchParams(window.location.search);
	
	const [filterProductList, setFilterProductList] = useState([]);
	const [isChecked1, setIsChecked1] = useState(false);
	const [isChecked2, setIsChecked2] = useState(false);
	const [isChecked3, setIsChecked3] = useState(false);
	const [isChecked4, setIsChecked4] = useState(false);
	const [isChecked5, setIsChecked5] = useState(false);
	const [isChecked6, setIsChecked6] = useState(false);
	const [isChecked7, setIsChecked7] = useState(false);
	const [productType, setProductType] = useState(0);
	const [productDetail, setProductDetail] = useState(0);
	const [curPage, setCurPage] = useState(1); // 현재 페이지
	const [totalPage, setTotalPage] = useState(1); // 총 페이지
	
	const handleCheckboxChange1 = () => {
		setIsChecked1(!isChecked1); // 체크박스 상태를 토글
	};
	const handleCheckboxChange2 = () => {
		setIsChecked2(!isChecked2); // 체크박스 상태를 토글
	};
	const handleCheckboxChange3 = () => {
		setIsChecked3(!isChecked3); // 체크박스 상태를 토글
	};
	const handleCheckboxChange4 = () => {
		setIsChecked4(!isChecked4); // 체크박스 상태를 토글
	};
	const handleCheckboxChange5 = () => {
		setIsChecked5(!isChecked5); // 체크박스 상태를 토글
	};
	const handleCheckboxChange6 = () => {
		setIsChecked6(!isChecked6); // 체크박스 상태를 토글
	};
	const handleCheckboxChange7 = () => {
		setIsChecked7(!isChecked7); // 체크박스 상태를 토글
	};


	const CheckBoxList = () => {
		var filterList = []
		if (isChecked1 === true)
		{
			filterList.push(DogFoodFilter.DogFoodFilter_RawFood)
		}
		if (isChecked2 === true)
		{
			filterList.push(DogFoodFilter.DogFoodFilter_AirDry)
		}
		if (isChecked3 === true)
		{
			filterList.push(DogFoodFilter.DogFoodFilter_OvenBake)
		}
		if (isChecked4 === true)
		{
			filterList.push(DogFoodFilter.DogFoodFilter_FreshFood)
		}
		if (isChecked5 === true)
		{
			filterList.push(DogFoodFilter.DogFoodFilter_DryFood)
		}
		return filterList;
	};

	const ListOfCheckBox = (filterList) => {

		filterList.forEach((number) => {
				
			if (number === 1){
				setIsChecked1(true);
			}else if (number === 2){
				setIsChecked2(true);
			}else if (number === 3){
				setIsChecked3(true);
			}else if (number === 4){
				setIsChecked4(true);
			}else if (number === 5){
				setIsChecked5(true);
			}else if (number === 6){
				setIsChecked6(true);
			}else if (number === 7){
				setIsChecked7(true);
			}


		  });
	}
	
	// URL을 주소창에 직접 쳤을 때.
	const FetchDirectProductList = (productType, detailType, reqPage, filterListStr) => {

		const filterList = JSON.parse(filterListStr);
		const ReqApplyFilterPageInfo = {
			params: {
				page : reqPage,
				user_id: localStorage.getItem(TokenGetter.UserID),
				product_type: productType,
				detail_type: detailType,
				filter_list: JSON.stringify(filterList),
			},
		};
		
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.get('http://localhost:8001/applyFilterPage', ReqApplyFilterPageInfo);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.get('/api/applyFilterPage', ReqApplyFilterPageInfo);
		}
		
		httpReq.then(response => {
			
			setTotalPage(response.data.TotalPageCount)
			setCurPage(reqPage)
			setProductType(productType)
			setProductDetail(detailType)

			ListOfCheckBox(filterList)

			if(response.data.ProductImgInfo === null)
			{
				setFilterProductList([]);
			}
			else
			{
				const sortedItems = [...response.data.ProductImgInfo].sort((a, b) => a.Description - b.Description);
				setFilterProductList(sortedItems);
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

	const CheckBoxApplyClick = () => {
		
		var filterList = CheckBoxList()
		
		setCurPage(1);
		const reqApplyFilterPageInfo = {
			params: {
				page : 1,
				user_id: localStorage.getItem(TokenGetter.UserID),
				product_type: productType,
				detail_type: productDetail,
				filter_list: JSON.stringify(filterList),
			},
		};
		
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.get('http://localhost:8001/applyFilterPage', reqApplyFilterPageInfo);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.get('/api/applyFilterPage', reqApplyFilterPageInfo);
		}
		
		httpReq.then(response => {
			setTotalPage(response.data.TotalPageCount)
			setCurPage(1)
			if(response.data.ProductImgInfo === null)
			{
				setFilterProductList([]);
			}
			else
			{
				const sortedItems = [...response.data.ProductImgInfo].sort((a, b) => a.Description - b.Description);
				setFilterProductList(sortedItems);
			}

			const queryString = `?page=${1}
			&total_page=${totalPage}
			&product_type=${productType}
			&detail_type=${productDetail}
			&filter_list=${encodeURIComponent(JSON.stringify(filterList))}`;
			
			window.history.pushState("", "", `/Category1of1Page${queryString}`)

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
		
		const product_type = searchParams.get('product_type');
		const detail_type = searchParams.get('detail_type');
		const page = searchParams.get('page');
		const filter_list = searchParams.get('filter_list');
		var filterList = []
		if(filter_list !== null)
		{
			filterList = JSON.parse(filter_list);
			//FetchDirectProductList(product_type, detail_type, curPage, filter_list)
			//return
		}

		// 초회 페이지
		const ReqApplyFilterPageInfo = {
			params: {
				page : page,
				user_id: localStorage.getItem(TokenGetter.UserID),
				product_type: product_type,
				detail_type: detail_type,
				filter_list: JSON.stringify(filterList),
			},
		};
		
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.get('http://localhost:8001/applyFilterPage', ReqApplyFilterPageInfo);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.get('/api/applyFilterPage', ReqApplyFilterPageInfo);
		}

		httpReq.then(response => {
			setTotalPage(response.data.TotalPageCount)
			setCurPage(page)
			if(response.data.ProductImgInfo === null)
			{
				setFilterProductList([]);
			}
			else
			{
				const sortedItems = [...response.data.ProductImgInfo].sort((a, b) => a.Description - b.Description);
				setFilterProductList(sortedItems);
			}

			setTotalPage(response.data.TotalPageCount)
			setCurPage(1)
			setProductType(product_type)
			setProductDetail(detail_type)
			ListOfCheckBox(filterList)

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
			//console.log('컴포넌트가 화면에서 사라짐');
		};
	}, []);

	
	const RefreshCategoryPage = (reqCurPage) => {
		
		var filterList = CheckBoxList()
		const reqApplyFilterPageInfo = {
			params: {
				page : reqCurPage,
				user_id: localStorage.getItem(TokenGetter.UserID),
				product_type: productType,
				detail_type: productDetail,
				filter_list: JSON.stringify(filterList),
			},
		};
		
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.get('http://localhost:8001/applyFilterPage', reqApplyFilterPageInfo);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.get('/api/applyFilterPage', reqApplyFilterPageInfo);
		}
		
		httpReq.then(response => {
			
			setTotalPage(response.data.TotalPageCount)
			setCurPage(reqCurPage)
			
			
			if(response.data.ProductImgInfo === null)
			{
				setFilterProductList([]);
			}
			else
			{
				const sortedItems = [...response.data.ProductImgInfo].sort((a, b) => a.Description - b.Description);
				setFilterProductList(sortedItems);
			}
			
			
			const queryString = `?page=${reqCurPage}
			&total_page=${totalPage}
			&product_type=${productType}
			&detail_type=${productDetail}
			&filter_list=${encodeURIComponent(JSON.stringify(filterList))}`;
			
			//window.location.href = `/Category1of1Page${queryString}`;
			window.history.pushState("", "", `/Category1of1Page${queryString}`)

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


	const fetchDogFootList = (reqCurPage) => {
		
		const DogFoodPage = {
			ReqPage: reqCurPage,
			ProductType: ProductType.DogFood,
		};
		  
		var httpReq;
		if (process.env.NODE_ENV === 'development')
		{
			httpReq = axios.post('http://localhost:8001/dogFoodList', DogFoodPage);
		}
		else if (process.env.NODE_ENV === 'production')
		{
			httpReq = axios.post('/api/dogFoodList', DogFoodPage);
		}
		
		httpReq.then(response => {
			setTotalPage(response.data.TotalPageCount)
			setCurPage(reqCurPage)
			if(response.data.ProductImgInfo === null)
			{
				setFilterProductList([]);
			}
			else
			{
				const sortedItems = [...response.data.ProductImgInfo].sort((a, b) => a.Description - b.Description);
				setFilterProductList(sortedItems);
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
		<div /*style={containerStyle}*/>

			{/*위*/}
			<FixFrame
			curPath={"./"}
			isLogin={localStorage.getItem(TokenGetter.AccessToken) === "" ? false : true}/>
			{/*///////////////////////////////////////////////*/}
			
			{/*아래*/}
			<div className='main-page-dir' /*style={bottomPaneContainerStyle}*/>
			{/*///////////////////////////////////////////////*/}

				{/*왼쪽*/}
				<div style={bottomLeftPaneStyle}>
					{/*강아지 카테고리*/}
					<CategoryChart
						selectedCategory={"시니어"}
						selectedChatNum={1}/>
				</div>
				{/*///////////////////////////////////////////////*/}
			

				{/*중앙*/}
				<div className='bottom-center-pane' /*style={selectedBottomCenterPaneStyle}*/>

					{/*체크박스공간*/}
					<div style={bottomCenterCheckBoxPaneStyle}>
						<label style={checkBoxLabelStyle}>
        					<input
        					  type="checkbox"
        					  checked={isChecked1} // 체크박스 상태를 반영
        					  onChange={handleCheckboxChange1} // 체크박스 변경 핸들러
        					/>
        						생식
      					</label>
						<label style={checkBoxLabelStyle}>
        					<input
        					  type="checkbox"
        					  checked={isChecked2} // 체크박스 상태를 반영
        					  onChange={handleCheckboxChange2} // 체크박스 변경 핸들러
        					/>
        						에어드라이
      					</label>
						  <label style={checkBoxLabelStyle}>
        					<input
        					  type="checkbox"
        					  checked={isChecked3} // 체크박스 상태를 반영
        					  onChange={handleCheckboxChange3} // 체크박스 변경 핸들러
        					/>
        						오븐베이크
      					</label>
						  <label style={checkBoxLabelStyle}>
        					<input
        					  type="checkbox"
        					  checked={isChecked4} // 체크박스 상태를 반영
        					  onChange={handleCheckboxChange4} // 체크박스 변경 핸들러
        					/>
        						신선사료
      					</label>
						<label style={checkBoxLabelStyle}>
        					<input
        					  type="checkbox"
        					  checked={isChecked5} // 체크박스 상태를 반영
        					  onChange={handleCheckboxChange5} // 체크박스 변경 핸들러
        					/>
        						건사료
      					</label>
						
					</div>

					<div style={bottomCenterApplyPaneStyle}>
						<br/>
						<button style={applyBtnStyle} onClick={CheckBoxApplyClick}>
      						적용
    					</button>
					</div>
					{/*///////////////////////////////////////////////*/}

					{/*아이템 나열*/}
					<div className='bottom-center-list' /*style={bottomCenterListStyle}*/>
					{filterProductList.length > 0 ? (
						filterProductList.map((imageInfo, index) => (
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
							onPageChange={RefreshCategoryPage}

						/>
					{/*///////////////////////////////////////////////*/}

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

export default Category1of1Page;