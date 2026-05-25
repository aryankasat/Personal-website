/* JS Controller: Consolidated Minimalist Frontend with Navigation & Redirects */

const API_BASE_URL = '/api';

// Loading overlay tracker
let activeRequests = 0;
function toggleLoader(show) {
  const loader = document.getElementById('global-loader');
  if (!loader) return;
  if (show) {
    activeRequests++;
    loader.classList.remove('hidden');
  } else {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) {
      loader.classList.add('hidden');
    }
  }
}

// Fetch helper
async function fetchAPI(endpoint) {
  toggleLoader(true);
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} on ${endpoint}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API fetch failed:', error);
    return null;
  } finally {
    toggleLoader(false);
  }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
  setupModalEvents();
  setupScrollSpy();
  setupKineticNetwork();
  
  // Concurrently load all resources
  const [
    profile,
    overview,
    experienceData,
    projectsData,
    publicationsData,
    certificationsData,
    blogsData,
    systemDesignsData
  ] = await Promise.all([
    fetchAPI('/profile'),
    fetchAPI('/overview'),
    fetchAPI('/experience'),
    fetchAPI('/projects'),
    fetchAPI('/publications'),
    fetchAPI('/certifications'),
    fetchAPI('/blogs'),
    fetchAPI('/system-designs')
  ]);

  // Render components
  renderNameSection(profile);
  renderDetailsSection(overview, profile);
  renderExperienceSection(experienceData?.experience);
  renderBlogsSection(blogsData?.blogs);
  renderProjectsSection(projectsData?.projects);
  renderPapersSection(publicationsData?.publications);
  renderCertificationsSection(certificationsData);
  renderSystemDesignsSection(systemDesignsData?.system_designs);
});

/* Renderers */

function renderNameSection(profile) {
  if (!profile) return;
  const nameEl = document.getElementById('user-name');
  const titleEl = document.getElementById('user-title');
  const taglineEl = document.getElementById('user-tagline');
  
  if (nameEl) nameEl.textContent = profile.name;
  if (titleEl) titleEl.textContent = profile.title;
  if (taglineEl) taglineEl.textContent = profile.tagline;
}

function renderDetailsSection(overview, profile) {
  if (overview && overview.summary) {
    const summaryEl = document.getElementById('about-summary');
    if (summaryEl) summaryEl.textContent = overview.summary;
  }
  
  if (profile) {
    const linkedinEl = document.getElementById('contact-linkedin');
    const emailEl = document.getElementById('contact-email');
    const phoneEl = document.getElementById('contact-phone');
    const socialEl = document.getElementById('social-links');
    
    if (linkedinEl && profile.socials && profile.socials.linkedin) {
      linkedinEl.href = profile.socials.linkedin;
      linkedinEl.textContent = profile.socials.linkedin;
      linkedinEl.title = profile.socials.linkedin;
    }
    if (emailEl) {
      emailEl.textContent = profile.email;
      emailEl.href = `mailto:${profile.email}`;
    }
    if (phoneEl) phoneEl.textContent = profile.phone;
    
    if (socialEl && profile.socials) {
      const s = profile.socials;
      socialEl.innerHTML = `
        ${s.github ? `<a href="${s.github}" target="_blank" rel="noopener noreferrer" title="GitHub">${getSVG('github')}</a>` : ''}
        ${s.scholar ? `<a href="${s.scholar}" target="_blank" rel="noopener noreferrer" title="Google Scholar">${getSVG('scholar')}</a>` : ''}
        ${s.leetcode ? `<a href="${s.leetcode}" target="_blank" rel="noopener noreferrer" title="LeetCode">${getSVG('leetcode')}</a>` : ''}
      `;
    }
  }
}

