import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PendingBooking.css';


const formatDate = (dateString) => {
    const options = { month: 'short', day: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options).toUpperCase();
};

const formatTime = (timeString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', options).toUpperCase();
};

const PendingBookings = ({ reloadPendingBookings }) => {
    const [pendingBookings, setPendingBookings] = useState([]);
    const [selectedBookingId, setSelectedBookingId] = useState(null);
    const [selectedAction, setSelectedAction] = useState('');
    const [bookingStatus, setBookingStatus] = useState({});
    const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); 
    useEffect(() => {
        const fetchPendingBookings = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/bookings/pending', { withCredentials: true });
                const fetchedPendingBookings = response.data;
                // Save pending bookings to local storage
                localStorage.setItem('pendingBookings', JSON.stringify(fetchedPendingBookings));
                // Initialize booking status for each booking
                const initialStatus = {};
                fetchedPendingBookings.forEach(booking => {
                    initialStatus[booking.bookingId] = booking.status; 
                });
                setPendingBookings(fetchedPendingBookings);
                setBookingStatus(initialStatus);
            } catch (error) {
                console.error('Error fetching pending bookings:', error);
            }
        };
        // Retrieve booking status from localStorage if available
        const storedStatus = JSON.parse(localStorage.getItem('bookingStatus'));
        if (storedStatus) {
            setBookingStatus(storedStatus);
        }
        // Fetch pending bookings on every render
        fetchPendingBookings();
    }, []); // Removed dependency array to fetch on every render

    const handleActionChange = (event) => {
        setSelectedAction(event.target.value);
        setSelectedBookingId(event.target.value.split('-')[1]); // Extracting bookingId from the selected value
    };
    const handleApproveOrRejectBooking = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        try {
            let updatedStatus = 'Pending';
            if (selectedAction && selectedBookingId) {
                if (selectedAction.startsWith('approve')) {
                    await axios.post('http://localhost:3001/api/bookings/approve', { bookingId: selectedBookingId }, { withCredentials: true });
                    updatedStatus = 'Approved';
                } else if (selectedAction.startsWith('reject')) {
                    await axios.post('http://localhost:3001/api/bookings/reject', { bookingId: selectedBookingId }, { withCredentials: true });
                    updatedStatus = 'Rejected';
                }
                updateBookingStatus(selectedBookingId, updatedStatus);
                localStorage.setItem('bookingStatus', JSON.stringify({ ...bookingStatus, [selectedBookingId]: updatedStatus }));
            } else {
                console.error('No action or booking ID selected.');
            }
        } catch (error) {
            console.error('Error handling booking action:', error);
        }
    };
    const updateBookingStatus = (bookingId, status) => {
        setBookingStatus(prevStatus => ({
            ...prevStatus,
            [bookingId]: status,
        }));
    };
    const handleViewDetails = (bookingId) => {
        const selectedBooking = pendingBookings.find(booking => booking.bookingId === bookingId);
        setSelectedBookingDetails(selectedBooking);
        alert(`Booking ID: ${selectedBooking.bookingId}\nPet Name: ${selectedBooking.petName}\nBreed: ${selectedBooking.breed}\nDate: ${formatDate(selectedBooking.date)}\nTime: ${formatTime(selectedBooking.time)}\nSymptoms: ${selectedBooking.symptoms}\nCustomer: ${selectedBooking.firstName} ${selectedBooking.lastName}\nEmail: ${selectedBooking.email}`);
    };
     // Pagination calculation
     const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentItems = pendingBookings.slice(indexOfFirstItem, indexOfLastItem);
    return (<>
        <div className="pending-bookings-container">
            <div className="card">
                <div className="card-header">
                    List of Appointments
                </div>
                <div className="card-body">
                    {pendingBookings.length === 0 ? (
                        <p>No pending bookings as of now...</p>
                    ) : (
                    <>
                        <table className="pending-bookings-table">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>Appointment Date</th>
                                    <th>Appointment Time</th>
                                    <th>Symptoms</th>
                                    <th>Customer</th>
                                    <th>Customer Email</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingBookings.map(booking => (
                                    <tr key={booking.bookingId}>
                                        <td>{booking.bookingId}</td>
                                        <td>{formatDate(booking.date)}</td>
                                        <td>{formatTime(booking.time)}</td>
                                        <td>{booking.symptoms}</td>
                                        <td>{`${booking.firstName} ${booking.lastName}`}</td>
                                        <td>{booking.email}</td>
                                        <td>{bookingStatus[booking.bookingId]}</td>
                                        <td>
                                            <select onChange={handleActionChange} value={selectedAction}>
                                                <option value="">Select Action</option>
                                                <option value={`approve-${booking.bookingId}`}>Approve</option>
                                                <option value={`reject-${booking.bookingId}`}>Reject</option>
                                            </select>
                                            <button className="action-button" onClick={handleApproveOrRejectBooking} disabled={!selectedBookingId || !selectedAction}>Submit</button>
                                            <button className="view-button" onClick={() => handleViewDetails(booking.bookingId)}>View Details</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {/* Pagination */}
                        <div className="pagination">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                        {Array.from({ length: Math.ceil(pendingBookings.length / itemsPerPage) }, (_, index) => (
                            <button key={index} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(pendingBookings.length / itemsPerPage)}>Next</button>
                    </div>
                    </>
                    )}
                </div>
            </div>
        </div> 
        </>
    );
};

export default PendingBookings;










































// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './PendingBooking.css';

// const formatDate = (dateString) => {
//     const options = { month: 'short', day: '2-digit', year: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-US', options).toUpperCase();
// };

// const formatTime = (timeString) => {
//     const options = { hour: 'numeric', minute: 'numeric', hour12: true };
//     return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', options).toUpperCase();
// };

// const PendingBookings = ({ reloadPendingBookings }) => {
//     const [pendingBookings, setPendingBookings] = useState([]);
//     const [selectedBookingId, setSelectedBookingId] = useState(null);
//     const [selectedAction, setSelectedAction] = useState('');

//     const [bookingStatus, setBookingStatus] = useState({});
//     const [selectedBookingDetails, setSelectedBookingDetails] = useState(null);

//     useEffect(() => {
//     const fetchPendingBookings = async () => {
//         try {
//             const response = await axios.get('http://localhost:3001/api/bookings/pending', { withCredentials: true });
//             const fetchedPendingBookings = response.data;

//             // Save pending bookings to local storage
//             localStorage.setItem('pendingBookings', JSON.stringify(fetchedPendingBookings));
//             localStorage.setItem('pendingBookingsFetched', true); // Set flag indicating data fetched from server

//             // Initialize booking status for each booking
//             const initialStatus = {};
//             fetchedPendingBookings.forEach(booking => {
//                 initialStatus[booking.bookingId] = booking.status; // Assuming status field exists in booking object
//             });

//             setPendingBookings(fetchedPendingBookings);
//             setBookingStatus(initialStatus);
//         } catch (error) {
//             console.error('Error fetching pending bookings:', error);
//         }
//     };

//     const savedPendingBookings = JSON.parse(localStorage.getItem('pendingBookings'));
//     const pendingBookingsFetched = JSON.parse(localStorage.getItem('pendingBookingsFetched'));
//     if (savedPendingBookings && savedPendingBookings.length > 0 && pendingBookingsFetched) {
//         // Initialize booking status from local storage
//         const initialStatus = {};
//         savedPendingBookings.forEach(booking => {
//             initialStatus[booking.bookingId] = booking.status; // Assuming status field exists in booking object
//         });

//         setPendingBookings(savedPendingBookings);
//         setBookingStatus(initialStatus);
//     } else {
//         fetchPendingBookings();
//     }
// }, []);

    
    
    

//     const handleActionChange = (event) => {
//         setSelectedAction(event.target.value);
//         setSelectedBookingId(event.target.value.split('-')[1]); // Extracting bookingId from the selected value
//     };

//     const handleApproveOrRejectBooking = async (event) => {
//         event.preventDefault(); // Prevent default form submission behavior
//         try {
//             let updatedStatus = 'Pending';
//             if (selectedAction && selectedAction.startsWith('approve')) {
//                 await axios.post('http://localhost:3001/api/bookings/approve', { bookingId: selectedBookingId }, { withCredentials: true });
//                 updatedStatus = 'Approved';
//             } else if (selectedAction && selectedAction.startsWith('reject')) {
//                 await axios.post('http://localhost:3001/api/bookings/reject', { bookingId: selectedBookingId }, { withCredentials: true });
//                 updatedStatus = 'Rejected';
//             }
//             updateBookingStatus(selectedBookingId, updatedStatus);
    
//             // Update pending bookings in local storage and state
//             const updatedPendingBookings = pendingBookings.map(booking =>
//                 booking.bookingId === selectedBookingId ? { ...booking, status: updatedStatus } : booking
//             );
//             setPendingBookings(updatedPendingBookings); // Update pendingBookings state with the latest status
    
//             localStorage.setItem('pendingBookings', JSON.stringify(updatedPendingBookings));
//         } catch (error) {
//             console.error('Error handling booking action:', error);
//         }
//     };
    
    
    
    
    
    
//     const updateBookingStatus = (bookingId, status) => {
//         setBookingStatus(prevStatus => ({
//             ...prevStatus,
//             [bookingId]: status,
//         }));
//     };

//     const handleViewDetails = (bookingId) => {
//         const selectedBooking = pendingBookings.find(booking => booking.bookingId === bookingId);
//         setSelectedBookingDetails(selectedBooking);
//         alert(`Booking ID: ${selectedBooking.bookingId}\nPet Name: ${selectedBooking.petName}\nBreed: ${selectedBooking.breed}\nDate: ${formatDate(selectedBooking.date)}\nTime: ${formatTime(selectedBooking.time)}\nSymptoms: ${selectedBooking.symptoms}\nCustomer: ${selectedBooking.firstName} ${selectedBooking.lastName}\nEmail: ${selectedBooking.email}`);
//     };

//     return (
//         <div className="pending-bookings-container">
//             <div className="card">
//                 <div className="card-header">
//                     List of Appointments
//                 </div>
//                 <div className="card-body">
//                     {pendingBookings.length === 0 ? (
//                         <p>No pending bookings as of now</p>
//                     ) : (
//                         <table className="pending-bookings-table">
//                             <thead>
//                                 <tr>
//                                     <th>Booking ID</th>
//                                     <th>Appointment Date</th>
//                                     <th>Appointment Time</th>
//                                     <th>Symptoms</th>
//                                     <th>Customer</th>
//                                     <th>Customer Email</th>
//                                     <th>Status</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {pendingBookings.map(booking => (
//                                     <tr key={booking.bookingId}>
//                                         <td>{booking.bookingId}</td>
//                                         <td>{formatDate(booking.date)}</td>
//                                         <td>{formatTime(booking.time)}</td>
//                                         <td>{booking.symptoms}</td>
//                                         <td>{`${booking.firstName} ${booking.lastName}`}</td>
//                                         <td>{booking.email}</td>
//                                         <td>{bookingStatus[booking.bookingId]}</td>
//                                         <td>
//                                             <select onChange={handleActionChange} value={selectedAction}>
//                                                 <option value="">Select Action</option>
//                                                 <option value={`approve-${booking.bookingId}`}>Approve</option>
//                                                 <option value={`reject-${booking.bookingId}`}>Reject</option>
//                                             </select>
//                                             <button className="action-button" onClick={handleApproveOrRejectBooking} disabled={!selectedBookingId || !selectedAction}>Submit</button>
//                                             <button className="view-button" onClick={() => handleViewDetails(booking.bookingId)}>View Details</button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PendingBookings;

