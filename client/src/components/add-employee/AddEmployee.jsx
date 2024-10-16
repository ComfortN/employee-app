import React, {useState, useEffect} from 'react';
import { storage } from '../../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';
import Popup from '../popup/Popup';
import './AddEmployee.css'

export default function AddEmployee({addEmployee, updateEmployee, isEditing, onDelete, currentEmployee, setIsEditing, viewOnly, setViewOnly, setLoading}) {
    const [employee, setEmployee] = useState({
        name: '',
        surname: '',
        age: '',
        image: '',
        position: '',
        id: ''
    });
    const [errors, setErrors] = useState({})
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('default-avatar.png');
    const [popupMessage, setPopupMessage] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    
    // useEffect(() => {
    //     if (isEditing && currentEmployee ) {
    //         setEmployee(currentEmployee);
    //         if (currentEmployee.image) {
    //             // Check if the image is a Blob or File object
    //             if (currentEmployee.image instanceof Blob || currentEmployee.image instanceof File) {
    //                 setImagePreview(currentEmployee.image);
    //             } else {
    //                 setImagePreview(currentEmployee.image);
    //             }
    //         } else {
    //             setImagePreview('default-avatar.png');
    //         }
    //     }
    // }, [isEditing, currentEmployee]);
    

    useEffect(() => {
        if (isEditing && currentEmployee) {
            setEmployee(currentEmployee);
            if (currentEmployee.image) {
                setImagePreview(currentEmployee.image);
            } else {
                setImagePreview('default-avatar.png');
            }
        }
    }, [isEditing, currentEmployee]);

    const validate = () => {
        const errors = {};
        const phoneRegex = /^(?:\+27|0)\d{9}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!employee.name.trim()) errors.name = 'Name is required';
        if (!emailRegex.test(employee.email)) errors.email = 'Invalid email address';
        if (!phoneRegex.test(employee.phone)) errors.phone = 'Phone number must start with +27 or 0 and be 10 digits long';
        if (!employee.position.trim()) errors.position = 'Position is required';
        if (!employee.id.trim()) errors.id = 'ID is required';

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };


    // const handleChange = (e) => {
    //     const { name, value, files } = e.target;
    //     if (name === 'image' && files[0]) {
    //         const file = files[0];
            
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setEmployee({ ...employee, image: reader.result });
    //             setImagePreview(reader.result);
    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         setEmployee({ ...employee, [name]: value });
    //     }
    // };
    

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files[0]) {
            setImageFile(files[0]);
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setEmployee({ ...employee, [name]: value });
        }
    };


    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     // if (validate()) {
    //         // setLoading(true);
    //         try {
    //         if (isEditing) {
    //             // updateEmployee(employee);
    //             await axios.put(`http://localhost:5000/api/employees/${employee.id}`, employee);
    //             setIsEditing(false);
    //             showAlert('Employee updated successfully!');
    //         } else {
    //             // addEmployee(employee);
    //             await axios.post('http://localhost:5000/api/employees', employee);
    //             showAlert('Employee added successfully!');
    //         }
    //         setEmployee({
    //             name: '',
    //             surname: '',
    //             age: '',
    //             image: '',
    //             position: '',
    //             id: ''
    //         });
    //         setImagePreview('default-avatar.png');
    //     } catch (error) {
    //         showAlert(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
    //     } 
    //     // }
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // setLoading(true);
        try {
            let imageUrl = employee.image;
            if (imageFile) {
                const storageRef = ref(storage, `employee_images/${employee.id}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            const employeeData = { ...employee, image: imageUrl };

            if (isEditing) {
                await axios.put(`http://localhost:5000/api/employees/${employee.id}`, employeeData);
                updateEmployee(employeeData);
                setIsEditing(false);
                showAlert('Employee updated successfully!');
            } else {
                await axios.post('http://localhost:5000/api/employees', employeeData);
                addEmployee(employeeData);
                showAlert('Employee added successfully!');
            }

            setEmployee({
                name: '',
                surname: '',
                age: '',
                image: '',
                position: '',
                id: ''
            });
            setImagePreview('default-avatar.png');
            setImageFile(null);
        } catch (error) {
            showAlert(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
        }
        
    };


    const handleDelete = async (employee) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete employee ${employee.name}?`);
        if (isConfirmed) {
            // onDelete(employee);
            await axios.delete(`http://localhost:5000/api/employees/${employee.id}`);
            showAlert('Employee deleted successfully! Moved to Former.');
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
         <form onSubmit={handleSubmit} className='form-container'>
        <div className="image-container">
                <img src={imagePreview} alt="Profile Preview" />
                <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    disabled={viewOnly}
                    required ={!isEditing && !currentEmployee}
                />
            </div>
        
        <input type="text" name="name" value={employee.name} onChange={handleChange} placeholder="Name" required disabled={viewOnly} />
        {errors.name && <p className="error">{errors.name}</p>}
        <input type="text" name="surname" value={employee.surname} onChange={handleChange} placeholder="Surname" required disabled={viewOnly}  />
        {errors.surname && <p className="error">{errors.surname}</p>}
        <input type="number" name="age" value={employee.age} onChange={handleChange} placeholder="Age" required disabled={viewOnly} />
        {errors.age && <p className="error">{errors.age}</p>}
        <input type="text" name="position" value={employee.position} onChange={handleChange} placeholder="Position" required disabled={viewOnly}  />
        {errors.position && <p className="error">{errors.position}</p>}
        <input type="text" name="id" value={employee.id} onChange={handleChange} placeholder="ID" required disabled={viewOnly} />
        {errors.id && <p className="error">{errors.id}</p>}
        {!viewOnly && (
            <div className="button-group">
            <button type="submit">{isEditing ? 'Update' : 'Add'} Employee</button>
            {isEditing && <button type="button" onClick={() => handleDelete(employee)}>Delete</button>}
        </div>
        )}
        {viewOnly && (
            <button type='button' onClick={() => setViewOnly(false)}>Edit</button>
        )}
    </form>
    </>
    
    );
}
