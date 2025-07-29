// src/pages/ProjectDetailPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './ProjectDetailPage.css';

export default function ProjectDetailPage() {
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectResponse = await api.get(`/api/projects/${id}`);
        setProject(projectResponse.data);

        const milestonesResponse = await api.get(`/api/projects/${id}/milestones`);
        setMilestones(milestonesResponse.data);
      } catch (err) {
        setError('Failed to load project details. It may not exist or you may not have permission to view it.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  // ✅ 1. CALCULATE PROJECT COMPLETION PERCENTAGE
  const completionPercentage = useMemo(() => {
    const allTasks = milestones.flatMap(m => m.tasks);
    if (allTasks.length === 0) return 0;

    const completedTasks = allTasks.filter(t => t.status === 'Done').length;
    return Math.round((completedTasks / allTasks.length) * 100);
  }, [milestones]);


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
    return null;
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
        {/* ✅ 2. ADD THE PROJECT PROGRESS BAR */}
        <div className="project-progress-section">
          <h3>Overall Progress</h3>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <span className="progress-label">{completionPercentage}% Complete</span>
        </div>


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

        <div className="milestones-section">
          <h3>Project Milestones</h3>
          {milestones.length > 0 ? (
            <div className="milestones-container">
              {milestones.map(milestone => (
                <div key={milestone._id} className="milestone-item">
                  <h4>{milestone.name}</h4>
                  <ul className="milestone-tasks">
                    {milestone.tasks.map(task => (
                      <li key={task._id} className="task-item">
                        <span className="task-title">{task.title}</span>
                        {/* ✅ 3. ADD INDIVIDUAL TASK STATUS */}
                        <span className={`task-status-badge status-${task.status.toLowerCase().replace(/\s+/g, '-')}`}>
                          {task.status}
                        </span>
                      </li>
                    ))}
                    {milestone.tasks.length === 0 && (
                      <li className="task-item-empty">No tasks for this milestone yet.</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>No milestones have been set for this project yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}