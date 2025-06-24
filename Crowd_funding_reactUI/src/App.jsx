import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="/">
            <i className="bi bi-lightning-charge-fill me-2 text-warning" />
            CrowdFund
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Left section */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {/* <li className="nav-item">
                <a className="nav-link" href="/projects/all">
                  <i className="bi bi-grid me-1" /> Projects
                </a>
              </li> */}
              <li className="nav-item">
                <a className="nav-link" href="/search">
                  <i className="bi bi-search me-1" /> Search
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/create-project">
                  <i className="bi bi-plus-square me-1" /> Add Project
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/donate">
                  <i className="bi bi-cash-coin me-1" /> Donate
                </a>
              </li>
            </ul>

            {/* Right section */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" href="/login">
                  <i className="bi bi-box-arrow-in-right me-1" /> Login/Register
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/profile">
                  <i className="bi bi-person-circle me-1" /> Profile
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default App;
