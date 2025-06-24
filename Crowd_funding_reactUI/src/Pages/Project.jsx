import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ProgressBar } from "react-bootstrap";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [comments, setComments] = useState([]);
  const [images, setImages] = useState([]);
  const [amount, setAmount] = useState("");
  const [commentText, setCommentText] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const [reportReason, setReportReason] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, imagesRes, commentsRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/projects/${id}`),
          axios.get(`http://localhost:8000/api/images/${id}`),
          axios.get(`http://localhost:8000/api/projects/${id}/comments`),
        ]);
        setProject(projectRes.data);
        setImages(imagesRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    fetchData();
  }, [id]);

  const handleDonation = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/donations/create", {
        email: localStorage.getItem("email"),
        amount,
        id,
      },{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      setAmount("");
    } catch (error) {
      console.error("Donation failed:", error);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;
    try {
      await axios.post(
        "http://localhost:8000/api/comments/create",
        {
          project_id: id,
          content: commentText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCommentText("");
      const res = await axios.get(`http://localhost:8000/api/projects/${id}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to post comment", err);
    }
  };

  const handleRatingSubmit = async () => {
    if (!ratingValue) return;
    try {
      await axios.post(
        "http://localhost:8000/api/ratings/create",
        {
          project_id: id,
          rating: ratingValue,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const res = await axios.get(`http://localhost:8000/api/projects/${id}`);
      setProject(res.data);
    } catch (err) {
      console.error("Failed to rate project", err);
    }
  };

  const handleReport = async (targetId, targetType) => {
    try {
      await axios.post(
        "http://localhost:8000/api/reports/create",
        {
          target_id: targetId,
          target_type: targetType,
          reason: reportReason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Report submitted successfully.");
      setReportReason("");
    } catch (err) {
      console.error("Report failed:", err);
    }
  };

  if (!project) return <div className="container mt-5">Loading...</div>;

  const progress = Math.min((project.current_amount / project.total_target) * 100, 100).toFixed(2);

  return (
    <div className="container mt-5">
      <h2>{project.title}</h2>

      {/* Image Carousel */}
      <div className="mb-4">
        {images.length > 0 ? (
          <div id="carousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner rounded shadow">
              {images.map((img, index) => (
                <div key={img.id} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                  <img
                    src={img.image}
                    alt={`Project ${index}`}
                    className="d-block w-100"
                    style={{ maxHeight: "400px", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
            {images.length > 1 && (
              <>
                <button className="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon"></span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon"></span>
                </button>
              </>
            )}
          </div>
        ) : (
          <img src="/default_project.jpg" alt={project.title} className="img-fluid rounded shadow" />
        )}
      </div>

      <p>{project.details}</p>

      {/* Progress */}
      <div className="mb-4">
        <h5>Progress</h5>
        <ProgressBar now={progress} label={`${progress}%`} striped variant="success" />
        <p>${project.current_amount} raised of ${project.total_target}</p>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <h5>Rating</h5>
        <p>⭐ {project.average_rating?.toFixed(1) || "0.0"} / 5 from {project.total_ratings_count} ratings</p>
        <div>
          <select value={ratingValue} onChange={(e) => setRatingValue(e.target.value)} className="form-select w-auto d-inline-block me-2">
            <option value="">Rate</option>
            {[1, 2, 3, 4, 5].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <button onClick={handleRatingSubmit} className="btn btn-outline-primary btn-sm">
            Submit Rating
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="mb-4">
        <h5>Comments</h5>
        <div className="mb-3 d-flex">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="form-control me-2"
            placeholder="Write a comment..."
          />
          <button onClick={handleCommentSubmit} className="btn btn-primary">
            Comment
          </button>
        </div>
        <ul className="list-group">
          {comments.map((c) => (
            <li className="list-group-item d-flex justify-content-between" key={c.id}>
              <div>
                <strong>{c.user}:</strong> {c.content}
              </div>
              <button
                onClick={() => handleReport(c.id, "comment")}
                className="btn btn-sm btn-outline-danger"
                title="Report comment"
              >
                🚩
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Report Project */}
      <div className="mb-4">
        <h5>Report Project</h5>
        <textarea
          className="form-control mb-2"
          rows={2}
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          placeholder="Reason for report"
        ></textarea>
        <button onClick={() => handleReport(id, "project")} className="btn btn-warning">
          Report Project
        </button>
      </div>

      {/* Donation */}
      <div className="mb-5">
        <h5>Make a Donation</h5>
        <form onSubmit={handleDonation}>
          <input
            type="number"
            className="form-control mb-2"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            placeholder="Amount"
          />
          <button type="submit" className="btn btn-success">
            Donate
          </button>
        </form>
        {showSuccess && (
          <div className="alert alert-success mt-3">Thank you! Your donation was successful.</div>
        )}
      </div>
    </div>
  );
}
