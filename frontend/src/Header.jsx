import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';

const styles = () => (
  <style>
    {`
      .blueNavBar {
        background-color: #5bbaf2;
        padding: 0.5rem 1.5rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }

      .profile-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        object-fit: cover;
        cursor: pointer;
        border: 2px solid white;
      }

      .dropdown-menu-end {
        right: 0 !important;
        left: auto !important;
      }
    `}
  </style>
);

function Header() {
  return (
    <>
      {styles()}

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