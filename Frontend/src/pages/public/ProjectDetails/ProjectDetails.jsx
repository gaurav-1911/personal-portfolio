import React from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Layers, ChevronRight } from 'lucide-react';
import { GithubIcon } from '../../../components/common/SocialIcons/SocialIcons';
import { SEOHead } from '../../../components/common/SEOHead/SEOHead';
import { SITE_URL } from '../../../config/site';
import { NotFound } from '../NotFound/NotFound';
import './ProjectDetails.css';
import './ProjectDetailsResponsive.css';

const PROJECT_DETAILS = {
  'solar-management-system': {
    title: 'Solar Panel Management System',
    tagline: 'An enterprise management platform designed to streamline solar business operations, quotations, and subsidy tracking.',
    problem: 'Solar installations involve complex multi-party workflows spanning customers, sales agents, field technicians, and government subsidy authorities.',
    solution: 'Designed a unified RBAC system with 7 distinct roles, automated quotation PDFs, lead status lifecycles, and email alerts via Nodemailer.',
    techStack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'Joi', 'Multer', 'Nodemailer'],
    architecture: 'Modular REST API architecture with role authorization middleware and isolated business logic services.',
    challenges: 'Coordinating state transitions across multiple administrative approval tiers and generating accurate dynamic quotations.',
    outcomes: 'Reduced manual administrative overhead by 70% with automated quotation emails and subsidy verification checklists.',
    githubUrl: 'https://github.com/gaurav-1911',
    liveUrl: '#',
  },
  'bidirectional-chat-platform': {
    title: 'Bidirectional — Real-Time Chat & Video Calling Platform',
    tagline: 'A full-stack real-time communication platform featuring WebRTC peer-to-peer video calling, WebSockets, and screen sharing.',
    problem: 'Real-time communication platforms require ultra-low latency message delivery and peer-to-peer media streaming without saturating central server bandwidth or compromising auth security.',
    solution: 'Engineered an event-driven communication engine leveraging WebSockets for bi-directional chat signaling, WebRTC mesh peer connections for voice/video calls, and refresh-token rotation for robust security.',
    techStack: ['React.js', 'TypeScript', 'Node.js', 'Express.js', 'Socket.IO', 'WebRTC', 'MongoDB', 'JWT'],
    architecture: 'Event-driven WebSocket architecture layered over modular Express.js controllers, integrated with interactive React custom hooks and media stream state management.',
    challenges: 'Handling ICE candidate negotiation, NAT traversal through STUN servers, device permissions switching, and reconnecting interrupted socket states cleanly.',
    outcomes: 'Sub-50ms message delivery latency, crystal-clear peer-to-peer video streaming with zero server media bandwidth overhead, and resilient JWT authentication.',
    githubUrl: 'https://github.com/gaurav-1911',
    liveUrl: '#',
  },
};

const ProjectDetails = () => {
  const { slug } = useParams();
  const project = PROJECT_DETAILS[slug];

  if (!project) {
    return <NotFound isProject />;
  }

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Projects',
          item: `${SITE_URL}/projects`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: project.title,
          item: `${SITE_URL}/projects/${slug}`,
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: project.title,
      description: project.tagline,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Cross-platform Web',
      author: {
        '@type': 'Person',
        name: 'Gaurav Chavda',
      },
    },
  ];

  return (
    <div className="project-details-page">
      <SEOHead
        title={`${project.title} | Gaurav Chavda`}
        description={project.tagline}
        canonicalPath={`/projects/${slug}`}
        schema={structuredData}
      />

      {/* Semantic Breadcrumbs Navigation */}
      <nav className="breadcrumbs-nav" aria-label="Breadcrumb">
        <ol className="breadcrumbs-list">
          <li className="breadcrumb-item">
            <NavLink to="/" className="breadcrumb-link">Home</NavLink>
          </li>
          <li className="breadcrumb-separator" aria-hidden="true">
            <ChevronRight size={13} />
          </li>
          <li className="breadcrumb-item">
            <NavLink to="/projects" className="breadcrumb-link">Projects</NavLink>
          </li>
          <li className="breadcrumb-separator" aria-hidden="true">
            <ChevronRight size={13} />
          </li>
          <li className="breadcrumb-item breadcrumb-current" aria-current="page">
            {project.title}
          </li>
        </ol>
      </nav>

      <div className="project-details-back-wrap">
        <NavLink
          to="/projects"
          className="project-details-back-link"
        >
          <ArrowLeft size={16} />
          <span>Back to all projects</span>
        </NavLink>
      </div>

      <section className="page-hero">
        <div className="badge-tag">
          <Layers size={14} />
          <span>Project Deep Dive</span>
        </div>
        <h1 className="page-title">{project.title}</h1>
        <p className="page-description">{project.tagline}</p>

        {/* Tech Stack Pills */}
        <div className="project-details-tech-row">
          {project.techStack.map((tech) => (
            <span key={tech} className="project-details-tech-tag">{tech}</span>
          ))}
        </div>

        {/* Action Buttons — only render when real URLs exist */}
        {(project.githubUrl || (project.liveUrl && project.liveUrl !== '#')) && (
          <div className="project-details-actions">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary project-details-btn"
              >
                <GithubIcon size={16} />
                <span>View Source Code</span>
              </a>
            )}
            {project.liveUrl && project.liveUrl !== '#' && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary project-details-btn"
              >
                <ExternalLink size={16} />
                <span>Live Demonstration</span>
              </a>
            )}
          </div>
        )}

        <div className="project-details-grid">
          <div className="project-details-card">
            <h3 className="project-details-card-title">
              The Challenge / Problem
            </h3>
            <p className="project-details-card-text">{project.problem}</p>
          </div>

          <div className="project-details-card">
            <h3 className="project-details-card-title">
              The Engineering Solution
            </h3>
            <p className="project-details-card-text">{project.solution}</p>
          </div>

          <div className="project-details-card">
            <h3 className="project-details-card-title">
              Architecture & Patterns
            </h3>
            <p className="project-details-card-text">{project.architecture}</p>
          </div>

          <div className="project-details-card">
            <h3 className="project-details-card-title">
              Challenges & Complexity
            </h3>
            <p className="project-details-card-text">{project.challenges}</p>
          </div>

          <div className="project-details-card project-details-card-wide">
            <h3 className="project-details-card-title">
              Results & Key Learnings
            </h3>
            <p className="project-details-card-text">{project.outcomes}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;

