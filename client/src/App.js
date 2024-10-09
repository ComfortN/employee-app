import React, { useEffect, useState } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebase';
import AddEmployee from './components/add-employee/AddEmployee';
import AllEmployees from './components/all-employees/AllEmp';
import Header from './components/global/Header';
import SideNav from './components/global/Side-nav';
import Home from './components/home/home';
import Login from './components/login/login';
import Modal from './components/model/Modal';
import Loader from './components/Loader/Loader';
import axios from 'axios';
import AdminLogin from './components/admin/AdminLogin';
import AdminManagement from './components/admin/AdminManagement';
import AdminProfile from './components/admin/AdminProfile';


function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  const [showNav, setShowNav] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formerEmployees, setFormerEmployees] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [viewOnly, setViewOnly] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [initialise, setInitialse] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const adminDetails = {
    name: 'Nqobile Ngwenya',
    email: 'nqobie@citismart.com',
    image: './258Comfort Ngwenya congwen022.jpg'
  };
  

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (user) => {
  //     if (user) {
  //       setIsAuthenticated(true);
  //       fetchEmployees();
  //       fetchFormerEmployees();
  //     } else {
  //       setIsAuthenticated(false);
  //       setIsAdmin(false);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        // Check if the user is an admin
        try {
          const idTokenResult = await user.getIdTokenResult();
          setIsAdmin(!!idTokenResult.claims.admin);
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
        fetchEmployees();
        fetchFormerEmployees();
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);


  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get('http://localhost:5000/api/employees', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEmployees(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch employees');
      setLoading(false);
    }
  };


  const fetchFormerEmployees = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get('http://localhost:5000/api/employees/former', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
    });
        setFormerEmployees(response.data);
    } catch (error) {
        console.error('Failed to fetch former employees:', error);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };
  


  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }



  const addEmployee = (employee) => {
    console.log('adding: ', employee)
    setEmployees([...employees, employee]);

  };

  const updateEmployee = (updatedEmployee) => {
    setEmployees(employees.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp)));
  };

  const deleteEmployee = (employee) => {
    moveToFormerEmployees(employee);
  };


  const moveToFormerEmployees = (employee) => {
    setFormerEmployees([...formerEmployees, employee]);
    setEmployees(employees.filter(emp => emp.id !== employee.id))
  };


  const handleEmployeeClick = (employee) => {
    setCurrentEmployee(employee);
    setIsEditing(true);
    setViewOnly(true);
    setIsModalOpen(true);
  };


  return (
    <div className="App">
      
  
    <>
      <Router>
        
      {isAuthenticated  && (
        <>
          <Header
          showNav={showNav}
          setShowNav={setShowNav}
          handleLogout={handleLogout}
          addEmployee={addEmployee}
          updateEmployee={updateEmployee}
          deleteEmployee={deleteEmployee}
          employees={employees}
          moveToFormer={moveToFormerEmployees}
          isAdmin={isAdmin}
          />
          <SideNav show={showNav} adminDetails={adminDetails} isAdmin={isAdmin} />
        </>
      )}
        
      
        <div className={isAuthenticated  ? 'main' : ''}>
          <Routes>
            <Route path='/login' element={<Login onLogin={handleLogin}  setLoading={ setLoading}/>} />
            <Route path='/admin-login' element={<AdminLogin onLogin={handleLogin} />} />
            <Route path='/' element={isAuthenticated ? <Home employees={employees} formerEmployees={formerEmployees} onEmployeeClick={handleEmployeeClick} setLoading={ setLoading}/> : <Navigate to={"/login"}/>} />
            <Route path='/all-employees' element={isAuthenticated ? <AllEmployees title="All Employees" employees={employees} onEmployeeClick={handleEmployeeClick}/> : <Navigate to={"/login"}/>} />
            <Route path='/former-employees' element={isAuthenticated ? <AllEmployees title="Former Employees" employees={formerEmployees} onEmployeeClick={handleEmployeeClick}/> : <Navigate to={"/login"}/>} />
            <Route path='/admin-management' element={isAuthenticated && isAdmin ? <AdminManagement /> : <Navigate to={"/login"}/>} />
            <Route path='/admin-profile' element={isAuthenticated && isAdmin ? <AdminProfile /> : <Navigate to={"/login"}/>} />

          </Routes>
          
        </div>
          
      </Router>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddEmployee
          addEmployee={addEmployee}
          updateEmployee={updateEmployee}
          isEditing={isEditing}
          onDelete={deleteEmployee}
          currentEmployee={currentEmployee}
          setIsEditing={setIsEditing}
          viewOnly={viewOnly}
          setViewOnly={setViewOnly}
          setLoading={ setLoading}
        />
      </Modal>

    </>
    {loading && (
      <Loader />
    )}
    </div>
  );
}

export default App;