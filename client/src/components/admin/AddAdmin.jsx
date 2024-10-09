import React, { useState } from 'react';
import axios from 'axios';

const AddAdmin = ({ onAdminAdded, onClose }) => {
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
    age: '',
    idNumber: '',
    role: 'admin'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/admin/add', newAdmin);
      onAdminAdded();
      onClose();
    } catch (error) {
      console.error("Error adding admin: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='form-container'>
      <input
        type="email"
        name="email"
        value={newAdmin.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={newAdmin.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <input
        type="text"
        name="name"
        value={newAdmin.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="text"
        name="surname"
        value={newAdmin.surname}
        onChange={handleChange}
        placeholder="Surname"
        required
      />
      <input
        type="number"
        name="age"
        value={newAdmin.age}
        onChange={handleChange}
        placeholder="Age"
        required
      />
      <input
        type="text"
        name="idNumber"
        value={newAdmin.idNumber}
        onChange={handleChange}
        placeholder="ID Number"
        required
      />
      <div className="button-group">
        <button type="submit">Add Admin</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
};

export default AddAdmin;