import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import Footer from '../Footer/Footer';
import './Register.css';

const Register = () => {
    const [values, setValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNumber: '',
        password: '',
        confirmPassword: '',
        imageUrl: ''
    });
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await axios.get('http://localhost:3001/loginpageandregisterpage');
                const imageUrl = response.data[0].image;
                setValues({ ...values, imageUrl });
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };
        fetchImage();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3001/register', values)
            .then(res => {
                if (res.data.Status === 'Success') {
                    setAlertMessage('Account created');
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000); 
                } else {
                    setAlertMessage(res.data.Error || 'Error occurred');
                }
            })
            .catch(err => console.error('Error:', err));
    };

    return (
        <>
            <section className="hero d-flex align-items-center mt-5 registerBackground">
                <div className="container mt-5 mb-4">
                    <div className="card border border-danger mb-3 cardSize">
                        <div className="row g-0">
                            <div className="col-md-12 offset-md-3">
                                <h3 className='text-danger mb-5 create-account'>Create Furparent Account</h3>
                                <div className="top-alert-container d-flex justify-content-center ">
                                    {/* Alert notification */}
                                    {alertMessage && (
                                       <Alert variant={alertMessage === 'Account created' ? 'success' : 'danger'} className="w-100" dismissible>
                                       {alertMessage}
                                   </Alert>
                                   
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card-body mt-5">
                                    <form onSubmit={handleSubmit}>
                                        <div className='mb-3 form'>
                                            <label htmlFor='firstName'>First Name</label>
                                            <input type="text" placeholder="Enter First Name" name="firstName"
                                                onChange={e => setValues({ ...values, firstName: e.target.value })} className='form-control' />
                                        </div>
                                        <div className='mb-3 form'>
                                            <label htmlFor='lastName'>Last Name</label>
                                            <input type="text" placeholder="Enter Last Name" name="lastName"
                                                onChange={e => setValues({ ...values, lastName: e.target.value })} className='form-control rounded-10' />
                                        </div>
                                        <div className='mb-3  form'>
                                            <label htmlFor='email' className='form-label'>Email</label>
                                            <input type="email" placeholder="Enter Email Address" name="email"
                                                onChange={e => setValues({ ...values, email: e.target.value })} className='form-control rounded-10' />
                                        </div>
                                        <div className='mb-3 form'>
                                            <label htmlFor='contactNumber'>Contact Number</label>
                                            <input type="text" placeholder="Enter Contact Number" name="contactNumber"
                                                onChange={e => setValues({ ...values, contactNumber: e.target.value })} className='form-control rounded-10' />
                                        </div>
                                        <div className='mb-3 form'>
                                            <label htmlFor='password' className='form-label'>Password</label>
                                            <input type="password" placeholder="Enter Password" name="password"
                                                onChange={e => setValues({ ...values, password: e.target.value })} className='form-control rounded-10' />
                                        </div>
                                        <div className='mb-3 form'>
                                            <label htmlFor='confirmPassword' className='form-label'>Confirm Password</label>
                                            <input type='password' placeholder='Confirm Password' name='confirmPassword'
                                                value={values.confirmPassword} onChange={e => setValues({ ...values, confirmPassword: e.target.value })}
                                                className='form-control rounded-10' />
                                        </div>
                                        <div className='mb-3 form'>
                                            <button type="submit" className='btn btn-primary w-100 rounded-0'>Sign Up</button>
                                        </div>
                                        <div className='mb-3 form'>
                                            <p className="text-center">Already have an account? <Link to="/login" className='text-danger text-decoration-none'>Log In</Link></p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-6 color1">
                                <img src={values.imageUrl} className="img-fluid rounded-start image" alt="PCMSLOGO" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer/>
        </>
    );
};

export default Register;
