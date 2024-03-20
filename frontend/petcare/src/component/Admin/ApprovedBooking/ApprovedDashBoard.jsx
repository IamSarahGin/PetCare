import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApprovedBookings from './ApprovedBookings';
import Footer from '../../Footer/Footer';

const ApprovedDashBoard = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [approvedBookings, setPendingBookings]=useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/user/profile', { withCredentials: true });
                const userData = response.data;
                const userRole = userData.role;
                setIsAdmin(userRole === 'admin');
            } catch (error) {
                console.error('Error fetching user data:', error);
                if (error.response && error.response.status === 401) {
                    // Unauthorized access, redirect to access denied page
                    navigate('/access-denied');
                }
            }
        };

        fetchUserData();
    }, [navigate]);
    useEffect(() => {
        const fetchPendingBookings = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/bookings/approved', { withCredentials: true });
                setPendingBookings(response.data);
            } catch (error) {
                console.error('Error fetching pending bookings:', error);
            }
        };

        if (isAdmin) {
            fetchPendingBookings();
        }
    }, [isAdmin]);
  
    return (<>
        <div>
            {isAdmin ? (
                <div> 
                    <ApprovedBookings/>
                </div>
            ) : (
                <h1>Access Denied APPROVED LIST. You must be an admin to view this page.</h1>
            )}
        </div>
        <Footer/>
        </>
    );
}

export default ApprovedDashBoard