import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
import './login.css'
import Popup from '../popup/Popup';
import React, {useState} from 'react';



export default function Login({onLogin, setLoading}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  // const handleLogin = () => {
  // const storedUsername = 'admin'
  // const storedPassword = 'admin123';

  // setLoading(true);

  // setTimeout(() => {

  // if (username === storedUsername && password === storedPassword) {
  //   showAlert('Login successfully!..');
  //     setTimeout(() => {
  //       onLogin();
  //       navigate('/')
  //     }, 2000);
     
  // } else {
  //     setError('Invalid username or password');
  //   }
  //   setLoading(false);
  //   },  2000);
  // };


  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showAlert('Login successful!');
      setTimeout(() => {
        onLogin();
        navigate('/');
      }, 2000);
    } catch (error) {
      setError(error.message);
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
            
            <form className='theForm'  onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="EMAIL" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="PASSWORD" required/>
                <button onClick={handleLogin} className="opacity">SUBMIT</button>
            </form>
        </div>
    </div>
    </>
    
  )
}
