import React from 'react';
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SpeciesCard from './SpeciesCard.jsx'

const SpeciesCarousel=()=>{
    var settings = {
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    return(
        <>
            <Slider {...settings}>
                <div><h1>asdf</h1></div>
                <div><h1>bwer</h1></div>
                <SpeciesCard />
                <div><h1>dwer</h1></div>
                <div><h1>esdf</h1></div>
                <div><h1>fwer</h1></div>
                <div><h1>gsdf</h1></div>
                <div><h1>hwer</h1></div>
            </Slider>
        </>
    )
}
export default SpeciesCarousel;
