import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer/Footer';
import BookingList from '../Booking/BookingList';
import AccessDenied from '../AccessDeniedPage';
import './WelcomePage.css';
import UserNavi from '../NavigationAndDrawers/UserNavi';

const WelcomePage = () => {
  const [auth, setAuth] = useState(false);
  const [firstName, setFirstName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.get('http://localhost:3000/auth/status')
      .then(res => {
        console.log('Response from API:', res); 
        if (res.data.status === 'Success') {
          setAuth(true);
          setFirstName(res.data.firstName);
        } else {
          setAuth(false);
          navigate('/access-denied'); 
        }
      })
      .catch(err => {
        console.error('Error:', err);
        setAuth(false);
        navigate('/access-denied'); 
      });
  }, [navigate]);
  
  return (
    <div id="wrapper">
      {auth ? (
        <>
          <UserNavi />
          <div className='welcomeBackground welcome-container'>
            <div className="welcome-content">
              <h5 className="text-danger fs-3 text-center" style={{ marginTop: '20px' }}>Hi {firstName}!</h5>
              <BookingList />
            </div>
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
      <Footer className="Footer" />
    </div>
  );
};

export default WelcomePage;
