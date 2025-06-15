import React, { useEffect,useNavigate, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/user/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setProfile(res.data));

    axios.get('http://localhost:8000/api/user/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setProjects(res.data));
  }, []);

  const handleDelete = async () => {
    const confirm = window.confirm('Are you sure you want to delete your account?');
    if (confirm) {
      await axios.post('/api/user/delete', { password }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const handleUpdate = async () => {
    await axios.put('/api/user/update', profile, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setEditing(false);
  };

  return (
    <div>
      <h1 className="mb-4">My Profile</h1>

      <div className="card mb-4">
        <div className="card-body">
          {editing ? (
            <>
              <input className="form-control mb-2" value={profile.username} onChange={e => setProfile({ ...profile, username: e.target.value })} />
              <input className="form-control mb-2" value={profile.birthdate} onChange={e => setProfile({ ...profile, birthdate: e.target.value })} placeholder="Birthdate" />
              <input className="form-control mb-2" value={profile.country} onChange={e => setProfile({ ...profile, country: e.target.value })} placeholder="Country" />
              <button className="btn btn-primary" onClick={handleUpdate}>Save</button>
            </>
          ) : (
            <>
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Birthdate:</strong> {profile.birthdate || 'N/A'}</p>
              <p><strong>Country:</strong> {profile.country || 'N/A'}</p>
              <button className="btn btn-secondary" onClick={() => setEditing(true)}>Edit</button>
            </>
          )}
        </div>
      </div>

      <h2>My Projects</h2>
      <ul className="list-group mb-4">
        {projects.map(p => (
          <li className="list-group-item" key={p.id} onClick={() => navigate(`/projects/${p.id}`)}>{p.title}</li>
        ))}
      </ul>

      <div className="card p-3">
        <h4>Delete Account</h4>
        <input type="password" className="form-control mb-2" placeholder="Enter password to confirm" onChange={e => setPassword(e.target.value)} />
        <button className="btn btn-danger" onClick={handleDelete}>Delete Account</button>
      </div>
    </div>
  );
};

export default Profile;
