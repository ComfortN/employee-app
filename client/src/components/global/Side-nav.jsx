import React from 'react'
import './sideNav.css'
// import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from 'react-router-dom';

export default function SideNav({show, adminDetails, isSuperAdmin}) {
  return (
    <div className={show ? 'sidebar active' : 'sidebar'}>
      <div className='profile'>
        <div className="profileImg">
          <img src={adminDetails?.image || '/default-avatar.png'} alt="" className='prof' />
        </div>
        <p className="admin-name">{adminDetails?.name} {adminDetails?.surname}</p>
        <p className="admin-email">{adminDetails?.email}</p>
        <Link to="/admin-profile" className="view-profile-link">View Profile</Link>
      </div>
      <div className="sideLinks">
        <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/all-employees'>All employees</Link></li>
        <li><Link to='/former-employees'>Former employees</Link></li>
        {isSuperAdmin && <li><Link to='/admin-management'>All Admins</Link></li>}
      </ul>
      </div>
      

    </div>
  )
}
