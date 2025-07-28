// src/pages/ProjectDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './ProjectDetailPage.css'; // We will create this next

export default function ProjectDetailPage() {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams(); // Get the project ID from the URL

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // This relies on a backend endpoint like GET /api/projects/:id
        const response = await api.get(`/api/projects/${id}`);
        setProject(response.data);
      } catch (err) {
        setError('Failed to load project details. It may not exist or you may not have permission to view it.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (isLoading) {
    return <div className="page-container loading-spinner">Loading Project...</div>;
  }

  if (error) {
    return (
      <div className="page-container error-message">
        <p>{error}</p>
        <Link to="/dashboard" className="btn-back">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!project) {
    return null; // Should not happen if loading and error are handled
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <Link to="/dashboard" className="btn-back" title="Back to Dashboard">
          &larr;
        </Link>
        <h1>{project.name}</h1>
      </div>
      
      <div className="project-detail-card">
        <div className="project-status">
          <strong>Status:</strong>
          <span className={`status status-${project.status.toLowerCase().replace(/\s+/g, '-')}`}>
            {project.status}
          </span>
        </div>
        <div className="project-description">
          <h3>Project Description</h3>
          <p>{project.description || 'No description provided.'}</p>
        </div>
        
        {/* You can add more sections here as you build out the feature */}
        {/* For example, a list of tasks, files, or invoices related to the project */}
      </div>
    </div>
  );
}