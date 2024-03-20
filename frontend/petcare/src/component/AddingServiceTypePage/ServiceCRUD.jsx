import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ServiceCRUD.css';
import AdminNaviBar from '../NavigationAndDrawers/AdminNaviBar';

const ServiceCRUD = () => {
  const [services, setServices] = useState([]);
  const [serviceType, setServiceType] = useState('');
  const [updateServiceId, setUpdateServiceId] = useState(null);
  const [updateServiceType, setUpdateServiceType] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user/profile', { withCredentials: true });
        const userData = response.data;
        const userRole = userData.role;
        setIsAdmin(userRole === 'admin');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:3001/serviceTypes');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleCreateService = async () => {
    try {
      await axios.post('http://localhost:3001/services', { serviceType });
      setServiceType('');
      fetchServices();
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleUpdateService = async () => {
    try {
      await axios.put(`http://localhost:3001/service/${updateServiceId}`, { serviceType: updateServiceType });
      setUpdateServiceId(null);
      setUpdateServiceType('');
      fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await axios.delete(`http://localhost:3001/service/${serviceId}`);
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <>
      {isAdmin ? (
        <div>
          <AdminNaviBar />
          <div className="service-list-container">
            <div className="serviceCard">
              <div className="serviceCard-header"> <h4>Service Management</h4></div>
              <div className="serviceCard-body">             
                <input
                  type="text"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  placeholder="Enter service type"
                  style={{ marginRight: '10px' }}
                />
                <button onClick={handleCreateService} style={{ backgroundColor: '#28a745' }}>Add Pet</button>
                <table>
                  <thead>
                    <tr>
                      <th>Service Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.serviceId}>
                        <td>{service.serviceType}</td>
                        <td>
                          <button onClick={() => setUpdateServiceId(service.serviceId)}>Edit</button>
                          <button onClick={() => handleDeleteService(service.serviceId)} style={{ backgroundColor: '#dc3545' }}>Delete</button>
                          {/* Red button */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {updateServiceId && (
                  <div>
                    <input
                      type="text"
                      value={updateServiceType}
                      onChange={(e) => setUpdateServiceType(e.target.value)}
                      placeholder="Enter updated service type"
                      style={{ marginRight: '10px' }}
                    />
                    <button onClick={handleUpdateService}>Update</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1>Access Denied SERVICECRUD. You must be an admin to view this page.</h1>
      )}
    </>
  );
};

export default ServiceCRUD;