function renderExperienceSection(experience) {
  const container = document.getElementById('experience-list');
  if (!container || !experience) return;
  
  container.innerHTML = experience.map(exp => {
    const dateRange = exp.current ? `${exp.startDate} - Present` : `${exp.startDate} - ${exp.endDate}`;
    const highlightsHTML = exp.highlights ? exp.highlights.map(h => `<li>${h}</li>`).join('') : '';
    
    return `
      <div class="exp-item">
        <div class="exp-date">${dateRange}</div>
        <div class="exp-content">
          <h3>${exp.position}</h3>
          <span class="exp-company">${exp.company}</span>
          <p class="exp-desc">${exp.description}</p>
          ${highlightsHTML ? `<ul class="exp-highlights">${highlightsHTML}</ul>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderBlogsSection(blogs) {
  const container = document.getElementById('blogs-list');
  if (!container || !blogs) return;
  
  container.innerHTML = blogs.map(blog => `
    <div class="article-card" data-id="${blog.slug}" data-type="blog">
      <div class="article-card-media">
        <div class="article-media-placeholder">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
          <span>Image / Icon Space</span>
        </div>
      </div>
      <div class="article-card-header">
        <span class="article-category">${blog.category}</span>
        <span class="article-meta-date">${blog.date} • ${blog.readTime || '5 min read'}</span>
      </div>
      <h3>${blog.title}</h3>
      <p class="article-summary-text">${blog.summary}</p>
      <div class="article-read-btn">Read Article ↗</div>
    </div>
  `).join('');

  container.querySelectorAll('.article-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      window.open(`article.html?type=blog&id=${id}`, '_blank');
    });
  });
}

