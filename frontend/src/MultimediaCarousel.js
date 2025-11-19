import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const MultimediaCarousel = ({ multimediaData }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {multimediaData.map((item, index) => (
        <div key={index}>
          { (
            <img
              src={`data:image/jpeg;base64,${item}`}
              alt={`이미지 ${index + 1}`}
            />
            
            
          )}
          
        </div>
      ))}
    </Slider>
  );
};

export default MultimediaCarousel;