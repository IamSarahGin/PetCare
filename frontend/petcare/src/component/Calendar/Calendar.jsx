import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Calendar.css'; 
import Footer from '../Footer/Footer';
import Alert from 'react-bootstrap/Alert';

const CalendarWithAvailability = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [timeSlots, setTimeSlots] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/timeSlots?date=${date}`);
        setTimeSlots(response.data);
      } catch (error) {
        console.error('Error fetching time slots:', error);
      }
    };

    fetchTimeSlots();
  }, [date]);

  const handleTimeSlotClick = (startTime) => {
    if (isLoggedIn) {
      console.log('Booking time slot at', startTime);
    } else {
      setShowAlert(true);
    }
  };

  return (
    <>
      <div className="top-alert-container">
        {showAlert && (
          <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
            <p className='text-center'>PLEASE LOGIN/REGISTER FIRST</p>
          </Alert>
        )}
      </div>
      <div className="container">
        <div className="calendarContainer border-danger animated fadeIn">
          <div className="calendar">
            <div className="calendar-header">
              <h1>Available Time Slots for {formatDate(date)}</h1>
            </div>
            <div className="calendar-date-picker">
              <label htmlFor="datePicker">Select Date:</label>
              <input
                type="date"
                id="datePicker"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="time-slots">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  className="time-slot-button"
                  onClick={() => handleTimeSlotClick(slot.startTime)}
                >
                  {slot.startTime} - {slot.endTime}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CalendarWithAvailability;
