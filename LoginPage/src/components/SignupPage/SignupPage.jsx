import React from 'react';

const BACKEND_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

export default function SignupPage() {
	return (
		<div className="d-flex vh-100 align-items-center justify-content-center">
			<div className="card p-4" style={{ width: 380 }}>
				<h3 className="mb-3">Create account</h3>

				<label className="form-label">Name</label>
				<input className="form-control mb-2" />

				<label className="form-label">Email</label>
				<input className="form-control mb-2" />

				<label className="form-label">Password</label>
				<input type="password" className="form-control mb-3" />

				<button className="btn btn-primary w-100 mb-3">Sign up</button>

				<button
					className="btn btn-outline-danger w-100"
					onClick={() => (window.location.href = `${BACKEND_URL}/auth/google`)}
				>
					<i className="bi bi-google me-2" /> Sign up with Google
				</button>
			</div>
		</div>
	);
}