function renderProjectsSection(projects) {
  const container = document.getElementById('projects-list');
  if (!container || !projects) return;
  
  container.innerHTML = projects.map(proj => {
    const techTags = proj.technologies ? proj.technologies.map(t => `<span class="tech-badge">${t}</span>`).join('') : '';
    return `
      <div class="proj-card" data-id="${proj.id}">
        <span class="proj-category">${proj.category.replace(/-/g, ' ')}</span>
        <h3>${proj.title}</h3>
        <p class="proj-desc">${proj.description}</p>
        <div class="proj-techs">${techTags}</div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.getAttribute('data-id'));
      const project = projects.find(p => p.id === id);
      if (project) openProjectModal(project);
    });
  });
}

function renderPapersSection(publications) {
  const container = document.getElementById('papers-list');
  if (!container || !publications) return;
  
  container.innerHTML = publications.map(pub => {
    const formattedAuthors = pub.authors
      ? pub.authors.map(a => a.includes('Aryan Kasat') ? `<span class="author-highlight">${a}</span>` : a).join(', ')
      : '';
    
    return `
      <div class="paper-item">
        <span class="paper-venue-badge">${pub.venue}</span>
        <h3>${pub.title}</h3>
        <div class="paper-authors">By ${formattedAuthors}</div>
        <p class="paper-desc">${pub.description}</p>
        ${pub.link ? `<a href="${pub.link}" target="_blank" rel="noopener noreferrer" style="font-size: 13px; font-weight:600; display:inline-block; margin-top:8px;">Read Document ↗</a>` : ''}
      </div>
    `;
  }).join('');
}

function renderCertificationsSection(certifications) {
  const container = document.getElementById('certifications-list');
  if (!container || !certifications) return;
  
  container.innerHTML = certifications.map(cert => `
    <div class="cert-card">
      <div>
        <h3>${cert.title}</h3>
        <span class="cert-issuer">${cert.issuer}</span>
      </div>
      <span class="cert-date">${cert.date}</span>
    </div>
  `).join('');
}

function renderSystemDesignsSection(systemDesigns) {
  const container = document.getElementById('system-designs-list');
  if (!container || !systemDesigns) return;
  
  container.innerHTML = systemDesigns.map(design => `
    <div class="article-card" data-id="${design.slug}" data-type="design">
      <div class="article-card-media">
        <div class="article-media-placeholder">
          <svg viewBox="0 0 24 24">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          <span>Architecture / Diagram Space</span>
        </div>
      </div>
      <div class="article-card-header">
        <span class="article-category">${design.category}</span>
        <span class="article-meta-date">${design.date} • ${design.readTime || '5 min read'}</span>
      </div>
      <h3>${design.title}</h3>
      <p class="article-summary-text">${design.summary}</p>
      <div class="article-read-btn">Read Layout ↗</div>
    </div>
  `).join('');

  container.querySelectorAll('.article-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      window.open(`article.html?type=design&id=${id}`, '_blank');
    });
  });
}

/* Modals Management (Only for Projects details modal now) */

function openModal(htmlContent) {
  const modal = document.getElementById('global-modal');
  const body = document.getElementById('modal-body-content');
  if (!modal || !body) return;
  body.innerHTML = htmlContent;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  modal.focus();
}

function closeModal() {
  const modal = document.getElementById('global-modal');
  const body = document.getElementById('modal-body-content');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => { if (body) body.innerHTML = ''; }, 200);
}

function setupModalEvents() {
  const overlay = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  if (overlay) overlay.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function openProjectModal(project) {
  const techTags = project.technologies ? project.technologies.map(t => `<span class="tech-badge">${t}</span>`).join('') : '';
  const highlights = project.highlights ? project.highlights.map(h => `<li>${h}</li>`).join('') : '';
  
  const formattedHTML = `
    <div style="margin-bottom: 24px; border-bottom: 1.5px solid var(--border-color); padding-bottom: 16px;">
      <span style="font-size: 11px; font-weight:700; text-transform:uppercase; color:var(--text-muted);">${project.category.replace(/-/g, ' ')}</span>
      <h2 style="font-size:24px; margin: 4px 0;">${project.title}</h2>
    </div>
    <div class="markdown-body">
      <p>${project.fullDescription || project.description}</p>
      ${highlights ? `
        <h3 style="font-size:16px; margin:20px 0 10px 0;">Key Accomplishments</h3>
        <ul>${highlights}</ul>
      ` : ''}
      <h3 style="font-size:16px; margin:20px 0 10px 0;">Technologies Stack</h3>
      <div class="proj-techs">${techTags}</div>
      ${project.link ? `
        <div style="margin-top:24px;">
          <a href="${project.link}" target="_blank" rel="noopener noreferrer" style="font-size:14px; font-weight:700;">View Code Repository ↗</a>
        </div>
      ` : ''}
    </div>
  `;
  openModal(formattedHTML);
}

/* Scroll Active State Highlights (Scroll Spy) */
function setupScrollSpy() {
  const sections = document.querySelectorAll('header, section');
  const navLinks = document.querySelectorAll('.nav-link-btn');
  
  if (sections.length === 0 || navLinks.length === 0) return;
  
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPosition = window.scrollY + 100; // Offset for sticky navigation bar
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = id;
      }
    });
    
    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* SVG Helpers */
function getSVG(name) {
  if (name === 'github') {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>`;
  }
  if (name === 'linkedin') {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`;
  }
  if (name === 'scholar') {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path></svg>`;
  }
  if (name === 'leetcode') {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.05 13.06c-.34-.35-.78-.52-1.3-.52a1.8 1.8 0 0 0-1.28.52l-2.07 2.06c-.35.34-.78.52-1.29.52s-.94-.18-1.29-.52L8.27 12.6c-.35-.34-.52-.77-.52-1.28s.17-.94.52-1.29l3.05-3.05a1.8 1.8 0 0 1 1.29-.52c.5 0 .94.17 1.29.52l2.06 2.06c.35.34.78.52 1.29.52s.94-.18 1.29-.52c.35-.35.52-.78.52-1.3s-.17-.94-.52-1.29L14.39 3.5a3.63 3.63 0 0 0-5.18 0L3.5 9.2c-.7.71-1.07 1.57-1.07 2.6s.37 1.88 1.07 2.59l5.71 5.71a3.63 3.63 0 0 0 5.18 0l3.59-3.59c.35-.35.52-.78.52-1.29a1.8 1.8 0 0 0-.52-1.3c-.01 0-.01 0-.01-.01z"></path></svg>`;
  }
  return '';
}

/* Interactive Soft Kinetic Network Animation Engine */
function setupKineticNetwork() {
  const canvas = document.getElementById('kinetic-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  let mouse = { x: null, y: null, radius: 160 };
  
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
      
      const colors = [
        'rgba(29, 78, 216, 0.25)', // Cobalt Blue
        'rgba(2, 132, 199, 0.20)', // Steel Blue
        'rgba(100, 116, 139, 0.20)' // Slate Gray
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.hypot(dx, dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x += (dx / distance) * force * 0.4;
          this.y += (dy / distance) * force * 0.4;
        }
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  function initParticles() {
    particles = [];
    const density = Math.floor((canvas.width * canvas.height) / 10000);
    const count = Math.min(Math.max(density, 40), 120);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.hypot(dx, dy);
        
        if (distance < 120) {
          const opacity = (1 - distance / 120) * 0.12;
          ctx.strokeStyle = `rgba(29, 78, 216, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      
      if (mouse.x !== null && mouse.y !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const distance = Math.hypot(dx, dy);
        if (distance < mouse.radius) {
          const opacity = (1 - distance / mouse.radius) * 0.50;
          ctx.strokeStyle = `rgba(29, 78, 216, ${opacity})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  animate();
}
