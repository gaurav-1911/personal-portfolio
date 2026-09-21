import React, { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { User, Target, Cpu, TrendingUp, CheckCircle2, Mail, Phone, MapPin, FileDown } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../../components/common/SocialIcons/SocialIcons';
import { SEOHead } from '../../../components/common/SEOHead/SEOHead';
import './About.css';

const About = () => {
  const gridRef = useRef(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('about-reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    // Observe each pillar card
    const cards = grid.querySelectorAll('.about-box');
    cards.forEach((card) => observer.observe(card));

    // Observe stagger children inside cards
    const staggerItems = grid.querySelectorAll('.about-stagger-item');
    staggerItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      <SEOHead
        title="About Gaurav Chavda | MERN Stack Developer"
        description="Learn more about Gaurav Chavda, an experienced MERN Stack Developer specializing in React, Node.js, Express, MongoDB, and enterprise full-stack development."
        canonicalPath="/about"
      />
      {/* 1. Header / Greeting with Gaurav's Main Portrait Photo */}
      <section className="about-hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="badge-tag about-badge-tag">
              <User size={14} />
              <span>ABOUT ME</span>
            </div>
            <span className="about-hero-overline">HELLO, I'M</span>
            <h1 className="about-hero-name">
              Gaurav Chavda
            </h1>
            <h2 className="about-hero-role">
              MERN Stack Developer
            </h2>

            <div className="about-hero-bio">
              <p className="about-hero-desc">
                I build modern, responsive web applications and robust backend systems using <strong>React.js, Node.js, Express.js, and MongoDB</strong>. My focus is on developing scalable REST APIs, secure authentication, well-structured databases, and intuitive user interfaces that deliver reliable digital experiences.
              </p>
              <p className="about-hero-desc">
                I believe in writing <strong>clean, maintainable, and efficient code</strong>, while following a structured approach to building applications that are scalable, secure, and easy to maintain.
              </p>
            </div>

            {/* Contact Info Header Strip */}
            <div className="about-contact-strip">
              <a href="mailto:gauravbhai1911@gmail.com" className="about-contact-item">
                <Mail size={15} className="about-contact-icon" />
                <span>gauravbhai1911@gmail.com</span>
              </a>
              <a href="tel:+917575858502" className="about-contact-item">
                <Phone size={15} className="about-contact-icon" />
                <span>+91 75758 58502</span>
              </a>
              <span className="about-contact-item">
                <MapPin size={15} className="about-contact-icon" />
                <span>Jay Ambe Nagar, Thaltej, Ahmedabad - 380054</span>
              </span>
              <a
                href="https://github.com/gauravchavdavhits"
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-item"
              >
                <GithubIcon size={15} />
                <span>gauravchavdavhits</span>
              </a>
              <a
                href="https://www.linkedin.com/in/chavda-gaurav"
                target="_blank"
                rel="noopener noreferrer"
                className="about-contact-item"
              >
                <LinkedinIcon size={15} />
                <span>chavda-gaurav</span>
              </a>
            </div>

            <div className="hero-actions-row">
              <NavLink to="/contact" className="btn-get-in-touch">
                <span>Get In Touch</span>
              </NavLink>
              <a
                href="/Gaurav_Chavda_Mern_Stack_Resume.pdf"
                download="Gaurav_Chavda_Mern_Stack_Resume.pdf"
                className="btn-view-resume"
                id="about-download-resume"
              >
                <FileDown size={16} />
                <span>Download Resume (PDF)</span>
              </a>
            </div>
          </div>

          {/* Right Column: Portrait Photo */}
          <div className="hero-image-wrapper">
            <div className="hero-image-container">
              <img
                src="/developer_portrait.jpg"
                alt="Gaurav Chavda - MERN Stack Developer"
                className="hero-portrait-img about-portrait-img"
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

      {/* 2. Three Pillars Grid: What I Focus On, How I Work, Currently Growing */}
      <div className="about-me-grid" ref={gridRef}>
        {/* Card 1: What I Focus On */}
        <div className="about-box focus-box about-reveal" style={{ '--reveal-delay': '0s' }}>
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
            <li className="about-stagger-item" style={{ '--stagger': '0' }}>
              <span className="focus-dot"></span>
              <span>Full Stack Development</span>
            </li>
            <li className="about-stagger-item" style={{ '--stagger': '1' }}>
              <span className="focus-dot"></span>
              <span>RESTful APIs</span>
            </li>
            <li className="about-stagger-item" style={{ '--stagger': '2' }}>
              <span className="focus-dot"></span>
              <span>Authentication</span>
            </li>
            <li className="about-stagger-item" style={{ '--stagger': '3' }}>
              <span className="focus-dot"></span>
              <span>Database Development</span>
            </li>
            <li className="about-stagger-item" style={{ '--stagger': '4' }}>
              <span className="focus-dot"></span>
              <span>Responsive UI</span>
            </li>
          </ul>
        </div>

        {/* Card 2: How I Work */}
        <div className="about-box workflow-box about-reveal" style={{ '--reveal-delay': '0.12s' }}>
          <div className="about-box-top">
            <div className="about-box-icon">
              <Cpu size={22} />
            </div>
            <div>
              <span className="about-box-pill">Mindset</span>
              <h3 className="about-box-title">How I Work</h3>
            </div>
          </div>
          <div className="about-quote-card about-stagger-item" style={{ '--stagger': '0' }}>
            <p className="about-quote-body">
              "I focus on understanding the problem first and building clean, structured, and maintainable solutions."
            </p>
          </div>
          <div className="workflow-highlights">
            <div className="workflow-check-item about-stagger-item" style={{ '--stagger': '1' }}>
              <CheckCircle2 size={16} className="text-accent" />
              <span>Architecture before implementation</span>
            </div>
            <div className="workflow-check-item about-stagger-item" style={{ '--stagger': '2' }}>
              <CheckCircle2 size={16} className="text-accent" />
              <span>Clean, decoupled MVC patterns</span>
            </div>
            <div className="workflow-check-item about-stagger-item" style={{ '--stagger': '3' }}>
              <CheckCircle2 size={16} className="text-accent" />
              <span>High emphasis on performance & security</span>
            </div>
          </div>
        </div>

        {/* Card 3: Currently Growing */}
        <div className="about-box growing-box about-reveal" style={{ '--reveal-delay': '0.24s' }}>
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
            <div className="growing-chip about-stagger-item" style={{ '--stagger': '0' }}>
              <span className="chip-indicator"></span>
              <span>Advanced backend concepts</span>
            </div>
            <div className="growing-chip about-stagger-item" style={{ '--stagger': '1' }}>
              <span className="chip-indicator"></span>
              <span>Redis</span>
            </div>
            <div className="growing-chip about-stagger-item" style={{ '--stagger': '2' }}>
              <span className="chip-indicator"></span>
              <span>Docker</span>
            </div>
            <div className="growing-chip about-stagger-item" style={{ '--stagger': '3' }}>
              <span className="chip-indicator"></span>
              <span>AWS</span>
            </div>
            <div className="growing-chip about-stagger-item" style={{ '--stagger': '4' }}>
              <span className="chip-indicator"></span>
              <span>Deployment</span>
            </div>
            <div className="growing-chip about-stagger-item" style={{ '--stagger': '5' }}>
              <span className="chip-indicator"></span>
              <span>API documentation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
