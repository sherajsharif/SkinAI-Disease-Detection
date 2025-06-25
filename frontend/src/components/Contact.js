import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <div className="contact-bg">
      <div className="contact-card animated-fade-in">
        <h1 className="contact-title">💫 Hi 👋, I'm Sheraj Sharif</h1>
        <div className="typing-anim" style={{ display: 'flex', justifyContent: 'center' }}>
          <a href="https://git.io/typing-svg" target="_blank" rel="noopener noreferrer">
            <img src="https://readme-typing-svg.herokuapp.com?color=%2336BCF7&lines=AI+%26+Data+Science+Enthusiast;Machine+Learning+Specialist;Flutter+Application+Developer;Proficient+in+Python%2C+C%2B%2B" alt="Typing SVG" style={{ maxWidth: '100%', height: '40px' }} />
          </a>
        </div>
        <div className="contact-info">
          <div className="contact-row">
            <span className="contact-label">Portfolio:</span>
            <a href="https://sherajsharif.github.io/sherajportfolio.github.io/" target="_blank" rel="noopener noreferrer">sherajsharif.github.io/sherajportfolio.github.io</a>
          </div>
          <div className="contact-row">
            <span className="contact-label">Phone:</span>
            <a href="tel:+916260132440">+91-6260132440</a>
          </div>
          <div className="contact-row">
            <span className="contact-label">Email:</span>
            <a href="mailto:sherajsharif786@gmail.com">sherajsharif786@gmail.com</a>
          </div>
          <div className="contact-row">
            <span className="contact-label">Socials:</span>
          </div>
          <div className="contact-socials">
            <a href="https://www.linkedin.com/in/sheraj-sharif-652723250/" target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
            </a>
            <a href="https://github.com/sherajsharif" target="_blank" rel="noopener noreferrer" title="GitHub">
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.563.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576 4.765-1.588 8.199-6.084 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://www.instagram.com/sheraj_sharif" target="_blank" rel="noopener noreferrer" title="Instagram">
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.131 4.602.425 3.635 1.392 2.668 2.359 2.374 3.532 2.315 4.808 2.256 6.088 2.243 6.497 2.243 12c0 5.503.013 5.912.072 7.192.059 1.276.353 2.449 1.32 3.416.967.967 2.14 1.261 3.416 1.32 1.28.059 1.689.072 7.192.072s5.912-.013 7.192-.072c1.276-.059 2.449-.353 3.416-1.32.967-.967 1.261-2.14 1.32-3.416.059-1.28.072-1.689.072-7.192s-.013-5.912-.072-7.192c-.059-1.276-.353-2.449-1.32-3.416C21.241.425 20.068.131 18.792.072 17.512.013 17.103 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
            </a>
            <a href="https://leetcode.com/u/sheraj_sharif/" target="_blank" rel="noopener noreferrer" title="LeetCode">
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 50 50"><path d="M44.6 23.4L28.1 6.9c-1.2-1.2-3.1-1.2-4.2 0l-2.1 2.1c-1.2 1.2-1.2 3.1 0 4.2l13.2 13.2-13.2 13.2c-1.2 1.2-1.2 3.1 0 4.2l2.1 2.1c1.2 1.2 3.1 1.2 4.2 0l16.5-16.5c1.2-1.2 1.2-3.1 0-4.2z"/></svg>
            </a>
          </div>
        </div>
        <div className="contact-bio">
          <h3 style={{ marginBottom: '0.7rem', fontSize: '1.15rem', color: '#166534' }}>🛠️ Tools Used in This Project:</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
            <img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54" alt="Python" />
            <img src="https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
            <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
            <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E" alt="JavaScript" />
            <img src="https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
            <img src="https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
            <img src="https://img.shields.io/badge/tensorflow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white" alt="TensorFlow" />
            <img src="https://img.shields.io/badge/Keras-%23D00000.svg?style=for-the-badge&logo=Keras&logoColor=white" alt="Keras" />
            <img src="https://img.shields.io/badge/OpenCV-%23white.svg?style=for-the-badge&logo=opencv&logoColor=white" alt="OpenCV" />
            <img src="https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white" alt="Pandas" />
            <img src="https://img.shields.io/badge/numpy-%23013243.svg?style=for-the-badge&logo=numpy&logoColor=white" alt="NumPy" />
            <img src="https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
            <img src="https://img.shields.io/badge/Jupyter-%23F37626.svg?style=for-the-badge&logo=Jupyter&logoColor=white" alt="Jupyter Notebook" />
            <img src="https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white" alt="Render" />
            <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
            <img src="https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white" alt="Git" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact; 