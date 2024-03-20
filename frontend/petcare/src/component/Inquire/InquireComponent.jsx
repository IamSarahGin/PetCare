import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import axios from 'axios';
import './InquireComponent.css';

const InquireComponent = () => {
  const [message, setMessage] = useState('');
  const [inquire, setInquire] = useState('');
  const [description, setDescription] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('http://localhost:3001/auth/status', { withCredentials: true });
      setCurrentUser(response.data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const sendEmail = () => {
    // Ensure that currentUser is not null before sending email
    if (!currentUser) return;

    const templateParams = {
      from_name: currentUser.firstName,
      from_email: currentUser.email,
      to_name: 'PetCare',
      message: message,
    };

    const serviceId = 'service_lozes0j'; 
    const templateId = 'template_htgsv6f'; 
    const publicKey = 'iRZv9nFQKU_JWs2zg'; 

    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('Email sent successfully!', response);
        setMessage('');
          alert('Email sent successfully!'); 
      })
      .catch((error) => {
        console.error('Error sending email', error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Save inquiry to backend
    try {
      await axios.post('http://localhost:3001/inquiries', {
        inquire: inquire,
        description: description,
        message: message,
        userId: currentUser.userId,
        userEmail: currentUser.email,
      });
  
      // Clear input fields
      setInquire('');
      setDescription('');
      setMessage('');
  
      // Send email
      sendEmail();
    } catch (error) {
      console.error('Error saving inquiry:', error);
    }
  };
  
  return (
    <section className='inquirebackground'>
      <div className='inquireContainer'>
        <h3 className='text-danger'>Ask Us A Question</h3>
        <form onSubmit={handleSubmit} className='emailForm'>
        <input 
        type ="text"
         placeholder='Inquire About' 
        value={inquire}
        onChange={(e)=>setInquire(e.target.value)}
        required/>
       <input 
        type ="test" 
        placeholder='Short Description' 
       value={description}
       onChange={(e)=>setDescription(e.target.value)}         required/>
          <textarea
            cols="30"
            rows="10"
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          >          
          </textarea>
          <button type='submit'>Send Email</button>
        </form>
      </div>
    </section>
  );
};

export default InquireComponent;




