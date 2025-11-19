import React, { useState, useEffect  } from 'react';

const curPageStyle = {
  
	//color: '#6E6E6E',
	marginRight: '25px', // h1과 input 사이 간격을 조절
	//marginBottom: '15px', // h1과 input 사이 간격을 조절
	//alignItems: 'center', // 수직 가운데 정렬
	cursor: 'pointer', // 클릭 모양 커서 설정
	//border: '1px solid #ccc',
	
};

const Pagination = ({ currentPage, totalPages, searchWord, onPageChange }) => {
  

  useEffect(() => {
				
		
		return () => {
			
		};
	}, [currentPage]);

  const getCurPageStyle = (i) => {
		// selectedCategory와 현재 카테고리가 일치하면 볼드체 스타일을 반환
		return currentPage === i ? { ...curPageStyle, fontWeight: 'bolder', textDecoration: 'underline' } : curPageStyle;
	};

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <span
        style={getCurPageStyle(i)}
          key={i}
          className={i === currentPage ? 'active' : ''}
          onClick={() => onPageChange(i, searchWord)}
        >
          {i}
        </span>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="pagination" style={{display: 'flex',  justifyContent: 'center',alignItems: 'center', height: '25vh',}}>
      {renderPageNumbers()}
    </div>
  );
};

export default Pagination;