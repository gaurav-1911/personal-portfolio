/**
 * Core technologies & their official documentation links.
 * Uses BASE_URL so assets load correctly on subpaths (e.g. GitHub Pages).
 */
const base = import.meta.env.BASE_URL.replace(/\/+$/, '') + '/';

export const TECH_ITEMS = [
  {
    name: 'React.js',
    docUrl: 'https://react.dev/',
    icon: (
      <img
        src={`${base}react.svg`}
        alt="React.js"
        width="22"
        height="22"
        className="marquee-tech-icon-img"
      />
    ),
  },
  {
    name: 'Node.js',
    docUrl: 'https://nodejs.org/docs/latest/api/',
    icon: (
      <img
        src={`${base}nodejs.svg`}
        alt="Node.js"
        width="22"
        height="22"
        className="marquee-tech-icon-img"
      />
    ),
  },
  {
    name: 'Express.js',
    docUrl: 'https://expressjs.com/',
    icon: (
      <img
        src={`${base}expressjs-logo.png`}
        alt="Express.js"
        width="22"
        height="22"
        className="marquee-tech-icon-img rounded"
      />
    ),
  },
  {
    name: 'MongoDB',
    docUrl: 'https://www.mongodb.com/docs/',
    icon: (
      <img
        src={`${base}mongodb.svg`}
        alt="MongoDB"
        width="22"
        height="22"
        className="marquee-tech-icon-img"
      />
    ),
  },
  {
    name: 'MySQL',
    docUrl: 'https://dev.mysql.com/doc/',
    icon: (
      <img
        src={`${base}mysql.svg`}
        alt="MySQL"
        width="22"
        height="22"
        className="marquee-tech-icon-img"
      />
    ),
  },
  {
    name: 'Git',
    docUrl: 'https://git-scm.com/doc',
    icon: (
      <img
        src={`${base}git.svg`}
        alt="Git"
        width="22"
        height="22"
        className="marquee-tech-icon-img"
      />
    ),
  },
  {
    name: 'REST API',
    docUrl: 'https://restfulapi.net/',
    icon: (
      <img
        src={`${base}rest_api.svg`}
        alt="REST API"
        width="22"
        height="22"
        className="marquee-tech-icon-img"
      />
    ),
  },
  {
    name: 'JWT Auth',
    docUrl: 'https://jwt.io/introduction',
    icon: (
      <img
        src={`${base}jwt_si.svg`}
        alt="JWT Auth"
        width="22"
        height="22"
        className="marquee-tech-icon-img"
      />
    ),
  },
  {
    name: 'MVC Architecture',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Glossary/MVC',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="marquee-tech-svg-icon">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    name: 'Joi Validation',
    docUrl: 'https://joi.dev/api/',
    icon: (
      <img
        src={`${base}joi.png`}
        alt="Joi Validation"
        width="22"
        height="22"
        className="marquee-tech-icon-img"
      />
    ),
  },
  {
    name: 'Multer',
    docUrl: 'https://github.com/expressjs/multer',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="marquee-tech-svg-icon">
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="M12 12v9" />
        <path d="m16 16-4-4-4 4" />
      </svg>
    ),
  },
  {
    name: 'Redux Toolkit',
    docUrl: 'https://redux-toolkit.js.org/',
    icon: (
      <img
        src={`${base}redux.svg`}
        alt="Redux Toolkit"
        width="22"
        height="22"
        className="marquee-tech-icon-img"
      />
    ),
  },
  {
    name: 'HTML5',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
    icon: (
      <img
        src={`${base}html5.svg`}
        alt="HTML5"
        width="22"
        height="22"
        className="marquee-tech-icon-img"
      />
    ),
  },
  {
    name: 'CSS3',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
    icon: (
      <img
        src={`${base}css3.svg`}
        alt="CSS3"
        width="22"
        height="22"
        className="marquee-tech-icon-img"
      />
    ),
  },
  {
    name: 'MUI',
    docUrl: 'https://mui.com/material-ui/getting-started/',
    icon: (
      <img
        src={`${base}materialui.svg`}
        alt="MUI"
        width="22"
        height="22"
        className="marquee-tech-icon-img"
      />
    ),
  },
  {
    name: 'TypeScript',
    docUrl: 'https://www.typescriptlang.org/docs/',
    icon: (
      <img
        src={`${base}typescript.svg`}
        alt="TypeScript"
        width="22"
        height="22"
        className="marquee-tech-icon-img"
      />
    ),
  },
  {
    name: 'JavaScript',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
    icon: (
      <img
        src={`${base}javascript.svg`}
        alt="JavaScript"
        width="22"
        height="22"
        className="marquee-tech-icon-img"
      />
    ),
  },
  {
    name: 'Bootstrap',
    docUrl: 'https://getbootstrap.com/docs/',
    icon: (
      <img
        src={`${base}bootstrap.svg`}
        alt="Bootstrap"
        width="22"
        height="22"
        className="marquee-tech-icon-img"
      />
    ),
  },
];