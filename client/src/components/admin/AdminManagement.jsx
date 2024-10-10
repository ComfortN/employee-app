import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../model/Modal';
import AddAdmin from './AddAdmin';
import Loader from '../Loader/Loader';
import Popup from '../popup/Popup';
import './AdminManagement.css';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);


  // Fetch admins from the server
  useEffect(() => {
    fetchAdmins();
  }, []);

  // Function to fetch the list of admins from the backend API
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/all');
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins: ", error);
      showAlert('Failed to fetch admins.');
    } finally {
      setLoading(false);
    }
  };


  // Function to remove an admin
  const removeAdmin = async (uid) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/admin/remove/${uid}`);
      fetchAdmins();
      showAlert('Admin removed successfully.');
    } catch (error) {
      console.error("Error removing admin: ", error);
      showAlert('Failed to remove admin. Please try again.');
    } finally{
      setLoading(false);
    }
  };


  // Function to block/unblock an admin based on their current status
  const toggleAdminBlock = async (uid, currentStatus) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/admin/toggle-block/${uid}`);
      setAdmins(admins.map(admin => 
        admin.uid === uid ? { ...admin, blocked: !currentStatus } : admin
      ));
      showAlert(`Admin ${currentStatus ? 'unblocked' : 'blocked'} successfully.`);
    } catch (error) {
      console.error("Error toggling admin block status: ", error);
      showPopup('Failed to update admin status. Please try again.');
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

if (loading) return <Loader />;

  return (
    <>
    <div className="admin-management">
      {showPopup.show && <Popup message={popupMessage} />}
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
              <th>Status</th>
              <th>Actions</th>
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
                <td>{admin.blocked ? 'Blocked' : 'Active'}</td>
                <td>
                  <button onClick={() => removeAdmin(admin.uid)} style={{marginRight: '1rem'}}>Remove</button>
                  <button onClick={() => toggleAdminBlock(admin.uid, admin.blocked)}>
                    {admin.blocked ? 'Unblock' : 'Block'}
                  </button>
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
    </>
  );
};

export default AdminManagement;