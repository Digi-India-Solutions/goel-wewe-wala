import React from "react";
import Slider from "react-slick";
import "./testimonials.css";
import comaImage from "../../images/coma.png";

const testimonialsData = [
  {
    feedback:
      "Goel Mewewale delivers the freshest almonds and cashews I've ever had. The quality is premium and packaging is excellent!",
    name: "Kavita Kumari",
    location: "Delhi, India",
    image: comaImage,
  },
  {
    feedback:
      "I ordered a combo of dry fruits for Diwali, and it was a hit with my family. Clean, fresh, and arrived on time. Highly recommended!",
    name: "Deepu Verma",
    location: "Lucknow, Uttar Pradesh",
    image: comaImage,
  },
  {
    feedback:
      "The quality of raisins and walnuts from Goel Mewewale is top-notch. Perfect for baking and daily snacking!",
    name: "Meena Joshi",
    location: "Jaipur, Rajasthan",
    image: comaImage,
  },
  {
    feedback:
      "I’ve been using Goel Mewewale’s flax seeds and chia seeds in my smoothies daily. So fresh and packed with nutrition!",
    name: "Rahul Deshmukh",
    location: "Pune, Maharashtra",
    image: comaImage,
  },
  {
    feedback:
      "As a fitness enthusiast, I love their range of seeds. Sunflower and pumpkin seeds are my favorites – great taste and energy boost!",
    name: "Nisha Rathi",
    location: "Indore, Madhya Pradesh",
    image: comaImage,
  },
  {
    feedback:
      "Goel Mewewale has amazing gift boxes for festivals. I sent one to my relatives and they loved it. Will definitely buy again!",
    name: "Rajat Agarwal",
    location: "Kolkata, West Bengal",
    image: comaImage,
  },
  {
    feedback:
      "Their pistachios are just wow – salted just right and super fresh. My kids love them!",
    name: "Anjali Mehta",
    location: "Chandigarh, India",
    image: comaImage,
  },
  {
    feedback:
      "Shopping from Goel Mewewale is always smooth. Great prices, great quality, and fast delivery every single time!",
    name: "Vikas Rana",
    location: "Bhopal, Madhya Pradesh",
    image: comaImage,
  },
];

const Testimonial = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="testimonial-section">
      <div className="container">
        <h2 className="section-title">What Our Customers Say</h2>
        <Slider {...sliderSettings}>
          {testimonialsData.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-content">
                <img
                  src={testimonial.image}
                  alt="Quote"
                  className="quote-icon"
                />
                <p className="testimonial-feedback">{testimonial.feedback}</p>
                <h5 className="customer-name">{testimonial.name}</h5>
                <p className="customer-location">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonial;
