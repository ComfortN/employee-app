import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../../firebase/firebase';
import { signInWithCustomToken } from 'firebase/auth'
import './login.css';
import Popup from '../popup/Popup';

export default function Login({ onLogin, setLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();


  // Function to handle the login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', { email, password });
      const { token } = response.data;
      
      // Sign in to Firebase with the custom token
      await signInWithCustomToken(auth, token);
      console.log(token)
      
      showAlert('Login successful!');
      setTimeout(() => {
        onLogin();
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.response?.data || 'An error occurred during login');
      console.log(error)
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
      {showPopup && <Popup message={popupMessage} />}
      <div className='login'>

        <div className="loginSide">
          <div className="pic">
            <img src="Green Simple Eco Energy Logo1.png" alt="logo" />
          </div>
        </div>
        <div className="loginForm">
          <h1>LOGIN</h1>
          {error && <p className="error">{error}</p>}
          <form className='theForm' onSubmit={handleLogin}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="EMAIL" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="PASSWORD" required />
            <button type="submit" className="opacity">SUBMIT</button>
          </form>
        </div>
      </div>
    </>
  );
}