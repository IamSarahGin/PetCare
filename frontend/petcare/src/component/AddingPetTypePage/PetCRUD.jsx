import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNaviBar from '../NavigationAndDrawers/AdminNaviBar';
import './PetCRUD.css';

const PetCRUD = () => {
  const [pets, setPets] = useState([]);
  const [petType, setPetType] = useState('');
  const [updatePetId, setUpdatePetId] = useState(null);
  const [updatePetType, setUpdatePetType] = useState('');
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
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/pet');
      setPets(response.data);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  const handleCreatePet = async () => {
    try {
      await axios.post('http://localhost:3001/api/pet', { petType });
      setPetType('');
      fetchPets();
    } catch (error) {
      console.error('Error creating pet:', error);
    }
  };

  const handleUpdatePet = async () => {
    try {
      await axios.put(`http://localhost:3001/api/pet/${updatePetId}`, { petType: updatePetType });
      setUpdatePetId(null);
      setUpdatePetType('');
      fetchPets();
    } catch (error) {
      console.error('Error updating pet:', error);
    }
  };

  const handleDeletePet = async (petId) => {
    try {
      await axios.delete(`http://localhost:3001/api/pet/${petId}`);
      fetchPets();
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  return (
    <>
      {isAdmin ? (
        <div>
          <AdminNaviBar />
          <div className="pet-list-container">
            <div className="petCard">
              <div className="petCard-header"> <h4>Pet Management</h4></div>
              <div className="petCard-body">    
                <input
                  type="text"
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                  placeholder="Enter pet type"
                  style={{ marginRight: '10px' }}
                />
                <button onClick={handleCreatePet} style={{ backgroundColor: '#28a745' }}>Add Pet</button>                
                <table>
                  <thead>
                    <tr>
                      <th>Pet Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pets.map((pet) => (
                      <tr key={pet.petId}>
                        <td>{pet.petType}</td>
                        <td>
                          <button onClick={() => setUpdatePetId(pet.petId)}>Edit</button>
                          <button onClick={() => handleDeletePet(pet.petId)} style={{ backgroundColor: '#dc3545' }}>Delete</button>
                          {/* Red button */}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {updatePetId && (
                  <div>
                    <input
                      type="text"
                      value={updatePetType}
                      onChange={(e) => setUpdatePetType(e.target.value)}
                      placeholder="Enter updated pet type"
                      style={{ marginRight: '10px' }}
                    />
                    <button onClick={handleUpdatePet}>Update</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1>Access Denied PET CRUD. You must be an admin to view this page.</h1>
      )}
    </>
  );
};

export default PetCRUD;
