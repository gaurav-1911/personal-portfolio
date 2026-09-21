import React from 'react';
import { Briefcase, Code2, Server, ShieldCheck, Layers, TrendingUp, MonitorSmartphone } from 'lucide-react';
import { SEOHead } from '../../../components/common/SEOHead/SEOHead';
import { useScrollTimeline } from '../../../hooks/useScrollTimeline';
import './Experience.css';

const JOURNEY_STAGES = [
  {
    number: '01',
    title: 'Full-Stack Development Foundation',
    icon: <Code2 size={18} className="timeline-stage-icon" />,
    description:
      'Started building a strong foundation in full-stack web development during my MERN Stack Developer internship at Virtual Height. Worked hands-on with HTML5, CSS3, JavaScript (ES6+), and began applying core programming concepts to real development workflows.',
    tags: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'Git', 'VS Code'],
  },
  {
    number: '02',
    title: 'Frontend Development',
    icon: <MonitorSmartphone size={18} className="timeline-stage-icon" />,
    description:
      'Built responsive, component-driven user interfaces using React.js. Implemented client-side routing with React Router, managed application state through Context API, and integrated REST APIs using Axios. Developed reusable form components, dynamic layouts, and interactive UI features across multiple projects.',
    tags: ['React.js', 'React Router', 'Axios', 'Context API', 'Vite'],
  },
  {
    number: '03',
    title: 'Backend & API Development',
    icon: <Server size={18} className="timeline-stage-icon" />,
    description:
      'Developed backend services and RESTful APIs using Node.js and Express.js. Applied MVC architecture patterns, built custom middleware pipelines for authentication and validation, implemented file upload handling with Multer, and created automated email workflows using Nodemailer.',
    tags: ['Node.js', 'Express.js', 'REST APIs', 'MVC', 'Joi', 'Multer', 'Nodemailer'],
  },
  {
    number: '04',
    title: 'Database & Security',
    icon: <ShieldCheck size={18} className="timeline-stage-icon" />,
    description:
      'Worked with MongoDB and Mongoose for NoSQL data modeling, along with MySQL for relational schema design. Implemented JWT-based authentication, bcrypt password hashing, role-based access control (RBAC), and applied security headers using Helmet, CORS configuration, and API rate limiting.',
    tags: ['MongoDB', 'Mongoose', 'MySQL', 'JWT', 'bcrypt', 'RBAC', 'Helmet'],
  },
  {
    number: '05',
    title: 'Real-World MERN Development',
    icon: <Layers size={18} className="timeline-stage-icon" />,
    description:
      'Applied full-stack skills to production-level MERN applications including a Solar Panel Management System with 7-role RBAC and automated quotation workflows, and a Bidirectional Real-Time Chat & Video Calling Platform using WebRTC and Socket.IO.',
    tags: ['Solar ERP', 'Bidirectional Chat', 'WebRTC', 'Socket.IO'],
  },
  {
    number: '06',
    title: 'Engineering Growth',
    icon: <TrendingUp size={18} className="timeline-stage-icon" />,
    description:
      'Continuing to expand my engineering capabilities with a focus on scalable architecture, performance optimization, clean maintainable code, and API documentation. Currently exploring Docker, Redis, AWS cloud services, CI/CD pipelines, and Swagger/OpenAPI for structured API workflows.',
    tags: ['Docker', 'Redis', 'AWS', 'CI/CD', 'Swagger', 'Architecture'],
  },
];

const Experience = () => {
  // Scroll-driven timeline: continuous progress line + active dot + reveal-once
  const { containerRef, activeIndex } = useScrollTimeline({
    itemSelector: '.timeline-item',
    revealClass: 'timeline-item-visible',
  });

  return (
    <div className="experience-page">
      <SEOHead
        title="Experience & Engineering Journey | Gaurav Chavda"
        description="Explore Gaurav Chavda's progression from learning full-stack fundamentals to building real-world MERN applications at Virtual Height."
        canonicalPath="/experience"
      />
      <section className="page-hero">
        <div className="badge-tag">
          <Briefcase size={14} />
          <span>Experience & Journey</span>
        </div>
        <h1 className="page-title">Experience & Engineering Journey</h1>
        <p className="page-description">
          From learning the fundamentals to building and contributing to real-world full-stack applications.
        </p>

        {/* Internship Context Bar */}
        <div className="exp-context-bar">
          <div className="exp-context-role">
            <span className="exp-context-label">Role</span>
            <span className="exp-context-value">MERN Stack Developer Intern</span>
          </div>
          <div className="exp-context-divider" aria-hidden="true" />
          <div className="exp-context-role">
            <span className="exp-context-label">Company</span>
            <span className="exp-context-value">Virtual Height IT Solutions</span>
          </div>
          <div className="exp-context-divider" aria-hidden="true" />
          <div className="exp-context-role">
            <span className="exp-context-label">Focus</span>
            <span className="exp-context-value">Full-Stack Web Development</span>
          </div>
        </div>

        {/* Vertical Timeline */}
        <div className="timeline-container" ref={containerRef}>
          <div className="timeline-line" aria-hidden="true">
            {/* Scroll-linked travelling progress (scaleY driven by scroll) */}
            <span className="timeline-line-progress" />
          </div>
          {JOURNEY_STAGES.map((stage, idx) => (
            <div
              key={idx}
              className={`timeline-item${idx === activeIndex ? ' is-active' : ''}${idx < activeIndex ? ' is-completed' : ''}`}
            >
              {/* Timeline Node */}
              <div className="timeline-node" aria-hidden="true">
                <span className="timeline-node-dot" />
              </div>

              {/* Timeline Content Card */}
              <div className="timeline-card">
                <div className="timeline-card-header">
                  <span className="timeline-step-num">{stage.number}</span>
                  <span className="timeline-icon-box">{stage.icon}</span>
                  <h3 className="timeline-card-title">{stage.title}</h3>
                </div>
                <p className="timeline-card-desc">{stage.description}</p>
                <div className="timeline-tags">
                  {stage.tags.map((tag) => (
                    <span key={tag} className="timeline-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Experience;
