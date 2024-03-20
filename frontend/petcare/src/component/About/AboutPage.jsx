import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServicePage from '../Services/ServicesPage';
import HappyFurparentsPage from '../HappyFurParentsPage/HappyFurparentsPage';
import Footer from '../Footer/Footer';
import '../About/About.css'; 


const AboutPage = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null); 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/aboutpage');
                setData(response.data);
            } catch (error) {
                setError('Error fetching data');
                console.error(error);
            }
        };
        fetchData();
    }, []); 

    return (
        <>
            <div className="container-fluid d-flex justify-content-center align-items-center about-container">
                <div className="card text-center about-card">
                    <div className="row">
                        <div className="col-lg-6 d-flex align-items-center justify-content-center">
                            {Array.isArray(data) && data.map((item) => (
                                <img key={item.id} src={item.image} alt="About Us" className="card-img-top img-fluid about-image" />
                            ))}
                        </div>
                        <div className="col-lg-6">
                            <div className="card-body" style={{ paddingTop: '3rem', paddingBottom: '2rem' }}>
                                {Array.isArray(data) && data.map((item) => (
                                    <div key={item.id}>
                                        <h2 className="card-title">About <span style={{ color: 'red' }}>Us</span></h2>
                                        <p className="card-text">{item.paragraph1}</p>
                                        <p className="card-text">{item.paragraph2}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ServicePage/>
            <HappyFurparentsPage/>
            <Footer/>
        </>  
    );
}

export default AboutPage;



