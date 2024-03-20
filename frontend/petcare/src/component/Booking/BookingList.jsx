import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import './BookingList.css';


const BookingList = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        // Fetch bookings data
        axios.get('http://localhost:3001/bookings')
            .then(response => {
                setBookings(response.data);
            })
            .catch(error => {
                console.error('Error fetching bookings:', error);
            });
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
            "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
        ];
        const month = monthNames[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';

        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
        const formattedMinute = minute.toString().padStart(2, '0');
        return `${formattedHour}:${formattedMinute} ${ampm}`;
    };

    return (
        <TableContainer component={Paper} className="booking-list-container">
            <h3>List of Request</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Pet Name</TableCell>
                        <TableCell>Breed</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Color</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Symptoms</TableCell>
                        <TableCell>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {bookings.map(booking => (
                        <TableRow key={booking.bookingId}>
                            <TableCell>{booking.petName}</TableCell>
                            <TableCell>{booking.breed}</TableCell>
                            <TableCell>{booking.age}</TableCell>
                            <TableCell>{booking.color}</TableCell>
                            <TableCell>{formatDate(booking.date)}</TableCell>
                            <TableCell>{formatTime(booking.time)}</TableCell>
                            <TableCell>{booking.symptoms}</TableCell>
                            <TableCell>{booking.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BookingList;




























// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './BookingList.css';

// const BookingList = () => {
//     const [bookings, setBookings] = useState([]);

//     useEffect(() => {
//         // Fetch bookings data
//         axios.get('http://localhost:3001/bookings')
//             .then(response => {
//                 setBookings(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching bookings:', error);
//             });
//     }, []);

//         const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
//             "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
//         ];
//         const month = monthNames[date.getMonth()];
//         const day = date.getDate();
//         const year = date.getFullYear();
//         return `${month}-${day}-${year}`;
//     };

//     const formatTime = (timeString) => {
//         if (!timeString) return ''; 
    
//         const [hours, minutes] = timeString.split(':');
//         const hour = parseInt(hours, 10);
//         const minute = parseInt(minutes, 10);
//         const ampm = hour >= 12 ? 'pm' : 'am';
//         const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
//         const formattedMinute = minute.toString().padStart(2, '0');
//         return `${formattedHour}:${formattedMinute} ${ampm}`;
//     };

//     return (
//         <div className="booking-list-container">
//             <h2>Booking List</h2>
//             {bookings.length === 0 ? (
//                 <p>No bookings available</p>
//             ) : (
//                 <table>
//                     <thead>
//                         <tr>
//                         <th>Pet Name</th>
//                         <th>Breed</th>
//                         <th>Age</th>
//                        <th>Color</th>
//                         <th>Date</th>
//                         <th>Time</th>
//                          <th>Symptoms</th>
//                          <th>Status</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {bookings.map(booking => (
//                         <tr key={booking.bookingId}>
//                             <td>{booking.petName}</td>
//                             <td>{booking.breed}</td>
//                             <td>{booking.age}</td>
//                             <td>{booking.color}</td>
//                             <td>{formatDate(booking.date)}</td>
//                             <td>{formatTime(booking.time)}</td>
//                             <td>{booking.symptoms}</td>
//                             <td>{booking.status}</td>
//                         </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//         </div>
//     );
// };

// export default BookingList;
























// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './BookingList.css';

// const BookingList = () => {
//     const [bookings, setBookings] = useState([]);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(5); 
//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             axios.get('http://localhost:3001/bookings', {
//                 headers: {
//                     Authorization: `Bearer ${token}`
//                 }
//             })
//             .then(response => {
//                 setBookings(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching bookings:', error);
//             });
//         }
//     }, []);
    

//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
//             "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
//         ];
//         const month = monthNames[date.getMonth()];
//         const day = date.getDate();
//         const year = date.getFullYear();
//         return `${month}-${day}-${year}`;
//     };

//     const formatTime = (timeString) => {
//         if (!timeString) return ''; 
    
//         const [hours, minutes] = timeString.split(':');
//         const hour = parseInt(hours, 10);
//         const minute = parseInt(minutes, 10);
//         const ampm = hour >= 12 ? 'pm' : 'am';
//         const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
//         const formattedMinute = minute.toString().padStart(2, '0');
//         return `${formattedHour}:${formattedMinute} ${ampm}`;
//     };
    
//     // Pagination calculation
//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = bookings.slice(indexOfFirstItem, indexOfLastItem);

//     return (
      
//         <div className="booking-list-container" >
//              <div className='card'>
//                 <div className="card-header">Booking List</div>
//                 <div className='card-body'>
//             {bookings.length === 0 ? (
//                         <p>No list of bookings as of now...</p>
//                     ) : (
//                         <>
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Pet Name</th>
//                         <th>Breed</th>
//                         <th>Age</th>
//                         <th>Color</th>
//                         <th>Date</th>
//                         <th>Time</th>
//                         <th>Symptoms</th>
//                         <th>Status</th>
//                     </tr>
//                 </thead>

//                 <tbody>
//                     {bookings.map(booking => (
//                         <tr key={booking.bookingId}>
//                             <td>{booking.petName}</td>
//                             <td>{booking.breed}</td>
//                             <td>{booking.age}</td>
//                             <td>{booking.color}</td>
//                             <td>{formatDate(booking.date)}</td>
//                             <td>{formatTime(booking.time)}</td>
//                             <td>{booking.symptoms}</td>
//                             <td>{booking.status}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//             {/* Pagination */}
//                 <div className="pagination">
//                         <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
//                         {Array.from({ length: Math.ceil(bookings.length / itemsPerPage) }, (_, index) => (
//                             <button key={index} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
//                         ))}
//                         <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(bookings.length / itemsPerPage)}>Next</button>
//                     </div>
//                     </>
//                     )}
//         </div>
//         </div>
//         </div>
        
//     );
// };

// export default BookingList;

