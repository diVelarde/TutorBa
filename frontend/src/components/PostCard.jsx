import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const styles = () => (
  <style>{`
    .post-card {
      width: 600px;
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 8px rgba(0,0,0,0.10);
      background-color: #ffffff;
      transition: 0.2s;
      margin: 0 auto; 
    }

    .post-avatar {
      width: 55px;
      height: 55px;
      border-radius: 50%;
      background-color: #d9d9d9;
      display: inline-block;
      margin-right: 10px;
    }

    .post-title {
      font-weight: 600;
      font-size: 1.05rem;
      margin: 0;
    }

    .post-subtitle {
      font-size: 0.85rem;
      color: #555;
      margin-bottom: 1rem;
    }

    .post-label {
      font-weight: 600;
      width: 70px;
      display: inline;
    }
  `}</style>
);
function PostCard() {
  return (
    <>
      {styles()}
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
