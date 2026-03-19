import React from 'react';
import Slider from 'react-slick';
import '../css/slider.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const SimpleSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  return (
    <section>
        <div id="containerSlider">
            <Slider {...settings}>
                <div className="slidingImage"> <img src="/img/img/img1.png" alt="image1" /> </div>
                <div className="slidingImage"> <img src="/img/img/img2.png" alt="image2" /> </div>
                <div className="slidingImage"> <img src="/img/img/img3.png" alt="image3" /> </div>
                <div className="slidingImage"> <img src="/img/img/img4.png" alt="image4" /> </div>
            </Slider>
        </div>
    </section>
  );
}

export default SimpleSlider;
