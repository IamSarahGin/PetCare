import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';

const AppointmentList = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/bookings/pending', {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setPendingBookings(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await axios.post(`http://localhost:3001/api/bookings/update-status/${bookingId}/${newStatus}`, {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Update the status in the state without fetching again from backend
      const updatedBookings = pendingBookings.map(booking => {
        if (booking.bookingId === bookingId) {
          return { ...booking, status: newStatus };
        }
        return booking;
      });
      setPendingBookings(updatedBookings);
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  return (
    <div>
      <h2>Pending Bookings</h2>
      {error && <div>Error: {error}</div>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingBookings.map((booking, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{booking.firstName} {booking.lastName}</td>
              <td>{booking.email}</td>
              <td>{booking.date}</td>
              <td>{booking.time}</td>
              <td>{booking.status}</td>
              <td>
                <button onClick={() => updateBookingStatus(booking.bookingId, 'approved')}>Approve</button>
                <button onClick={() => updateBookingStatus(booking.bookingId, 'rejected')}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AppointmentList;




