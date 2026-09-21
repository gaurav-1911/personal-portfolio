import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  Mail,
  Server,
  ShieldCheck,
  LayoutDashboard,
  Database,
  Sparkles,
  Layers,
  CheckCircle2,
  User,
  Target,
  Cpu,
  TrendingUp,
  Phone,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../../components/common/SocialIcons/SocialIcons';
import { TechMarquee } from '../../../components/common/TechMarquee/TechMarquee';
import { SEOHead } from '../../../components/common/SEOHead/SEOHead';
import { SITE_URL } from '../../../config/site';
import './Home.css';

const buildHomeSchema = () => [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Gaurav Chavda',
    url: `${SITE_URL}/`,
    jobTitle: 'MERN Stack Developer & Software Engineer',
    sameAs: [
      'https://github.com/gauravchavdavhits',
      'https://www.linkedin.com/in/chavda-gaurav',
    ],
    knowsAbout: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs', 'Authentication', 'Full-Stack Development'],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Gaurav Chavda Portfolio',
    url: `${SITE_URL}/`,
    description: 'Portfolio of Gaurav Chavda - MERN Stack Developer building modern, performant, and secure web applications.',
    author: {
      '@type': 'Person',
      name: 'Gaurav Chavda',
    },
  },
];

const WHAT_I_BUILD = [
  {
    icon: <Server className="service-icon" size={24} />,
    title: 'REST APIs',
    desc: 'Secure, structured, and performant REST APIs using Node.js, Express.js, and clean architecture.',
  },
  {
    icon: <LayoutDashboard className="service-icon" size={24} />,
    title: 'React Applications',
    desc: 'Modern, component-driven, and responsive web applications with React Router, Context API, and state management.',
  },
  {
    icon: <ShieldCheck className="service-icon" size={24} />,
    title: 'Authentication & Security',
    desc: 'Role-based access control (RBAC), JWT authentication, bcrypt hashing, and input validation pipelines.',
  },
  {
    icon: <Database className="service-icon" size={24} />,
    title: 'Database Architecture',
    desc: 'Scalable data models and query optimization using MongoDB with Mongoose and relational schema design with MySQL.',
  },
];

const FEATURED_PROJECTS = [
  {
    id: 'solar-management-system',
    title: 'Solar Panel Management System',
    tagline: 'Enterprise management platform with 7-role RBAC, automated quotations, and subsidy tracking.',
    highlights: [
      'Role-Based Access Control (RBAC) across 7 authenticated user roles',
      'Automated PDF Quotation generator and dynamic pricing calculations',
      'Government solar subsidy lifecycle tracking and compliance audit workflows',
      'Automated email notification pipeline powered by Nodemailer',
      'Lead management pipeline, technician dispatching, and AMC service scheduling',
    ],
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'RBAC', 'Nodemailer'],
    flag: 'Featured Project',
  },
  {
    id: 'bidirectional-chat-platform',
    title: 'Bidirectional — Real-Time Chat & Video Calling Platform',
    tagline: 'Full-stack real-time communication platform featuring WebRTC video calling, Socket.IO messaging, and screen sharing.',
    highlights: [
      'Real-time 1:1 and group chat with typing indicators and read receipts',
      'Peer-to-peer WebRTC voice and HD video calling with Socket.IO signaling',
      'Consent-driven screen sharing with live connection state monitoring',
      'JWT authentication with refresh-token rotation and bcrypt hashing',
      'High-concurrency MongoDB indexes and structured REST APIs',
    ],
    tech: ['React.js', 'TypeScript', 'Node.js', 'Express.js', 'Socket.IO', 'WebRTC', 'MongoDB'],
    flag: 'Featured Project',
  },
];

