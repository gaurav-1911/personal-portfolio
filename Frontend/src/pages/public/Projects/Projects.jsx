import React from 'react';
import { NavLink } from 'react-router-dom';
import { Layers, ExternalLink, ArrowRight, CheckCircle2, Star } from 'lucide-react';
import { GithubIcon } from '../../../components/common/SocialIcons/SocialIcons';
import { SEOHead } from '../../../components/common/SEOHead/SEOHead';
import './Projects.css';
import './ProjectsResponsive.css';

const PROJECTS_DATA = [
  {
    id: 'solar-management-system',
    title: 'Solar Panel Management System',
    shortDescription: 'An enterprise management platform designed to automate solar business workflows, customer installations, technician tasks, and government subsidy filings.',
    technologies: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Joi', 'Multer', 'Nodemailer'],
    features: [
      'Multi-role RBAC: Super Admin, Sales, Technician, Customer, Accountant',
      'Automated Quotation and PDF Generation',
      'Lead pipeline tracking and customer onboarding',
      'Government subsidy workflow and testing compliance reports',
      'Automated email notifications via Nodemailer',
    ],
    githubUrl: 'https://github.com/gaurav-1911',
    liveUrl: '#',
    isFeatured: true,
  },
  {
    id: 'bidirectional-chat-platform',
    title: 'Bidirectional — Real-Time Chat & Video Calling Platform',
    shortDescription: 'A full-stack real-time communication platform built with WebRTC peer-to-peer video streaming, Socket.IO WebSockets, screen sharing, and JWT security.',
    technologies: ['React.js', 'TypeScript', 'Node.js', 'Express.js', 'Socket.IO', 'WebRTC', 'MongoDB', 'JWT'],
    features: [
      'Real-time 1:1 and group chat with typing indicators, reactions, and read receipts',
      'Peer-to-peer voice and video calling powered by WebRTC with Socket.IO signaling',
      'Consent-based screen sharing and device permission controls',
      'JWT authentication with refresh-token rotation and bcrypt password hashing',
      'MongoDB indexing, media streaming optimization, and structured API endpoints',
    ],
    githubUrl: 'https://github.com/gaurav-1911',
    liveUrl: '#',
    isFeatured: true,
  },
];

const Projects = () => {
  return (
    <div className="projects-page">
      <SEOHead
        title="Featured Projects & Architecture | Gaurav Chavda"
        description="Explore production full-stack MERN projects built by Gaurav Chavda, including Solar Panel Management System and Bidirectional Real-Time Chat Platform."
        canonicalPath="/projects"
      />
      <section className="page-hero">
        <div className="badge-tag">
          <Layers size={14} />
          <span>Featured Projects</span>
        </div>
        <h1 className="page-title">Production-Ready Applications</h1>
        <p className="page-description">
          Engineered with clean MVC architecture, RESTful API conventions, robust security, and scalable databases.
        </p>

        <div className="projects-grid">
          {PROJECTS_DATA.map((project) => (
            <div
              key={project.id}
              className="project-card"
            >
              {project.isFeatured && (
                <div className="project-featured-badge">
                  <Star size={14} fill="#f59e0b" />
                  <span>FEATURED MERN PROJECT</span>
                </div>
              )}

              <h2 className="project-title">
                {project.title}
              </h2>

              <p className="project-desc">
                {project.shortDescription}
              </p>

              <div className="project-features-block">
                <div className="project-features-heading">
                  Key Features
                </div>
                <div className="project-features-list">
                  {project.features.map((feat, fIdx) => (
                    <div key={feat} className="project-feature-item">
                      <CheckCircle2 size={14} className="project-check-icon" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="project-tech-tags">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="project-tech-tag"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="project-card-footer">
                <NavLink
                  to={`/projects/${project.id}`}
                  className="project-deep-dive-link"
                >
                  <span>Project Deep Dive</span>
                  <ArrowRight size={15} />
                </NavLink>

                <div className="project-links-row">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-external-btn"
                    aria-label="GitHub repo"
                  >
                    <GithubIcon size={18} />
                  </a>
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-external-btn"
                      aria-label="Live Demo"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Projects;
