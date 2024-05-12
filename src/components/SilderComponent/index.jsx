import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "./style.scss";

export default function SliderComponent({ sliderImages }) {
  var settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    speed: 500,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
  };
  return (
    <div className="slider-container rounded-md overflow-hidden">
      <Slider {...settings}>
        {sliderImages.map((image, index) => (
          <div key={index}>
            <div className="absolute top-1/2 z-50 ml-32">
              <p className="uppercase text-3xl text-white font-bold max-w-96">{image.title}</p>
              <p className="text-sm text-white">{image.description}</p>
            </div>
            <img className="rounded-md" src={image.image} alt="slider images" />
          </div>
        ))}
      </Slider>
    </div>
  );
}

SliderComponent.propTypes = {
  sliderImages: PropTypes.array,
};
