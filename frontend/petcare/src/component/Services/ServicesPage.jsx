import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Row, Col, Card } from 'react-bootstrap';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ServicePage = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3001/servicepage');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true, 
    autoplaySpeed: 5000, 
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      }
    ]
  };

  return (
    <div className="text-center pb-4"> 
      <h2 className="mt-3 mb-5 h2-animation">Services</h2>
      <Row className="service-row">
        <Col sm={12} className=" service-col mx-auto">
          <Slider {...settings}>
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <Card>
                  <Card.Img variant="top" src={service.image1} className="service-img"  />
                  <Card.Body className="text-center">
                    <Card.Text>{service.title2}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <Card>
                  <Card.Img variant="top" src={service.image2} className="service-img"  />
                  <Card.Body className="text-center">
                    <Card.Text>{service.title3}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <Card>
                  <Card.Img variant="top" src={service.image3} className="service-img"  />
                  <Card.Body className="text-center">
                    <Card.Text>{service.title4}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Slider>
        </Col>
      </Row>
    </div>
  );
}

export default ServicePage;

