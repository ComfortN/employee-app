import React from 'react'
import './AllEmp.css'

export default function AllEmp({ title, employees, onEmployeeClick}) {
  if (!Array.isArray(employees)) {
    return <div>No employees data available</div>;
  }
  return (
    <div className="employee-list">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Position</th>
            <th>ID</th>
            
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id} onClick={() => onEmployeeClick(employee)}>
              <td data-label="Name">{employee.name}</td>
              <td data-label="Email">{employee.email}</td>
              <td data-label="Phone">{employee.phone}</td>
              <td data-label="Position">{employee.position}</td>
              <td data-label="ID">{employee.id}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
