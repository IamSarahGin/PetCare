import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './component/Home/Home';
import Login from './component/Login/Login';
import Register from './component/Register/Register';
import WelcomePage from './component/WelcomePage/WelcomePage';
import BookingPage from './component/Booking/BookingPage';
import CalendarWithAvailability from './component/Calendar/Calendar'
import InquirePage from './component/Inquire/InquirePage';
import AdminDashboard from './component/Admin/AdminDashboard'; 
import ApprovedDashBoard from './component/Admin/ApprovedBooking/ApprovedDashBoard';
import RejectedDashboard from './component/Admin/RejectedBooking/RejectedDashboard';
import AboutPage from './component/About/AboutPage';
import ContactUsPage from './component/ContactUsPage/ContactUsPage';
import PetCRUD from './component/AddingPetTypePage/PetCRUD';
import ServiceCRUD from './component/AddingServiceTypePage/ServiceCRUD';
import AccessDeniedPage from './component/AccessDeniedPage';
import Navibar from './component/NavigationAndDrawers/navibar'
import 'bootstrap/dist/css/bootstrap.css';


const App = () => {
  return (
<Router>
      <Navibar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/bookingVisitor" element={<CalendarWithAvailability />} />
      <Route path="/contact" element={<ContactUsPage/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/inquire" element={<InquirePage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/approved/list" element={<ApprovedDashBoard  />} />
      <Route path="/rejected/list" element={<RejectedDashboard />} />
      <Route path="/addPet" element={<PetCRUD />} />
      <Route path="/addService" element={<ServiceCRUD />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      </Routes>
    
    </Router>
  );
};

export default App;
