import React, { useEffect ,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProjects = async () => {
      const response = await axios.get('http://localhost:8000/api/projects/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProjects(response.data);
    };
    fetchProjects();
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-center mx-5">Welcome to Django_CrowdFund</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet ab officia reiciendis, quibusdam exercitationem officiis et non voluptatibus tempore deleniti doloremque corrupti distinctio illo sequi. Amet itaque libero unde veniam!</p>  
      <div className="mb-4">
        <h3>Latest Projects</h3>
        <div className="row">
          {projects.slice(0, 5).map((p) => (
            <div className="col-md-4 mb-3" key={p.id}>
              <div className="card h-100" onClick={() => navigate(`/projects/${p.id}`)}>
                <div className="card-body">
                  <h5 className="card-title">{p.title}</h5>
                  <p className="card-text">{p.details?.slice(0, 100)}...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
