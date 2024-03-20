import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmile } from '@fortawesome/free-solid-svg-icons';
import './BookingComponent.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const BookingComponent = () => {
    const [petName, setPetName] = useState('');
    const [petId, setPetId] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [color, setColor] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [serviceTypes, setServiceTypes] = useState([]);
    const [petTypes, setPetTypes] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [showAlert, setShowAlert] = useState({}); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const serviceResponse = await axios.get('http://localhost:3001/serviceTypes');
                setServiceTypes(serviceResponse.data);

                const petResponse = await axios.get('http://localhost:3001/petTypes');
                setPetTypes(petResponse.data);

                const userResponse = await axios.get('http://localhost:3001/api/currentUserLoginId');
                setUserId(userResponse.data.userId);
                setUserEmail(userResponse.data.userEmail);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        fetchData();
    }, []);

    // Function to check if the user has existing bookings for the selected date
    const checkExistingBookings = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/existingBookings?userId=${userId}&date=${date}`);
            return response.data.hasExistingBookings; // Returns true if the user has existing bookings for the selected date
        } catch (error) {
            console.error('Error checking existing bookings: ', error);
            return false; // Return false in case of error
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedDateTime = new Date(`${date}T${time}`);
        const currentDateTime = new Date();
        if (selectedDateTime <= currentDateTime) {
            setShowAlert({ type: 'danger', message: 'Please select a future date and time for booking.' });
            return;
        }
        const selectedTime = Number(time.split(':')[0]);
        if (selectedTime >= 17) {
            setShowAlert({ type: 'danger', message: 'Please select a time before 5:00 PM for booking.' });
            return;
        }

        // Check if the user has already booked an appointment for the selected date
        const hasExistingBookings = await checkExistingBookings();
        if (hasExistingBookings) {
            setShowAlert({ type: 'danger', message: 'You have already booked an appointment for this date.' });
            return;
        }
        try {
            // No need to pass userEmail from state, use the one obtained from the backend
            const bookingResponse = await axios.post('http://localhost:3001/bookings', {
                petName,
                petId,
                breed,
                age,
                color,
                serviceId,
                date,
                time: time.split('-')[0],
                symptoms,
                userId,
                email: userEmail // Use the email obtained from the backend response
            });
            console.log(bookingResponse.data);

            await axios.post('http://localhost:3001/bookTimeSlot', {
                date,
                time: time.split('-')[0],
                userId,
                email: userEmail // Use the email obtained from the backend response
            });

            // Reset input fields after successful booking
            setPetName('');
            setPetId('');
            setBreed('');
            setAge('');
            setColor('');
            setServiceId('');
            setDate('');
            setTime('');
            setSymptoms('');

            // Show success alert
            setShowAlert({ type: 'success', message: 'Thanks for booking!' });
            // Reset showAlert after 3 seconds
            setTimeout(() => setShowAlert({}), 3000);
        } catch (error) {
            console.error(error);
            // Show error alert
            setShowAlert({ type: 'danger', message: 'Booking failed. Please try again later.' });
        }
    };

    const handleServiceChange = (e) => {
        setServiceId(e.target.value);
    };

    const handlePetChange = (e) => {
        setPetId(e.target.value);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setBookingSuccess(false);
    };

    const handleFetchTimeSlots = async () => {
        try {
            console.log("Fetching time slots for date:", date);
            const response = await axios.get(`http://localhost:3001/timeSlots?date=${date}`);
            const filteredTimeSlots = response.data.filter(slot => {
                const currentTime = new Date();
                const slotTime = new Date(`${date}T${slot.startTime}`);
                return slotTime > currentTime;
            });
            setAvailableTimeSlots(filteredTimeSlots);
        } catch (error) {
            console.error('Error fetching time slots: ', error);
        }
    };

    useEffect(() => {
        if (date) {
            handleFetchTimeSlots();
        }
    }, [date]);

    const handleAlertClose = () => {
        setShowAlert({});
    };

    return (
        <>
            <div className='bookingbackground'>
                <div className='top-alert-container '>
                    {showAlert.type && (
                        <div className={`alert alert-${showAlert.type} alert-dismissible fade show`} role="alert">
                            {showAlert.message}
                            <button type="button" className="btn-close" onClick={handleAlertClose} aria-label="Close"></button>
                        </div>
                    )}
                </div>
                <div className="booking-container">
                    <h2 className='text-center text-danger'>Make an Appointment</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="column">
                                <div className="input-group">
                                    <label className="booking-label">Pet Name:</label>
                                    <input className="booking-input" type="text" value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="Enter pet's name" required />
                                </div>
                                <div className="input-group">
                                    <label className="booking-label">Pet Type:</label>
                                    <select className="booking-select" value={petId} onChange={handlePetChange} required>
                                        <option value="">Select Pet Type</option>
                                        {petTypes.map(pet => (
                                            <option key={pet.petId} value={pet.petId}>{pet.petType}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="booking-label">Breed:</label>
                                    <input className="booking-input" type="text" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Enter pet's breed" required />
                                </div>
                                <div className="input-group">
                                    <label className="booking-label">Age:</label>
                                    <input className="booking-input" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter pet's age" required />
                                </div>
                                <div className="input-group">
                                    <label className="booking-label">Color:</label>
                                    <input className="booking-input" type="text" value={color} onChange={(e) => setColor(e.target.value)} placeholder="Enter pet's color" required />
                                </div>
                            </div>
                            <div className="column2">
                                <div className="input-group">
                                    <label className="booking-label">Date:</label>
                                    <input className="booking-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required />
                                </div>
                                <div className="input-group">
                                    <label className="booking-label">Time:</label>
                                    {availableTimeSlots.length === 0 ? (
                                        <p>No current time slots available for the selected date.</p>
                                    ) : (
                                        <select className="booking-select" value={time} onChange={(e) => setTime(e.target.value)} required>
                                            <option value="">Select Time</option>
                                            {availableTimeSlots.map(slot => (
                                                <option key={`${slot.startTime}-${slot.endTime}`} value={`${slot.startTime}-${slot.endTime}`}>{slot.startTime} - {slot.endTime}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                                <div className="input-group">
                                    <label className="booking-label">Select Service:</label>
                                    <select className="booking-select" value={serviceId} onChange={handleServiceChange} required>
                                        <option value="">Select Service</option>
                                        {serviceTypes.map(service => (
                                            <option key={service.serviceId} value={service.serviceId}>{service.serviceType}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label className="booking-label">Symptoms:</label>
                                    <textarea className="booking-textarea" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Enter symptoms or additional information" required />
                                </div>
                            </div>
                        </div>
                        <button className="booking-button" type="submit">Book Appointment</button>
                    </form>
                    <Modal
                        isOpen={showModal}
                        onRequestClose={handleCloseModal}
                        className="modal"
                        overlayClassName="modal-overlay"
                        ariaHideApp={false}
                    >
                        <div className="modal-content">
                            {bookingSuccess ? (
                                <h2><FontAwesomeIcon icon={faSmile} /> Thank you for booking!</h2>
                            ) : (
                                <h2>Booking failed!</h2>
                            )}
                            <button className="close-button" onClick={handleCloseModal}>Close</button>
                        </div>
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default BookingComponent;
