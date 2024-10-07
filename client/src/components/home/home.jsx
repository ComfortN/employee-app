// import React, {useState} from 'react';
import './home.css'
// import SideNav from '../global/Side-nav'
import AllEmp from '../all-employees/AllEmp'


export default function Home({employees, formerEmployees, onEmployeeClick}) {

  const totalEmployees = Array.isArray(employees) ? employees.length : 0;
  const formerEmployeesCount = Array.isArray(formerEmployees) ? formerEmployees.length : 0;
  
  return (
    <div className="dashboard">
        <h1>Employee Registration System</h1>
        <div className="dashboard-summary">
          <div className="summary-card">
            <h2>Total Employees</h2>
            <p>{totalEmployees}</p>
          </div>
          <div className="summary-card">
          <h2>Former Employees</h2>
          <p>{formerEmployeesCount}</p>
          </div>
        </div>
        
        <div className="employee-table">
        <AllEmp title="All Employees" employees={employees} onEmployeeClick={onEmployeeClick} />
      </div>

       
      </div>
  )
}
