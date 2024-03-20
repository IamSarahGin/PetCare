import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNaviBar from '../../NavigationAndDrawers/AdminNaviBar';
import '../ApprovedBooking/ApprovedBooking.css';

const formatDate = (dateString) => {
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options).toUpperCase();
};

const formatTime = (timeString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', options).toUpperCase();
};

const ApprovedBookings = ({ isAdmin }) => {
    const [approvedBookings, setApprovedBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); 
    useEffect(() => {
        fetchApprovedBookings();
    }, []);

    const fetchApprovedBookings = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/bookings/approved', { withCredentials: true });
            setApprovedBookings(response.data);
        } catch (error) {
            console.error('Error fetching approved bookings:', error);
        }
    };
     // Pagination calculation
     const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentItems = approvedBookings.slice(indexOfFirstItem, indexOfLastItem);
    return (
        <>
            <AdminNaviBar />
            <div className="approved-bookings-container">
                <div className='card'>
            <div className="card-header">Approved Bookings</div>
            <div className='card-body'>
            {approvedBookings.length === 0 ? (
                        <p>No approved bookings as of now...</p>
                    ) : (<>
            <table className="approved-bookings-table">
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Pet Name</th>
                        <th>Breed</th>
                        <th>Appointment Date</th>
                        <th>Appointment Time</th>
                        <th>Symptoms</th>
                        <th>Customer</th>
                        <th>Customer Email</th>
                    </tr>
                </thead>
                <tbody>
                    {approvedBookings.map(booking => (
                        <tr key={booking.bookingId}>
                            <td>{booking.bookingId}</td>
                            <td>{booking.petName}</td>
                            <td>{booking.breed}</td>
                            <td>{formatDate(booking.date)}</td>
                            <td>{formatTime(booking.time)}</td>
                            <td>{booking.symptoms}</td>
                            <td>{`${booking.firstName} ${booking.lastName}`}</td>
                            <td>{booking.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                        {Array.from({ length: Math.ceil(approvedBookings.length / itemsPerPage) }, (_, index) => (
                            <button key={index} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(approvedBookings.length / itemsPerPage)}>Next</button>
                    </div>
            </>
            )
            }           
            </div>
        </div>
        </div>
        </>
    );
};

export default ApprovedBookings;

