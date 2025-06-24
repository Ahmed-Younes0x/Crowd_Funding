import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";

function Register() {
  const navigate = useNavigate();
  const [fields, setFields] = useState(["", "", "", "", "", ""]);
  const [valid, setValid] = useState([false, false, false, false, false, false]);
  const [fieldstate, setFieldState] = useState(["", "", "", "", "", ""]);

  const keypressed = (id, char) => {
    const newFields = [...fields];
    newFields[id] = char;
    setFields(newFields);
    validate(id);
  };

  const validate = (id) => {
    const newValid = [...valid];
    const newFieldState = [...fieldstate];

    switch (id) {
      case 0:
        newValid[id] = fields[id].trim() !== "";
        break;
      case 1:
        newValid[id] = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields[id]);
        break;
      case 2:
        newValid[id] = /^\S+$/.test(fields[id]);
        break;
      case 3:
        newValid[id] = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@%$#*])[A-Za-z\d@%$#*]{8,}$/.test(fields[id]);
        break;
      case 4:
        newValid[id] = fields[id] === fields[3];
        break;
      case 5:
        newValid[id] = /^01[0-2,5][0-9]{8}$/.test(fields[id]);
        break;
      default:
        break;
    }

    newFieldState[id] = newValid[id] ? "" : "is-invalid";
    setValid(newValid);
    setFieldState(newFieldState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (valid.some((v) => !v)) {
      alert("Error: Please fix validation issues.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/register",
        {
          name: fields[0],
          email: fields[1],
          username: fields[2],
          password: fields[3],
          phone: fields[5],
        },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Success");
      navigate("/verify");
    } catch (error) {
      if (`${error}`.includes("406")) {
        alert("Email already used");
      } else {
        alert(`Error: ${error}`);
      }
    }
  };

  return (
    <section className="h-100">
      <div className="container h-100">
        <div className="row justify-content-sm-center h-100">
          <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
            <div className="text-center my-5">
            </div>
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <h1 className="fs-4 card-title fw-bold mb-4">Register</h1>
                <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="mb-2 text-muted">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className={`form-control ${fieldstate[0]}`}
                      onChange={(e) => keypressed(0, e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">Name is required</div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="mb-2 text-muted">
                      E-Mail Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      className={`form-control ${fieldstate[1]}`}
                      onChange={(e) => keypressed(1, e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">Email is invalid</div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="username" className="mb-2 text-muted">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      className={`form-control ${fieldstate[2]}`}
                      onChange={(e) => keypressed(2, e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="mb-2 text-muted">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="text"
                      className={`form-control ${fieldstate[5]}`}
                      onChange={(e) => keypressed(5, e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="mb-2 text-muted">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      className={`form-control ${fieldstate[3]}`}
                      onChange={(e) => keypressed(3, e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">Password is required</div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirm-password" className="mb-2 text-muted">
                      Confirm Password
                    </label>
                    <input
                      id="confirm-password"
                      type="password"
                      className={`form-control ${fieldstate[4]}`}
                      onChange={(e) => keypressed(4, e.target.value)}
                      required
                    />
                    <div className="invalid-feedback">Passwords do not match</div>
                  </div>

                  <p className="form-text text-muted mb-3">
                    By registering you agree with our terms and conditions.
                  </p>

                  <div className="d-flex align-items-center">
                    <button type="submit" className="btn btn-primary ms-auto">
                      Register
                    </button>
                  </div>
                </form>
              </div>
              <div className="card-footer py-3 border-0">
                <div className="text-center">
                  Already have an account?{" "}
                  <a href="/login" className="text-dark">
                    Login
                  </a>
                </div>
              </div>
            </div>
            <div className="text-center mt-5 text-muted">
              Copyright &copy; 2017-2021 &mdash; Your Company
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
