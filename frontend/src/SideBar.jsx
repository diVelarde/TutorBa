import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { BsBook, BsFolder2, BsChatDots } from "react-icons/bs";


const styles = () => (
  <style>
    {`
      .sidebar {
        position: fixed;
        top: 56px;       
        left: 0;
        width: 200px;
        height: calc(100vh - 56px);
        background-color: #5bbaf2;
        padding: 1.5rem;
        box-shadow: 2px 0 6px rgba(0,0,0,0.15);
        z-index: 900;
      }

      .sidebar-link {
        font-size: 1.15rem;
        margin-bottom: 1.25rem;
        display: flex;
        align-items: center;
        color: #333;
      }

      .sidebar-link:hover {
        opacity: 0.7;
        text-decoration: none;
      }

      .sidebar-icon {
        margin-right: 10px;
      }
    `}
  </style>
);

function SideBar() {
  return (
    <>
      {styles()}
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