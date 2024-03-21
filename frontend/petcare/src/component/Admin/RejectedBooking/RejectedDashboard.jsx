import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RejectedBookings from './RejectedBookings';

const RejectedDashboard = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [approvedBookings, setPendingBookings]=useState([]);
  
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/user/profile', { withCredentials: true });
                const userData = response.data;
                const userRole = userData.role;
                setIsAdmin(userRole === 'admin');
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchPendingBookings = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/bookings/reject', { withCredentials: true });
                setPendingBookings(response.data);
            } catch (error) {
                console.error('Error fetching pending bookings:', error);
            }
        };

        if (isAdmin) {
            fetchPendingBookings();
        }
    }, [isAdmin]);

    return (
        <div>
            {isAdmin ? (
                <div>                 
                    <RejectedBookings/>
                </div>
            ) : (
                <h1>Access Denied REJECTED LIST. You must be an admin to view this page.</h1>
            )}
        </div>
    );
}

export default RejectedDashboard