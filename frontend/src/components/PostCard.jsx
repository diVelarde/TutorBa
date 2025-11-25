import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import '../styles/PostCard.css'

function PostCard() {
  return (
    <>
      <Card className="post-card">
        <Card.Body>
          <Row>
            <Col xs="auto">
              <div className="post-avatar"></div>
            </Col>
            <Col>
              <p className="post-title">Dwine Matthew Andrew Despi III jr.</p>
              <p className="post-subtitle">BSIT</p>
            </Col>
          </Row>

          <Row style={{ marginTop: "0.5rem" }}>
            <Col xs={12}><span className="post-label">Topic:</span> Software Management</Col>
            <Col xs={12}><span className="post-label">Status:</span> Tutor</Col>
            <Col xs={12}><span className="post-label">Date:</span> October 26, 2022</Col>
            <Col xs={12}><span className="post-label">Time:</span> 4:00 PM</Col>
            <Col xs={12}><span className="post-label">Location:</span> 3rd Floor Library</Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default PostCard;
