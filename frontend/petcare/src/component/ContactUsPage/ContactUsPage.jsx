import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import axios from 'axios';
import '../ContactUsPage/ContactUsPage.css'
import Alert from 'react-bootstrap/Alert';
import Footer from '../Footer/Footer';

const ContactUsPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [inquireAbout, setInquireAbout] = useState('');
  const [moreDetails, setMoreDetails] = useState('');
  const [showAlert, setShowAlert] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save inquiry to backend
      await axios.post('http://localhost:3000/contacts', {
        firstName,
        lastName,
        emailAddress,
        mobileNumber,
        inquireAbout,
        moreDetails,
      });

      // Send email
      const templateParams = {
        from_name: `${firstName} ${lastName}`,
        from_email: emailAddress,
        to_name: 'PetCare',
        message: moreDetails,
      };

      const serviceId = 'service_lozes0j'; 
      const templateId = 'template_htgsv6f'; 
      const publicKey = 'iRZv9nFQKU_JWs2zg'; 

      emailjs.send(serviceId, templateId, templateParams, publicKey)
        .then((response) => {
          console.log('Email sent successfully!', response);
          setShowAlert(true); 
        })
        .catch((error) => {
          console.error('Error sending email', error);
        });

      // Clear input fields
      setFirstName('');
      setLastName('');
      setEmailAddress('');
      setMobileNumber('');
      setInquireAbout('');
      setMoreDetails('');
    } catch (error) {
      console.error('Error saving inquiry:', error);
    }
  };

  return (
    <>
    <style>{`
        body {
          background-color: #f2f2f2; /* Adjust the color code as needed */
          margin: 0;
          padding: 0;
        }
      `}</style>
      <div className="top-alert-container">
        {/* Alert notification */}
        {showAlert && (
          <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
           <p className='text-center'>Email sent successfully!</p>
          </Alert>
        )}
      </div>
      <div className="contactUsBody">
  <section className="contact-us-container">
    <div className='contactUsCard-container'>
      <h1 className='mb-2' style={{ textAlign: 'center' }}>Contact <span className='contact-us-title'>Us</span></h1>
      <p style={{ textAlign: 'center' }}>Questions, bug reports, feedback - we’re here for it all.</p>
      <form onSubmit={handleSubmit} className='contact-us-form'>
        <div className="form-group">
          <div className="label-input">
            <label htmlFor='firstName'>First Name</label>
            <input type='text' id='firstName' placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="form-control" />
          </div>
          <div className="label-input">
            <label htmlFor='lastName'>Last Name</label>
            <input type='text' id='lastName' placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} required className="form-control" />
          </div>
        </div>
        <div className="form-group">
          <div className="label-input">
            <label htmlFor='emailAddress' className="label-input">Email Address</label>
            <input type='email' id='emailAddress' placeholder='Email Address' value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} required className="form-control" />
          </div>
          <div className="label-input">
            <label htmlFor='mobileNumber' className="label-input">Contact Number</label>
            <input type='tel' id='mobileNumber' placeholder='Contact Number' value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required className="form-control" />
          </div>
        </div>
        <div className="form-group">
          <div className="label-input">
            <label htmlFor='inquireAbout'>Inquire About</label>
            <input type='text' id='inquireAbout' placeholder='Inquire About' value={inquireAbout} onChange={(e) => setInquireAbout(e.target.value)} required className="form-control inquire-about-input" />
          </div>
        </div>
        <div className="form-group">
          <div className="label-input">
            <label htmlFor='moreDetails' className="label-input">More Details</label>
            <textarea id='moreDetails' placeholder='More Details' value={moreDetails} onChange={(e) => setMoreDetails(e.target.value)} className="form-control"></textarea>
          </div>
        </div>
        <button type='submit' className="btn btn-primary">Submit</button>
      </form>
    </div>   
  </section>
</div>

<Footer/>
    </>
  );
};

export default ContactUsPage;

