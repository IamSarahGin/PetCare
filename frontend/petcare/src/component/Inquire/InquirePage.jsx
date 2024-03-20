import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InquireComponent from './InquireComponent';
import Footer from '../Footer/Footer';
import AccessDenied from '../AccessDeniedPage'
import UserNavi from '../NavigationAndDrawers/UserNavi';

const InquirePage = () => {
    const [auth,setAuth] = useState(false);
    const [message ,setMessage] = useState('')
    const [firstName,setfirstName] = useState('')
    const [loginId,setLoginId]= useState(null)
    const [email,setEmail] = useState('')
    const navigate = useNavigate();
    axios.defaults.withCredentials=true;
    useEffect(()=>{
        axios.get('http://localhost:3000')
        .then(res =>{
          if(res.data.Status==="Success"){
            setAuth(true)
            setfirstName(res.data.firstName)
            setEmail(res.data.email)
          }else{
            setAuth(false)
            setMessage(res.data.Error)
            navigate('/access-denied'); 
          }
        })
        .catch(err => {
          console.error('Error:', err);
          setAuth(false);
          navigate('/access-denied');
        });
      },[navigate])
  
  
      useEffect(() => {
        fetchCurrentUserLoginId();
      }, []);
    
      const fetchCurrentUserLoginId = async () => {
        try {
          // Perform a request to fetch the current user's login ID
          const response = await axios.get('http://localhost:3000/api/currentUserLoginId');
          setLoginId(response.data.userId);
        } catch (error) {
          console.error('Error fetching login ID:', error);
        }
    }
  return (
    <>
    {
     auth?
     <div>
       <UserNavi/>
       <InquireComponent/>
       <Footer/>
     </div>
     :
     <div>
        <AccessDenied /> 
     </div>
   }</>
  )
}

export default InquirePage