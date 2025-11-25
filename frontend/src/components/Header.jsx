import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import '../styles/Header.css'
  

function Header() {
  return (
    <>
    
      <Navbar expand="lg" className="blueNavBar" fixed="top">
        <Container fluid>
          <Navbar.Brand href="/">TutorBa?</Navbar.Brand>

          <Nav className="ms-auto">
            <Dropdown align="end">
              <Dropdown.Toggle as="span" style={{ cursor: 'pointer' }}>
                <img
                  src="https://i.pravatar.cc/300"
                  alt="Profile"
                  className="profile-avatar"
                />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="/logout">Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;