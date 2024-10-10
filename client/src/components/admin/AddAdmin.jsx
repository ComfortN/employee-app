import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import Popup from '../popup/Popup';
import { storage } from '../../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddAdmin = ({ onAdminAdded, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('default-avatar.png');

    const [newAdmin, setNewAdmin] = useState({
        email: '',
        password: '',
        name: '',
        surname: '',
        age: '',
        idNumber: '',
        role: 'admin',
        image: ''
    });


    // Function to handle form input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files[0]) {
            setImageFile(files[0]);
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setNewAdmin(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
        
    };


    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let imageUrl = '';
            if (imageFile) {
                const storageRef = ref(storage, `admin_images/${newAdmin.idNumber}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            const adminData = { ...newAdmin, image: imageUrl };

            await axios.post('http://localhost:5000/api/admin/add', adminData);
            onAdminAdded();
            showAlert('Admin added successful.')
            onClose();
        } catch (error) {
            console.error("Error adding admin: ", error);
            showAlert('Error adding admin successful.')
        } finally {
            setLoading(false);
        }
    };


    const showAlert = (message) => {
        setPopupMessage(message);
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
    };


    return (
        <>
        {showPopup.show && <Popup message={popupMessage} />}
        <form onSubmit={handleSubmit} className='form-container'>
            <div className="image-container">
                <img src={imagePreview} alt="Profile Preview" style={{width: '100px', height: '100px', objectFit: 'cover'}} />
                <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                />
                </div>
            <input
                type="email" name="email" value={newAdmin.email}
                onChange={handleChange} placeholder="Email"
                required />
            <input
                type="password" name="password" value={newAdmin.password}
                onChange={handleChange} placeholder="Password"
                required />
            <input type="text" name="name" value={newAdmin.name}
                onChange={handleChange} placeholder="Name"
                required />
            <input type="text" name="surname" value={newAdmin.surname}
                onChange={handleChange} placeholder="Surname"
                required />
            <input type="number" name="age" value={newAdmin.age}
                onChange={handleChange} placeholder="Age"
                required />
            <input type="text" name="idNumber" value={newAdmin.idNumber}
                onChange={handleChange} placeholder="ID Number"
                required />
            <div className="button-group">
                <button type="submit">Add Admin</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </div>
        </form>
        </>
    );
};

export default AddAdmin;