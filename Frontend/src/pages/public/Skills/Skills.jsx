import React from 'react';
import { Cpu, Layout, Server, Database, Shield, Wrench, GraduationCap } from 'lucide-react';
import { SEOHead } from '../../../components/common/SEOHead/SEOHead';
import './Skills.css';

const SKILL_CATEGORIES = [
  {
    title: 'Frontend Development',
    icon: <Layout size={20} className="skills-category-icon" />,
    skills: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'TypeScript', 'React.js', 'React Router', 'Axios', 'Context API', 'Responsive Web Design', 'Vite'],
  },
  {
    title: 'Backend & APIs',
    icon: <Server size={20} className="skills-category-icon" />,
    skills: ['Node.js', 'Express.js', 'RESTful API Architecture', 'MVC Architecture', 'Express Middleware', 'Joi Validation', 'Multer', 'Nodemailer'],
  },
  {
    title: 'Databases',
    icon: <Database size={20} className="skills-category-icon" />,
    skills: ['MongoDB', 'Mongoose ODM', 'MySQL', 'Relational & NoSQL Data Modeling', 'Query Optimization', 'Database Indexing', 'Aggregation Pipelines'],
  },
  {
    title: 'Security & Authentication',
    icon: <Shield size={20} className="skills-category-icon" />,
    skills: ['JWT Authentication', 'bcrypt', 'Helmet.js', 'CORS', 'Rate Limiting', 'Role-Based Access Control (RBAC)', 'Input Validation & Sanitization'],
  },
  {
    title: 'Developer Tools',
    icon: <Wrench size={20} className="skills-category-icon" />,
    skills: ['Git', 'GitHub', 'VS Code', 'npm', 'Postman', 'Vite', 'Morgan'],
  },
  {
    title: 'Currently Learning',
    icon: <GraduationCap size={20} className="skills-category-icon" />,
    skills: ['Redis', 'Docker', 'AWS', 'Deployment & CI/CD', 'Swagger / OpenAPI', 'Advanced Backend Architecture'],
  },
];

const Skills = () => {
  return (
    <div className="skills-page">
      <SEOHead
        title="Technical Skills & Tech Stack | Gaurav Chavda"
        description="Explore Gaurav Chavda's technical skills across React.js, Node.js, Express.js, MongoDB, RESTful APIs, and backend security."
        canonicalPath="/skills"
      />
      <section className="page-hero">
        <div className="badge-tag">
          <Cpu size={14} />
          <span>Technical Expertise</span>
        </div>
        <h1 className="page-title">Skills & Technologies</h1>
        <p className="page-description">
          A comprehensive toolkit spanning full-stack web development, secure REST APIs, and database engineering.
        </p>

        <div className="skills-grid">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="skills-category-card">
              <div className="skills-category-header">
                {cat.icon}
                <h3 className="skills-category-title">{cat.title}</h3>
              </div>
              <div className="skills-chips-wrapper">
                {cat.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="skills-chip"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Skills;
