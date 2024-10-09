import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../model/Modal';
import AddAdmin from './AddAdmin';
import './AdminManagement.css';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/all');
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins: ", error);
    }
  };

  const removeAdmin = async (uid) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/remove/${uid}`);
      fetchAdmins();
    } catch (error) {
      console.error("Error removing admin: ", error);
    }
  };

  return (
    <div className="admin-management">
      <h2>Admin Management</h2>
      <button onClick={() => setIsModalOpen(true)}>Add New Admin</button>
      <div className="admin-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Surname</th>
              <th>Email</th>
              <th>Age</th>
              <th>ID Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.uid}>
                <td>{admin.name}</td>
                <td>{admin.surname}</td>
                <td>{admin.email}</td>
                <td>{admin.age}</td>
                <td>{admin.idNumber}</td>
                <td>
                  <button onClick={() => removeAdmin(admin.uid)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AddAdmin onAdminAdded={fetchAdmins} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default AdminManagement;