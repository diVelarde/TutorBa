import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { BsBook, BsFolder2, BsChatDots } from "react-icons/bs";
import '../styles/SideBar.css'

function SideBar() {
  return (
    <>

      <div className="sidebar">
        <Nav className="flex-column">
            <Nav.Link href="#book" className="sidebar-link">
            <BsBook className="sidebar-icon" size={20} /> Book
            </Nav.Link>

            <Nav.Link href="#share" className="sidebar-link">
            <BsFolder2 className="sidebar-icon" size={20} /> Share
            </Nav.Link>

            <Nav.Link href="#chat" className="sidebar-link">
            <BsChatDots className="sidebar-icon" size={20} /> Chat
            </Nav.Link>
        </Nav>
      </div>
    </>
  );
}

export default SideBar;