const Home = () => {
  return (
    <div className="home-page">
      <SEOHead
        title="Gaurav Chavda | MERN Stack Developer & Software Engineer"
        description="Gaurav Chavda is a MERN Stack Developer specializing in React, Node.js, Express, MongoDB, secure REST APIs, and scalable web applications."
        canonicalPath="/"
        schema={buildHomeSchema()}
      />

      {/* 1. Developer Hero Section */}
      <section className="hero-section">
        <div className="hero-grid">
          {/* Left Column: Bio & Calls to Action */}
          <div className="hero-content">
            <span className="hero-overline">HELLO, I'M</span>
            <h1 className="hero-name">
              Gaurav Chavda
            </h1>
            <h2 className="hero-role-title">
              MERN Stack Developer
            </h2>

            <div className="hero-bio-group">
              <p className="hero-bio-text">
                I build modern, responsive web applications and robust backend systems using <strong>React.js, Node.js, Express.js, and MongoDB</strong>. My focus is on developing scalable REST APIs, secure authentication, well-structured databases, and intuitive user interfaces that deliver reliable digital experiences.
              </p>
              <p className="hero-bio-text">
                I believe in writing <strong>clean, maintainable, and efficient code</strong>, while following a structured approach to building applications that are scalable, secure, and easy to maintain.
              </p>
            </div>

            {/* Action Buttons Matching Reference */}
            <div className="hero-actions-row">
              <NavLink to="/contact" className="btn-get-in-touch">
                <span>Get In Touch</span>
              </NavLink>
              <a
                href="/Gaurav_Chavda_Mern_Stack_Resume.pdf"
                download="Gaurav_Chavda_Mern_Stack_Resume.pdf"
                className="btn-view-resume"
                id="hero-view-resume"
              >
                <Download size={16} />
                <span>Resume (PDF)</span>
              </a>
            </div>

            {/* Direct Social & Contact Channels */}
            <div className="hero-social-strip">
              <a
                href="https://github.com/gauravchavdavhits"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                aria-label="GitHub Profile"
                title="GitHub: https://github.com/gauravchavdavhits"
              >
                <GithubIcon size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/chavda-gaurav"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                aria-label="LinkedIn Profile"
                title="LinkedIn: linkedin.com/in/chavda-gaurav"
              >
                <LinkedinIcon size={18} />
              </a>
              <a
                href="mailto:gauravbhai1911@gmail.com"
                className="social-icon-btn"
                aria-label="Email Gaurav"
                title="Email: gauravbhai1911@gmail.com"
              >
                <Mail size={18} />
              </a>
              <a
                href="tel:+917575858502"
                className="social-icon-btn"
                aria-label="Call Gaurav"
                title="Phone: +91 75758 58502"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Right Column: Portrait Photo */}
          <div className="hero-image-wrapper">
            <div className="hero-image-container">
              <img
                src="/developer_portrait.jpg"
                alt="Gaurav Chavda - MERN Stack Developer"
                className="hero-portrait-img"
                width="420"
                height="420"
                fetchPriority="high"
                decoding="async"
                onError={(e) => { e.currentTarget.src = '/Gaurav.png'; }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Tech Stack Continuous Interactive Marquee */}
      <TechMarquee />

      {/* 3. About Me Three-Card Grid */}
      <section className="about-me-section">
        <div className="section-header">
          <div className="badge-tag">
            <User size={14} />
            <span>ABOUT ME</span>
          </div>
          <h2 className="section-title">Who I Am & What I Do</h2>
          <p className="section-subtitle">
            A developer mindset focused on structure, performance, and clean maintainable code.
          </p>
        </div>

        <div className="about-me-grid">
          {/* Card 1: What I Focus On */}
          <div className="about-box focus-box">
            <div className="about-box-top">
              <div className="about-box-icon">
                <Target size={22} />
              </div>
              <div>
                <span className="about-box-pill">Specialization</span>
                <h3 className="about-box-title">What I Focus On</h3>
              </div>
            </div>
            <ul className="focus-items-list">
              <li>
                <span className="focus-dot"></span>
                <span>Full Stack Development</span>
              </li>
              <li>
                <span className="focus-dot"></span>
                <span>RESTful APIs</span>
              </li>
              <li>
                <span className="focus-dot"></span>
                <span>Authentication</span>
              </li>
              <li>
                <span className="focus-dot"></span>
                <span>Database Development</span>
              </li>
              <li>
                <span className="focus-dot"></span>
                <span>Responsive UI</span>
              </li>
            </ul>
          </div>

          {/* Card 2: How I Work */}
          <div className="about-box workflow-box">
            <div className="about-box-top">
              <div className="about-box-icon">
                <Cpu size={22} />
              </div>
              <div>
                <span className="about-box-pill">Mindset</span>
                <h3 className="about-box-title">How I Work</h3>
              </div>
            </div>
            <div className="about-quote-card">
              <p className="about-quote-body">
                "I focus on understanding the problem first and building clean, structured, and maintainable solutions."
              </p>
            </div>
            <div className="workflow-highlights">
              <div className="workflow-check-item">
                <CheckCircle2 size={16} className="text-accent" />
                <span>Architecture before implementation</span>
              </div>
              <div className="workflow-check-item">
                <CheckCircle2 size={16} className="text-accent" />
                <span>Clean, decoupled MVC patterns</span>
              </div>
              <div className="workflow-check-item">
                <CheckCircle2 size={16} className="text-accent" />
                <span>High emphasis on performance & security</span>
              </div>
            </div>
          </div>

          {/* Card 3: Currently Growing */}
          <div className="about-box growing-box">
            <div className="about-box-top">
              <div className="about-box-icon">
                <TrendingUp size={22} />
              </div>
              <div>
                <span className="about-box-pill">Active Learning</span>
                <h3 className="about-box-title">Currently Growing</h3>
              </div>
            </div>
            <p className="growing-intro">
              Actively expanding knowledge across modern systems engineering, containerization, and backend scalability:
            </p>
            <div className="growing-chips-container">
              <div className="growing-chip">
                <span className="chip-indicator"></span>
                <span>Advanced backend concepts</span>
              </div>
              <div className="growing-chip">
                <span className="chip-indicator"></span>
                <span>Redis</span>
              </div>
              <div className="growing-chip">
                <span className="chip-indicator"></span>
                <span>Docker</span>
              </div>
              <div className="growing-chip">
                <span className="chip-indicator"></span>
                <span>AWS</span>
              </div>
              <div className="growing-chip">
                <span className="chip-indicator"></span>
                <span>Deployment</span>
              </div>
              <div className="growing-chip">
                <span className="chip-indicator"></span>
                <span>API documentation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. What I Build / Engineering Capabilities */}
      <section className="services-section">
        <div className="section-header">
          <div className="badge-tag">
            <Sparkles size={14} />
            <span>Capabilities</span>
          </div>
          <h2 className="section-title">What I Build</h2>
          <p className="section-subtitle">
            Reliable and maintainable digital solutions crafted with modern full-stack standards.
          </p>
        </div>

        <div className="services-grid">
          {WHAT_I_BUILD.map((item, idx) => (
            <div key={idx} className="service-card">
              <div className="service-icon-box">{item.icon}</div>
              <h3 className="service-title">{item.title}</h3>
              <p className="service-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Projects Teaser */}
      <section className="featured-projects-section">
        <div className="section-header">
          <div className="badge-tag">
            <Layers size={14} />
            <span>Portfolio</span>
          </div>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-subtitle">
            Real-world full-stack applications with authenticated flows, databases, and clean architecture.
          </p>
        </div>

        <div className="featured-grid">
          {FEATURED_PROJECTS.map((project) => (
            <div key={project.id} className="project-teaser-card">
              <span className="project-flag">{project.flag}</span>
              <h3 className="project-teaser-title">{project.title}</h3>
              <p className="project-teaser-tagline">{project.tagline}</p>

              <div className="project-teaser-highlights">
                {project.highlights.map((h, i) => (
                  <div key={i} className="highlight-item">
                    <CheckCircle2 size={15} className="highlight-icon" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="project-teaser-tech">
                {project.tech.map((t) => (
                  <span key={t} className="mini-tag">
                    {t}
                  </span>
                ))}
              </div>

              <div className="project-teaser-footer">
                <NavLink to={`/projects/${project.id}`} className="project-link-btn">
                  <span>View Project Details</span>
                  <ArrowRight size={15} />
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Contact CTA Banner */}
      <section className="cta-banner-section" aria-label="Collaboration and Contact Call to Action">
        <div className="cta-banner-card">
          {/* Subtle Ambient Background Mesh Lights */}
          <div className="cta-ambient-glow cta-glow-left" aria-hidden="true" />
          <div className="cta-ambient-glow cta-glow-right" aria-hidden="true" />

          {/* Left Column: Heading, Status Badge & Description */}
          <div className="cta-content-col">
            <div className="cta-status-badge">
              <span className="cta-status-pulse">
                <span className="pulse-dot-ring" />
                <span className="pulse-dot-core" />
              </span>
              <span className="cta-status-label">Open to Opportunities</span>
            </div>
            <h2 className="cta-title">
              Let's Build Something <span className="cta-title-highlight">Great Together</span>
            </h2>
            <p className="cta-desc">
              Available for full-time MERN Stack Developer roles, backend engineering positions, and impactful software engineering opportunities.
            </p>
          </div>

          {/* Right Column: Premium Action Buttons */}
          <div className="cta-buttons">
            <NavLink to="/contact" className="cta-btn cta-btn-primary" id="cta-contact-btn">
              <span className="cta-btn-shimmer" aria-hidden="true" />
              <span className="cta-btn-text">Start a Conversation</span>
              <span className="cta-btn-icon-box">
                <ArrowRight size={17} className="cta-arrow-icon" />
              </span>
            </NavLink>
            <NavLink to="/projects" className="cta-btn cta-btn-secondary" id="cta-projects-btn">
              <Layers size={17} className="cta-secondary-icon" />
              <span className="cta-btn-text">Explore All Work</span>
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
