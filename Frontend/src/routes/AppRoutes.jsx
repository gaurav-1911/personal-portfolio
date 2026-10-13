import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout/PublicLayout';
import { UrlNormalizer } from '../components/common/UrlNormalizer/UrlNormalizer';
import { ScrollToTop } from '../components/common/ScrollToTop/ScrollToTop';

// React Router Lazy Loaded Public Pages (from dedicated component directories)
const Home = lazy(() => import('../pages/public/Home/Home'));
const About = lazy(() => import('../pages/public/About/About'));
const Skills = lazy(() => import('../pages/public/Skills/Skills'));
const Experience = lazy(() => import('../pages/public/Experience/Experience'));
const Projects = lazy(() => import('../pages/public/Projects/Projects'));
const ProjectDetails = lazy(() => import('../pages/public/ProjectDetails/ProjectDetails'));
const Contact = lazy(() => import('../pages/public/Contact/Contact'));
const Resume = lazy(() => import('../pages/public/Resume/Resume'));
const NotFound = lazy(() => import('../pages/public/NotFound/NotFound'));

// Smooth Non-Blocking Top Progress & Suspense Fallback
export const PageLoader = () => (
  <div className="page-transition-fallback" role="status" aria-live="polite">
    <div className="top-route-progress" aria-hidden="true">
      <div className="top-route-progress-bar" />
    </div>
    <div className="page-smooth-skeleton">
      <div className="spinner" />
      <span className="page-loader-text">Loading...</span>
    </div>
  </div>
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <UrlNormalizer />
      <ScrollToTop />
      <Routes>
        {/* Public Website Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/experience" element={<Experience />} />
          {/* Also support /journey alias */}
          <Route path="/journey" element={<Navigate to="/experience" replace />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/resume" element={<Resume />} />
          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
