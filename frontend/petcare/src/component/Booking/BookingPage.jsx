import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BookingComponent from './BookingComponent';
import Footer from '../Footer/Footer';
import AccessDenied from '../AccessDeniedPage';
import UserNavi from '../NavigationAndDrawers/UserNavi';

const BookingPage = () => {
    const [auth, setAuth] = useState(false);
    const [message, setMessage] = useState('');
    const [firstName, setFirstName] = useState('');
    const [loginId, setLoginId] = useState(null);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get('http://localhost:3000')
            .then(res => {
                if (res.data.Status === "Success") {
                    setAuth(true);
                    setFirstName(res.data.firstName);
                    setEmail(res.data.email);
                } else {
                    setAuth(false);
                    setMessage(res.data.Error);
                    navigate('/access-denied');
                }
            })
            .catch(err => {
                console.error('Error:', err);
                setAuth(false);
                navigate('/access-denied');
            });
    }, [navigate]);

    useEffect(() => {
        fetchCurrentUserLoginId();
    }, []);

    const fetchCurrentUserLoginId = async () => {
        try {
            // Perform a request to fetch the current user's login ID
            const response = await axios.get('http://localhost:3000/api/currentUserLoginId');
            setLoginId(response.data.userId);
        } catch (error) {
            console.error('Error fetching login ID:', error);
        }
    };

    return (
        <div>
            {
                auth ? (
                    <>
                        <UserNavi />
                        <BookingComponent />
                    </>
                ) : (
                    <AccessDenied />
                )
            }
            <Footer />
        </div>
    );
};

export default BookingPage;
