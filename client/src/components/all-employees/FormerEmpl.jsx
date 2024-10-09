import React from 'react';
import './AllEmp.css';

export default function FormerEmployees({ title, employees, onEmployeeClick }) {
  if (!Array.isArray(employees)) {
    return <div>No employees data available</div>;
  }

  return (
    <div className="employee-list">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Age</th>
            <th>Position</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id} onClick={() => onEmployeeClick(employee)}>
              <td data-label="Image">
                <img src={employee.image || 'default-avatar.png'} alt={employee.name} style={{width: '50px', height: '50px', objectFit: 'cover'}} />
              </td>
              <td data-label="Name">{employee.name}</td>
              <td data-label="Email">{employee.surname}</td>
              <td data-label="Phone">{employee.age}</td>
              <td data-label="Position">{employee.position}</td>
              <td data-label="ID">{employee.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
