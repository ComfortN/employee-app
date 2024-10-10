import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../../firebase/firebase';
import Loader from '../Loader/Loader';
import './AdminProfile.css'; // Import your styles

const AdminProfile = ({ adminDetails, setAdminDetails }) => {
  const [editing, setEditing] = useState(false);
  const [localProfile, setLocalProfile] = useState(adminDetails);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setLocalProfile(adminDetails);
    setImagePreview(adminDetails?.image || null);
  }, [adminDetails]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = await auth.currentUser.getIdToken();
      await axios.put('http://localhost:5000/api/admin/profile', localProfile, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAdminDetails(localProfile);
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setLocalProfile({ ...localProfile, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!localProfile) return <div><Loader /></div>;

  return (
    <div>
      <h2>Admin Profile</h2>
      {editing ? (
        <form onSubmit={handleUpdate} className="form-container">
          <div className="image-container">
            <img 
              src={imagePreview || '/default-avatar.png'} 
              alt="Profile" 
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <input
            type="text"
            value={localProfile.name}
            onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
            placeholder="Name"
          />
          <input
            type="text"
            value={localProfile.surname}
            onChange={(e) => setLocalProfile({ ...localProfile, surname: e.target.value })}
            placeholder="Surname"
          />
          <input
            type="number"
            value={localProfile.age}
            onChange={(e) => setLocalProfile({ ...localProfile, age: e.target.value })}
            placeholder="Age"
          />
          <input
            type="text"
            value={localProfile.idNumber}
            onChange={(e) => setLocalProfile({ ...localProfile, idNumber: e.target.value })}
            placeholder="ID Number"
          />
          <div className="button-group">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="form-container">
          <div className="image-container">
            <img 
              src={localProfile.image || '/default-avatar.png'} 
              alt="Profile" 
            />
          </div>
          <p>Name: {localProfile.name} {localProfile.surname}</p>
          <p>Age: {localProfile.age}</p>
          <p>ID Number: {localProfile.idNumber}</p>
          <p>Role: {localProfile.role}</p>
          <div className="button-group">
            <button onClick={() => setEditing(true)}>Edit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
