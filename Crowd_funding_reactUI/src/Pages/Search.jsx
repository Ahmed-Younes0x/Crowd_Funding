import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchProject = () => {
  const [Allprojects, setAllProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ title: "", category: "" });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectsAndCategories = async () => {
      try {
        const [projectRes, categoryRes] = await Promise.all([
          axios.get("http://localhost:8000/api/projects/" 
          //   {
          //   headers: {
          //     Authorization: `Bearer ${localStorage.getItem("token")}`,
          //   },
          // }
        ),
          axios.get("http://localhost:8000/api/categories/" 
            // {
          //   headers: {
          //     Authorization: `Bearer ${localStorage.getItem("token")}`,
          //   },
          // }
        ),
        ]);
 const rawProjects = projectRes.data;

const projectList = await Promise.all(
  rawProjects.map(async (project) => {
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
      console.error("Error fetching images for project", project.id, err);
      return { ...project, images: [] };
    }
  })
);
        setAllProjects(projectList);
        setCategories(categoryRes.data);
      } catch (err) {
        console.error("Error fetching projects or categories", err);
        if (err.includes("401")) {
          navigate("/login");
        }
      }
    };
    fetchProjectsAndCategories();
  }, []);

  useEffect(() => {
    const filtered = Allprojects.filter((p) => {
      console.log('nothere',p.images);
      
      const matchesTitle = p.title
        .toLowerCase()
        .includes(filters.title.toLowerCase());
      const matchesCategory =
        filters.category === "" || p.category === filters.category.id;

      return matchesTitle && matchesCategory;
    });

    setProjects(filtered);
  }, [filters, Allprojects]);
  console.log(projects[14],'here');

  return (
    <div className="container mt-4">
      <div className="row mb-3">
        <div className="input-group">
          <input
            className="form-control"
            type="text"
            placeholder="Search for a project"
            value={filters.title}
            onChange={(e) => setFilters({ ...filters, title: e.target.value })}
          />

          <button
            className="btn btn-outline-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {filters.category.name || "Category"}
          </button>

          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button
                className="dropdown-item"
                onClick={() => setFilters({ ...filters, category: "" })}
              >
                All Categories
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  className="dropdown-item"
                  onClick={() => setFilters({ ...filters, category: cat })}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="row">
        {projects.map((p) => (
          <div className="col-md-4 mb-4" key={p.id}>
            <div className="card h-100 shadow-sm">
              <img
                src={p.images[0]?.image || "/default_project.png"}
                className="card-img-top"
                alt={p.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text text-truncate">{p.details}</p>

                <div className="mt-auto">
                  <div className="mb-2">
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{
                          width: `${
                            (p.current_amount / p.total_target) * 100
                          }%`,
                        }}
                      >
                        {Math.round((p.current_amount / p.total_target) * 100)}%
                      </div>
                    </div>
                    <small className="text-muted">
                      ${p.current_amount} raised of ${p.total_target}
                    </small>
                  </div>

                  <p className="mb-1">
                    ⭐ {p.average_rating?.toFixed(1) || "0.0"} from{" "}
                    {p.total_ratings_count} ratings
                  </p>

                  <a
                    href={`/project/${p.id}`}
                    className="btn btn-primary w-100"
                  >
                    View Project
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-muted">No matching projects found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchProject;
