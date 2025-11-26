import React from "react";
import "./loginpage.css"; // use correct (lowercase) filename that exists in the repo

export default function LoginPage() {
  return (
    <div className="d-flex vh-100">
      {/* Left Side */}
      <div className="flex-grow-1 d-flex justify-content-center align-items-center gradient-bg">
        <div className="text-center">
          <h1 className="display-4 fw-bold mb-3">TutorBa?</h1>
          <i className="bi bi-book" style={{ fontSize: "3rem" }}></i>
        </div>
      </div>

      {/* Right Side */}
      <div className="col-4 d-flex justify-content-center align-items-center bg-light p-5 shadow rounded-start login-card">
        <div className="w-100" style={{ maxWidth: "350px" }}>
          <h2 className="fw-bold mb-2">Log in</h2>
          <p className="text-muted">Access your account</p>

          <div className="mt-4">
            <label className="form-label">Email address</label>
            <input type="email" className="form-control mb-3" />

            <label className="form-label">Password</label>
            <input type="password" className="form-control mb-4" />

            <button className="btn btn-primary w-100 mb-3">Log in</button>

            <p className="text-muted small">
              Don’t have an account?{" "}
              <a href="#" className="text-primary">
                Signup
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}