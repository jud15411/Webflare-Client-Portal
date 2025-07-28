// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import the Link component
import api from '../services/api'; 

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/projects');
        setProjects(response.data);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (isLoading) {
    return <div className="loading-spinner">Loading projects...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Your Projects</h1>
      </div>
      
      {projects.length === 0 ? (
        <p>You do not have any active projects at this time.</p>
      ) : (
        <div className="project-list">
          {projects.map((project) => (
            // Wrap the entire card in a Link component
            <Link to={`/project/${project._id}`} key={project._id} className="project-card-link">
              <article className="project-card">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <div className="project-status">
                  <strong>Status:</strong> 
                  <span className={`status status-${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {project.status}
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}