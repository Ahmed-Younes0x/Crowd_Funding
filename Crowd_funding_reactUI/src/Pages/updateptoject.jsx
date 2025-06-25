import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProjectPage() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [form, setForm] = useState({
    title: "",
    details: "",
    total_target: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token"); // adjust if you're using a different auth method
  const email = localStorage.getItem("email");

  useEffect(() => {
    axios.get(`http://localhost:8000/api/projects/${code}/`)
      .then(res => {
        setProject(res.data);
        setForm({
          title: res.data.title,
          details: res.data.details,
          total_target: res.data.total_target
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load project.");
        setLoading(false);
      });
  }, [code]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.put(`http://localhost:8000/api/projects/update/${code}/`, {
        ...form,
        email: email
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setSuccess("Project updated successfully!");
      navigate(`/project/${code}`); // optional redirect after update
    } catch (err) {
      setError(err.response?.data?.error || "Update failed.");
    }
  };

  if (loading) return <div>Loading project...</div>;

  return (
    <div className="container mt-4">
      <h2>Edit Project</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Details</label>
          <textarea
            className="form-control"
            name="details"
            rows="4"
            value={form.details}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Total Target</label>
          <input
            type="number"
            className="form-control"
            name="total_target"
            value={form.total_target}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">Update Project</button>
      </form>
    </div>
  );
}
