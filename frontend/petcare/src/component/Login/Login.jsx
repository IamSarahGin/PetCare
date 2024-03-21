import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Footer/Footer';
import '../Login/Login.css';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', values, { withCredentials: true });
      if (response.data.Status === "Success") {
        navigate(response.data.role === "user" ? '/welcome' : '/admin/dashboard');
      } else {
        setError(response.data.Error || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error('Login error:', error);
    }
  };

  return (<>
    <div className='loginBody'>
      <section className='login-container'>
        <div className='loginCard-container'>
          <div className="login-content">
            <h3 className='text-danger login-container-h3'>Login to your account</h3>
            <form onSubmit={handleSubmit} className='login-form'>
              <div className="form-group">
                <label htmlFor='email' className="label-left login-input" >Email</label>
                <input type="email" placeholder="Enter Email Address" name="email"
                  value={values.email}
                  onChange={e => setValues({ ...values, email: e.target.value })}
                  className='form-control login-input'
                  autoComplete='email' />
              </div>
              <div className="form-group">
                <label htmlFor='password' className="label-left login-input">Password</label>
                <input type="password" placeholder="Enter Password" name="password"
                  value={values.password}
                  onChange={e => setValues({ ...values, password: e.target.value })}
                  className='form-control login-input'
                  autoComplete='password' />
              </div>
              <div className='form-group'>
                <button type="submit" className='btn btn-primary w-100 rounded-0'>Login</button>
              </div>
              <div className='mb-3 form-group'>
                <p className="text-center text-danger">{error}</p>
                <p className="text-center">Don't have an account? <Link to="/register" className='text-danger text-decoration-none'>Sign Up</Link></p>
              </div>
            </form>
          </div>
          <div className="image-container">
            <img src={values.imageUrl} alt="Login Image" className="login-image" />
          </div>
        </div>
      </section>
    </div>
     <Footer/>
     </>
  );
};

export default Login;
