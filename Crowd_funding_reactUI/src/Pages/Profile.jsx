import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({"email":localStorage.getItem('email')});
  const [projects, setProjects] = useState([]);
  const [donations, setdonations] = useState([]);
  const [editing, setEditing] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // get user data
    axios
      .post(
        `http://localhost:8000/api/users`,
        { email: localStorage.getItem("email") },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        setProfile(res.data);
      });
    // get projects
    axios
      .get(`http://localhost:8000/api/projects/user/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setProjects(res.data));

    // get dontaions
    axios
      .post(
        `http://localhost:8000/api/donations/`,
        { email: localStorage.getItem("email") },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((res) => {
        setdonations(res.data);
        console.log(res.data);
      });
  }, []);
  const handleDeleteProject = async (project_id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete your project?"
    );
    if (confirm) {
      await axios.post(
        "http://localhost:8000/api/project/delete",
        { projectId: project_id, email: localStorage.getItem("email") },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };
  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (confirm) {
      await axios.post(
        "http://localhost:8000/api/user/delete",
        { password: password, email: localStorage.getItem("email") },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  const handleUpdate = async () => {
    await axios.post(`http://localhost:8000/api/user/update`, profile, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setEditing(false);
  };
  const handleUpdateProject = async (id) => {
    await axios.post(`http://localhost:8000/api/projects/update/${id}/`, profile, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setEditing(false);
  };
  return (
    <div className="container py-4">
      <h1 className="mb-4">My Profile</h1>

      {/* Profile Section */}
      <div className="card mb-4">
        <div className="row g-0">
          {/* Left Side - Profile Info */}
          <div className="col-md-8">
            <div className="card-body">
              {editing ? (
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Username</label>
                      <input
                        className="form-control"
                        value={profile.username}
                        onChange={(e) =>
                          setProfile({ ...profile, username: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Birthdate</label>
                      <input
                        type="date"
                        className="form-control"
                        value={profile.birthdate}
                        onChange={(e) =>
                          setProfile({ ...profile, birthdate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        value={profile.phone}
                        onChange={(e) =>
                          setProfile({ ...profile, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" onClick={handleUpdate}>
                      Save Changes
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h4>{profile.username}</h4>
                  <div className="row mt-3">
                    <div className="col-md-6">
                      <p>
                        <strong>Email:</strong> {profile.email}
                      </p>
                      <p>
                        <strong>Phone:</strong> {profile.phone || "N/A"}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Birthdate:</strong> {profile.birthdate || "N/A"}
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary mt-2"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right Side - Profile Image */}
          <div className="col-md-4 d-flex align-items-center justify-content-center p-3">
            <div className="text-center">
              <img
                src={profile.profile_image || "/default_project.png"}
                className="img-thumbnail rounded-circle"
                alt="Profile"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
              {/* {editing && (
                <div className="mt-3">
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title mb-4">My Projects</h2>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Title</th>
                  <th>Current Amount</th>
                  <th>Total Target</th>
                  <th>Progress</th>
                  <th>Edit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>${p.current_amount}</td>
                    <td>${p.total_target}</td>
                    <td>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${
                              (p.current_amount / p.total_target) * 100
                            }%`,
                          }}
                        >
                          {Math.round(
                            (p.current_amount / p.total_target) * 100
                          )}
                          %
                        </div>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => navigate(`/project/update/${p.id}`)}
                      >
                        Edit
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteProject(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Donations Section */}
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title mb-4">My Donations</h2>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Project ID</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id}>
                    <td>{d.project}</td>
                    <td>${d.amount}</td>
                    <td>{new Date(d.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="card border-danger">
        <div className="card-body">
          <h4 className="card-title text-danger">Delete Account</h4>
          <p className="text-muted">
            This action cannot be undone. All your data will be permanently
            deleted.
          </p>
          <div className="row">
            <div className="col-md-6">
              <input
                type="password"
                className="form-control mb-3"
                placeholder="Enter password to confirm"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={!password}
              >
                Delete My Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
