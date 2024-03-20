import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PendingBookings from './PendingBooking/PendingBookings';
import AccessDenied from '../AccessDeniedPage'
import { useNavigate } from 'react-router-dom';
import AdminNaviBar from '../NavigationAndDrawers/AdminNaviBar';

const AdminDashboard = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [pendingBookings, setPendingBookings] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/profile', { withCredentials: true });
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
                const response = await axios.get('http://localhost:3000/api/bookings/pending', { withCredentials: true });
                setPendingBookings(response.data);
            } catch (error) {
                console.error('Error fetching pending bookings:', error);
            }
        };

        if (isAdmin) {
            fetchPendingBookings();
        }
    }, [isAdmin]);

    const handleApproveBooking = async (bookingId) => {
        try {
            await axios.post('http://localhost:3000/api/bookings/approve', { bookingId }, { withCredentials: true });
            updateBookingStatus(bookingId, 'Approved');
        } catch (error) {
            console.error('Error approving booking:', error);
        }
    };

    const handleRejectBooking = async (bookingId) => {
        try {
            await axios.post('http://localhost:3000/api/bookings/reject', { bookingId }, { withCredentials: true });
            updateBookingStatus(bookingId, 'Rejected');
        } catch (error) {
            console.error('Error rejecting booking:', error);
        }
    };

    const updateBookingStatus = (bookingId, status) => {
        const updatedPendingBookings = pendingBookings.map(booking =>
            booking.bookingId === bookingId ? { ...booking, status: status } : booking
        );
        setPendingBookings(updatedPendingBookings);
    };

    return (<>
        <div>
            {isAdmin ? (
                <div>
                    <AdminNaviBar/>
                    {/* <AppointmentList/> */}
                    <PendingBookings
                        pendingBookings={pendingBookings}
                        handleApproveBooking={handleApproveBooking}
                        handleRejectBooking={handleRejectBooking}
                    />
                </div>
            ) : (
                <AccessDenied /> 
            )}
        </div>
        </>
    );
};

export default AdminDashboard;















// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import PendingBookings from './PendingBooking/PendingBookings';
// import { useNavigate } from 'react-router-dom';
// import AdminNavigationBar from './AdminNavigationBar/AdminNavigationBar';

// const AdminDashboard = () => {
//     const [isAdmin, setIsAdmin] = useState(false);
//     const [pendingBookings, setPendingBookings] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 const response = await axios.get('http://localhost:3001/api/user/profile', { withCredentials: true });
//                 const userData = response.data;
//                 const userRole = userData.role;
//                 setIsAdmin(userRole === 'admin');
//             } catch (error) {
//                 console.error('Error fetching user data:', error);
//                 if (error.response && error.response.status === 401) {
//                     // Unauthorized access, redirect to login
//                     navigate('/login');
//                 }
//             }
//         };

//         fetchUserData();
//     }, [navigate]);

//     const fetchPendingBookings = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/api/bookings/pending', { withCredentials: true });
//             setPendingBookings(response.data);
//         } catch (error) {
//             console.error('Error fetching pending bookings:', error);
//         }
//     };

//     const reloadPendingBookings = () => {
//         fetchPendingBookings(); // Refetch pending bookings
//     };

//     const handleApproveBooking = async (bookingId) => {
//         try {
//             await axios.post('http://localhost:3001/api/bookings/approve', { bookingId }, { withCredentials: true });
//             reloadPendingBookings(); // Reload pending bookings after approval
//             navigate('/approved/list'); // Navigate to the approved list
//         } catch (error) {
//             console.error('Error approving booking:', error);
//         }
//     };

//     const handleRejectBooking = async (bookingId) => {
//         try {
//             await axios.post('http://localhost:3001/api/bookings/reject', { bookingId }, { withCredentials: true });
//             reloadPendingBookings(); // Reload pending bookings after rejection
//             navigate('/rejected/list'); // Navigate to the rejected list
//         } catch (error) {
//             console.error('Error rejecting booking:', error);
//         }
//     };

//     return (
//         <div>
//             {isAdmin ? (
//                 <div>
//                     <AdminNavigationBar />
//                     <PendingBookings
//                         pendingBookings={pendingBookings}
//                         handleApproveBooking={handleApproveBooking}
//                         handleRejectBooking={handleRejectBooking}
//                         reloadPendingBookings={reloadPendingBookings}
//                     />
//                 </div>
//             ) : (
//                 <h1>Access Denied. You must be an admin to view this page.</h1>
//             )}
//         </div>
//     );
// };

// export default AdminDashboard;
