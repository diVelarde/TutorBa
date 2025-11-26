import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import { BsBook, BsFolder2, BsChatDots } from "react-icons/bs";
import '../styles/SideBar.css'

function SideBar() {
  return (
    <>

      <div className="sidebar">
        <Nav className="flex-column">
            <Nav.Item>
              <NavLink to="/booking" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <BsBook className="sidebar-icon" size={20} /> Booking
              </NavLink>
            </Nav.Item>

            <Nav.Item>
              <NavLink to="/sharing" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <BsFolder2 className="sidebar-icon" size={20} /> Share
              </NavLink>
            </Nav.Item>

            <Nav.Link href="#chat" className="sidebar-link">
            <BsChatDots className="sidebar-icon" size={20} /> Chat
            </Nav.Link>
        </Nav>
      </div>
    </>
  );
}

export default SideBar;