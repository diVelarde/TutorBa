import React, { useEffect, useState } from "react";
import "./loginpage.css"; // use correct (lowercase) filename that exists in the repo

const BACKEND_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

export default function LoginPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // parse ?user=... if present (redirect from backend after OAuth)
    try {
      const params = new URLSearchParams(window.location.search);
      const u = params.get('user');
      if (u) {
        const parsed = JSON.parse(decodeURIComponent(u));
        setUser(parsed);
        // Optionally remove the query param from URL for cleanliness
        const url = new URL(window.location.href);
        url.searchParams.delete('user');
        window.history.replaceState({}, document.title, url.toString());
      }
    } catch (e) {
      console.error('Failed parsing user from URL', e);
    }
  }, []);
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

            <button
              className="btn btn-outline-danger w-100 mb-3"
              onClick={() => (window.location.href = `${BACKEND_URL}/auth/google`)}
            >
              <i className="bi bi-google me-2" /> Sign in with Google
            </button>

            {user && (
              <div className="alert alert-success mt-3" role="alert">
                Signed in as <strong>{user.displayName || user.emails?.[0]?.value}</strong>
              </div>
            )}

            <p className="text-muted small">
              Don’t have an account?{" "}
              <a href="/signup" className="text-primary">
                Signup
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}