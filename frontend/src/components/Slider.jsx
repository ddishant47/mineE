import React from 'react';
import Slider from 'react-slick';
import '../css/slider.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const SimpleSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: false, // Changed to false for better performance
    pauseOnHover: false,
    focusOnSelect: false,
    accessibility: false, // Prevents focus-stealing issues mentioned in logs
  };

  const slides = [
    {
      img: "/img/img/img1.png",
      title: "Summer Collection 2024",
      subtitle: "Experience the ultimate comfort and style",
      btnText: "Shop Now"
    },
    {
      img: "/img/img/img2.png",
      title: "Premium Accessories",
      subtitle: "Elevate your look with our curated pieces",
      btnText: "Explore More"
    },
    {
      img: "/img/img/img3.png",
      title: "New Arrivals",
      subtitle: "Discover the latest trends in fashion",
      btnText: "View All"
    },
    {
      img: "/img/img/img4.png",
      title: "Home Decor",
      subtitle: "Transform your living space",
      btnText: "Browse Items"
    }
  ];

  return (
    <section className="hero-slider">
        <div id="containerSlider">
            <Slider {...settings}>
                {slides.map((slide, index) => (
                  <div key={index} className="slidingItem">
                    <div className="slide-content-wrapper">
                      {/* Blur Backdrop for Background Fill */}
                      <div className="slide-bg-blur" style={{ backgroundImage: `url(${slide.img})` }}></div>
                      
                      {/* Main Featured Image (Contained) */}
                      <img src={slide.img} alt={slide.title} />
                      
                      <div className="slide-overlay">
                        <div className="slide-content">
                          <h1 className="slide-title">{slide.title}</h1>
                          <p className="slide-subtitle">{slide.subtitle}</p>
                          <button className="slide-btn">{slide.btnText}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </Slider>
        </div>
    </section>
  );
}

export default React.memo(SimpleSlider);
