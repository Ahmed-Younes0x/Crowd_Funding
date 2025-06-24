import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectsWithImages = async () => {
      try {
        const projectRes = await axios.get(
          "http://localhost:8000/api/projects/",
          // {
          //   headers: {
          //     Authorization: `Bearer ${localStorage.getItem("token")}`,
          //   },
          // }
        );

        const projectList = projectRes.data;

        const projectsWithImages = await Promise.all(
          projectList.map(async (project) => {
            try {
              const imgRes = await axios.get(
                `http://localhost:8000/api/images/${project.id}`,
                // {
                //   headers: {
                //     Authorization: `Bearer ${localStorage.getItem("token")}`,
                //   },
                // }
              );
              return { ...project, images: imgRes.data };
            } catch (err) {
              console.error(
                "Error fetching images for project",
                project.id,
                err
              );
              return { ...project, images: [] };
            }
          })
        );

        setProjects(projectsWithImages);
      } catch (err) {
        console.error("Error fetching projects", err);
        if (err.message.includes('401')) {
          navigate('/login')
        }
      }
    };

    fetchProjectsWithImages();
  }, []);

  const topProjects = [...projects]
    .sort((a, b) => b.current_amount - a.current_amount)
    .slice(0, 5);

  const featuredProjects = projects.filter((p) => p.is_featured).slice(0, 5);

  return (
    <div className="container mt-4">
      <div class="block-content">
        <h1 className="mb-4 text-center">Welcome to Django_CrowdFund</h1>
        <div className="content text-center p-4">
          <p>
            Crowdfunding is a way to raise money for an individual or
            organization by collecting donations through family, friends,
            friends of friends, strangers, businesses, and more. By using social
            media, people can reach more potential donors than traditional forms
            of fundraising.
          </p>
          <p>
            Before you start crowdfunding, find the best platform for your
            needs. CroFun has compiled
            this list to help you compare the best online fundraising platform
            by fees, features, support, and more.
          </p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <h3>Top 5 Performing Projects</h3>
          <div
            id="topProjectsCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {topProjects.map((p, index) => (
                <div
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                  key={p.id}
                >
                  <div className="card h-100">
                    {p.images && p.images.length > 0 && (
                      <img
                        src={p.images[0].image}
                        className="card-img-top"
                        alt={`Project ${p.title}`}
                        style={{ objectFit: "cover", height: "300px" }}
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{p.title}</h5>
                      <p className="card-text">{p.details?.slice(0, 100)}...</p>
                      <p className="card-text">
                        <small className="text-muted">
                          Raised: ${p.current_amount}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {topProjects.length > 1 && (
              <>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#topProjectsCarousel"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#topProjectsCarousel"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Featured Projects */}
        <div className="col-md-4">
          <h4 className="mb-3">Featured Projects</h4>
          {featuredProjects.map((p) => (
            <div
              className="card mb-3 shadow-sm"
              key={p.id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/project/${p.id}`)}
            >
              <div className="row g-0">
                {p.images && p.images.length > 0 && (
                  <div className="col-4">
                    <img
                      src={p.images[0].image}
                      alt={p.title}
                      className="img-fluid rounded-start"
                      style={{ height: "100%", objectFit: "cover" }}
                    />
                  </div>
                )}
                <div className="col-8">
                  <div className="card-body">
                    <h6 className="card-title mb-1">{p.title}</h6>
                    <p className="card-text">
                      <small className="text-muted">
                        ${p.current_amount} raised
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {featuredProjects.length === 0 && (
            <p className="text-muted">No featured projects found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
