import React, { useEffect, useRef } from 'react';
import {
  FileDown,
  Eye,
  Zap,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { SEOHead } from '../../../components/common/SEOHead/SEOHead';
import { useScrollTimeline } from '../../../hooks/useScrollTimeline';
import './Resume.css';

const SKILL_GROUPS = [
  {
    category: 'FRONTEND',
    skills: [
      'React.js',
      'TypeScript',
      'JavaScript (ES6+)',
      'HTML5',
      'CSS3',
      'React Hooks',
      'React Router',
      'Redux Toolkit',
      'Context API',
      'Material UI (MUI)',
      'Bootstrap',
      'Responsive Web Design',
      'Vite',
      'Axios',
      'Formik',
      'Yup',
    ],
  },
  {
    category: 'BACKEND & APIS',
    skills: [
      'Node.js',
      'Express.js',
      'RESTful APIs',
      'MVC Architecture',
      'Middleware',
      'JWT Auth',
      'RBAC',
      'Joi Validation',
      'Multer',
      'Nodemailer',
      'Swagger / OpenAPI',
    ],
  },
  {
    category: 'REAL-TIME & COMMUNICATION',
    skills: ['Socket.IO', 'WebSockets', 'WebRTC'],
  },
  {
    category: 'DATABASE & MODELING',
    skills: [
      'MongoDB (NoSQL)',
      'Mongoose ODM',
      'MySQL (SQL)',
      'Schema Design',
      'Data Modeling',
    ],
  },
  {
    category: 'TOOLS & SECURITY',
    skills: [
      'Git & GitHub',
      'Postman',
      'VS Code',
      'npm',
      'bcrypt.js',
      'Helmet',
      'Morgan',
      'dotenv',
      'CORS',
    ],
  },
];

const EXPERIENCE_DATA = [
  {
    title: 'MERN Stack Developer Intern',
    badge: '6-Month Internship',
    company: 'Virtual Height',
    location: 'Ahmedabad, India',
    period: 'March 2026 – Present',
    summary:
      'Contributed as a MERN Stack Developer Intern to a full-stack solar installation management ERP (lead capture through commissioning & handover), building features across the React.js front end, Express.js REST API, and MongoDB database in a team-based workflow.',
    responsibilities: [
      'Built responsive, reusable React.js components (forms, data tables, modals, filters) used across 40+ application screens, ensuring consistent layout, form behavior, and user feedback from module to module.',
      'Developed RESTful API endpoints with Express.js and Mongoose for CRUD operations in modules such as leads, customers, inventory, and vendors, and integrated them with React.js screens for creating, listing, filtering, and updating records.',
      'Implemented JWT authentication and role-based access control (RBAC) using Express middleware, so each user role (admin, technician, and others) could access only its permitted screens and API actions.',
      'Added server-side request validation through Express middleware and returned clear error responses, so invalid or incomplete data was rejected before reaching the database and users saw meaningful messages.',
      'Tested RESTful APIs with Postman and debugged front-end and back-end issues found during testing.',
      'Followed team coding standards: modular code organization, environment-based configuration, and Git/GitHub version control.',
    ],
  },
];

const RESUME_PROJECTS = [
  {
    title: 'Bidirectional — Real-Time Chat & Video Calling Platform',
    roleTag: 'MERN Stack & WebRTC',
    tech: [
      'React.js',
      'TypeScript',
      'Node.js',
      'Express.js',
      'Socket.IO',
      'WebRTC',
      'MongoDB',
      'JWT',
      'Axios',
      'Vite',
      'Swagger',
    ],
    description:
      'Built a full-stack real-time communication platform using React.js (custom Hooks), TypeScript, Node.js, Express.js, Socket.IO (WebSockets), and MongoDB.',
    highlights: [
      'Engineered real-time 1:1 and group chat with typing indicators, read receipts, reactions, replies, message forwarding, editing, deletion, and GIF sharing.',
      'Implemented peer-to-peer real-time voice and video calling with Socket.IO signaling and WebRTC, including screen sharing, device switching, and busy-user detection.',
      'Developed JWT authentication with refresh-token rotation, bcrypt password hashing, rate-limited auth endpoints, and OTP-based email verification via Nodemailer.',
      'Designed consent-based screen sharing workflow with user approval and live WebRTC connection status updates.',
      'Architected MongoDB indexes and structured REST APIs with Swagger/OpenAPI documentation, image processing, and presence tracking.',
    ],
  },
  {
    title: 'Solar Installation Management System — Full-Stack ERP Application',
    roleTag: 'Full-Stack ERP System',
    tech: [
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Mongoose',
      'JWT',
      'Bootstrap',
      'Material UI',
      'Formik',
      'Yup',
      'Joi',
      'Multer',
      'Nodemailer',
    ],
    description:
      'Developed a full-stack ERP web application for solar installation businesses covering lead management, site surveys, solar design, quotations, project approval, installation, and commissioning.',
    highlights: [
      'Implemented JWT authentication and role-based access control (RBAC) across 7 user tiers (Super Admin, Sales, Technician, etc.) using custom Express middleware.',
      'Developed RESTful APIs and reusable React.js components with CRUD operations, pagination, filtering, sorting, and structured MongoDB (Mongoose) schemas.',
      'Built complete modules for customer & lead management, products, projects, inventory, technician assignment, AMC scheduling, and subsidy tracking.',
      'Created analytics dashboards and reporting pipelines for financial, sales, inventory, and technician data with automated PDF and Excel exports.',
      'Added client-side validation (Formik, Yup), server-side validation (Joi), Multer file uploads, automated email notifications (Nodemailer), and security via Helmet and CORS.',
    ],
  },
];

const EDUCATION_DATA = [
  {
    degree: 'Bachelor of Computer Applications (BCA)',
    institution: 'Shree Adarsh BCA College, Botad, Gujarat',
    year: 'Graduated: 2024',
    isMain: true,
  },
  {
    degree: 'Higher Secondary (12th)',
    institution: 'Akshar Purushottam High School, Gujarat',
    year: 'Graduated: 2022',
    isMain: false,
  },
  {
    degree: 'Secondary (10th)',
    institution: 'Akshar Purushottam High School, Gujarat',
    year: 'Graduated: 2020',
    isMain: false,
  },
];

const CERTIFICATIONS_DATA = [
  {
    title: 'MERN Stack Development Training',
    issuer: 'Virtual Height',
    period: 'August 2025 – March 2026',
  },
  {
    title: 'MERN Stack Developer Internship',
    issuer: 'Virtual Height',
    period: 'March 2026 – Present',
  },
  {
    title: 'React JS Course',
    issuer: 'Scaler Topics',
    period: 'April 2026',
  },
  {
    title: 'Node.js Certification Course – Master the Fundamentals',
    issuer: 'Scaler Topics',
    period: 'June 2026',
  },
];

export const Resume = () => {
  const pageRef = useRef(null);

  // Scroll-driven timeline: travelling progress line + active node + reveal-once
  const { containerRef: timelineContainerRef, activeIndex } = useScrollTimeline({
    itemSelector: '.timeline-job-entry',
    revealClass: 'is-revealed',
  });

  useEffect(() => {
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const scrollElements = pageRef.current?.querySelectorAll('.reveal-on-scroll');

    scrollElements?.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="resume-page" ref={pageRef}>
      <SEOHead
        title="Resume & Qualifications | Gaurav Chavda"
        description="Review Gaurav Chavda's resume: MERN Stack Developer, BCA graduate, practical experience building production web apps, and technical certifications."
        canonicalPath="/resume"
      />
      {/* Subtle ambient lighting layer */}
      <div className="resume-ambient-glow" aria-hidden="true" />

      {/* Top Header - Left: Resume & Professional Line | Right: Download & View Options */}
      <section className="resume-hero-header">
        <div className="resume-header-left">
          <h1 className="resume-page-title anim-fade-in-up anim-delay-1">Resume</h1>
          <p className="resume-page-description anim-fade-in-up anim-delay-2">
            Full Stack MERN Developer building scalable, secure, and modern web applications.
          </p>
        </div>

        <div className="resume-actions-row">
          <a
            href="/Gaurav_Chavda_Mern_Stack_Resume.pdf"
            download="Gaurav_Chavda_Mern_Stack_Resume.pdf"
            className="btn-resume-download anim-fade-in-up anim-delay-3"
            id="resume-page-download-btn"
          >
            <FileDown size={17} className="btn-icon-svg" />
            <span>Download (PDF)</span>
          </a>
          <a
            href="/Gaurav_Chavda_Mern_Stack_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-resume-view anim-fade-in-up anim-delay-4"
            id="resume-page-view-btn"
          >
            <Eye size={17} className="btn-icon-svg" />
            <span>View (PDF)</span>
          </a>
        </div>
      </section>

      {/* Main 2-Column Portion Layout matching Reference */}
      <div className="resume-grid-layout">
        {/* Left Column: Skills & Credentials */}
        <aside className="resume-sidebar-column">
          {/* 1. Skills Portion Card */}
          <div className="resume-section-card skills-card anim-fade-in-up anim-delay-3">
            <div className="resume-card-header">
              <Zap size={20} className="header-cyan-icon" />
              <h2 className="resume-card-title">Skills</h2>
            </div>

            <div className="skills-groups-container">
              {SKILL_GROUPS.map((group) => (
                <div key={group.category} className="skill-category-block">
                  <h3 className="skill-category-label">{group.category}</h3>
                  <div className="skill-tags-flow">
                    {group.skills.map((skill) => (
                      <span key={skill} className="skill-tag-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Education Portion Card */}
          <div className="resume-section-card education-card reveal-on-scroll">
            <div className="resume-card-header">
              <GraduationCap size={20} className="header-cyan-icon" />
              <h2 className="resume-card-title">Education</h2>
            </div>

            <div className="education-timeline-list">
              {EDUCATION_DATA.map((edu, idx) => (
                <div key={idx} className="education-entry-item">
                  <div className="edu-indicator-dot" />
                  <div className="edu-details">
                    <h3 className="edu-degree-title">{edu.degree}</h3>
                    <p className="edu-school-name">{edu.institution}</p>
                    <span className="edu-year-pill">{edu.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Certifications Portion Card */}
          <div className="resume-section-card certifications-card reveal-on-scroll">
            <div className="resume-card-header">
              <Award size={20} className="header-cyan-icon" />
              <h2 className="resume-card-title">Certifications</h2>
            </div>

            <div className="certifications-list">
              {CERTIFICATIONS_DATA.map((cert, idx) => (
                <div key={idx} className="cert-entry-item">
                  <CheckCircle2 size={16} className="cert-check-icon" />
                  <div className="cert-details">
                    <h3 className="cert-course-name">{cert.title}</h3>
                    <p className="cert-issuer-text">{cert.issuer}</p>
                    <span className="cert-period-text">{cert.period}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Column: Professional Experience & Projects */}
        <main className="resume-main-column">
          <div className="resume-section-card experience-main-card anim-fade-in-up anim-delay-4">
            <div className="resume-card-header">
              <Briefcase size={20} className="header-cyan-icon" />
              <h2 className="resume-card-title">Professional Experience</h2>
            </div>

            {/* Experience Timeline Entries */}
            <div className="experience-timeline-container reveal-on-scroll" ref={timelineContainerRef}>
              {/* Scroll-linked travelling progress (scaleY driven by scroll) */}
              <span className="experience-timeline-progress" aria-hidden="true" />
              {EXPERIENCE_DATA.map((exp, idx) => (
                <div
                  key={idx}
                  className={`timeline-job-entry${idx === activeIndex ? ' is-active' : ''}${idx < activeIndex ? ' is-completed' : ''}`}
                >
                  {/* Glowing Node on Timeline Track */}
                  <div className="timeline-node-marker" />

                  {/* Role Title & Date Header */}
                  <div className="job-headline-row">
                    <div className="job-role-info">
                      <h3 className="job-role-title">{exp.title}</h3>
                      <span className="job-internship-badge">{exp.badge}</span>
                    </div>
                    <div className="job-period-tag">
                      <Calendar size={14} />
                      <span>{exp.period}</span>
                    </div>
                  </div>

                  {/* Company & Location */}
                  <div className="job-company-row">
                    <span className="job-company-name">{exp.company}</span>
                    <span className="job-divider">•</span>
                    <span className="job-location-text">{exp.location}</span>
                  </div>

                  {/* High-level Job Summary */}
                  <p className="job-summary-text">{exp.summary}</p>

                  {/* Key Responsibilities */}
                  <div className="job-responsibilities-subblock reveal-on-scroll">
                    <h4 className="subblock-section-heading">KEY RESPONSIBILITIES & CONTRIBUTIONS</h4>
                    <ul className="job-bullet-points-list">
                      {exp.responsibilities.map((resp, bIdx) => (
                        <li key={bIdx} className="job-bullet-item">
                          <ChevronRight size={15} className="bullet-chevron" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Projects Sub-section */}
                  <div className="job-projects-subblock reveal-on-scroll">
                    <h4 className="subblock-section-heading">FEATURED PROJECTS (FROM RESUME)</h4>

                    <div className="nested-projects-grid">
                      {RESUME_PROJECTS.map((proj, pIdx) => (
                        <div key={pIdx} className="nested-project-card">
                          <div className="nested-project-top">
                            <h5 className="nested-project-title">{proj.title}</h5>
                            <span className="nested-project-role-badge">{proj.roleTag}</span>
                          </div>

                          <p className="nested-project-desc">{proj.description}</p>

                          {/* Tech Stack Pills */}
                          <div className="nested-project-tech-strip">
                            {proj.tech.map((t) => (
                              <span key={t} className="nested-tech-tag">
                                {t}
                              </span>
                            ))}
                          </div>

                          {/* Detailed Highlights */}
                          <ul className="nested-highlights-list">
                            {proj.highlights.map((hl, hIdx) => (
                              <li key={hIdx} className="nested-hl-item">
                                <span className="nested-hl-bullet">•</span>
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Resume;
