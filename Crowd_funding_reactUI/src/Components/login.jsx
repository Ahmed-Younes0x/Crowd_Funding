import React from "react";

export default function Login() {
  return (
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-4 p-lg-5">            
                <form>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-uppercase small">Email</label>
                    <input
                      type="email"
                      className="form-control shadow-sm"
                      placeholder="Email"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-uppercase small">Password</label>
                    <input
                      type="password"
                      className="form-control shadow-sm"
                      placeholder="Password"
                    />
                  </div>
                  
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                    />
                    <label className="form-check-label small fw-semibold" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>

                  <button
                    className="btn btn-dark w-100 py-3 fw-bold text-uppercase"
                    type="button"
                  >
                    Sign In
                  </button>
                </form>
                
                <div className="d-flex justify-content-between mt-3">
                  <a href="#forgot" className="text-decoration-none small text-muted">
                    Forgot password?
                  </a>
                  <a href="#register" className="text-decoration-none small text-muted">
                    Create new account
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}