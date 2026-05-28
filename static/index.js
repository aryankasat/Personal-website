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
      const urlParts = profile.socials.linkedin.replace(/\/$/, '').split('/');
      const username = urlParts[urlParts.length - 1];
      linkedinEl.textContent = username || 'Profile';
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
        <div class="exp-date">
          <div class="exp-company-name">${exp.company}</div>
          <div class="exp-date-range">${dateRange}</div>
        </div>
        <div class="exp-content">
          <h3>${exp.position}</h3>
          ${highlightsHTML ? `<ul class="exp-highlights">${highlightsHTML}</ul>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderBlogsSection(blogs) {
  const container = document.getElementById('blogs-list');
  if (!container || !blogs) return;
  
  container.innerHTML = blogs.map(blog => {
    const coverImage = blog.image || (blog.images && blog.images.length > 0 ? blog.images[0] : '');
    const mediaHTML = coverImage 
      ? `<div class="article-card-media">
           <img src="${coverImage}" alt="${blog.title}" class="article-card-img" style="width:100%; height:100%; object-fit:cover;">
         </div>`
      : '';
    return `
      <div class="article-card" data-id="${blog.slug}" data-type="blog">
        ${mediaHTML}
        <h3>${blog.title}</h3>
        <div class="article-card-footer">
          <div class="article-read-btn">Read Blog ↗</div>
          <span class="article-meta-date">${blog.readTime || '5 min read'}</span>
        </div>
      </div>
    `;
  }).join('');

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
    const mediaHTML = proj.image 
      ? `<div class="article-card-media">
           <img src="${proj.image}" alt="${proj.title}" class="article-card-img" style="width:100%; height:100%; object-fit:cover;">
         </div>`
      : '';
    return `
      <div class="proj-card" data-id="${proj.id}">
        ${mediaHTML}
        <h3>${proj.title}</h3>
        <p class="proj-desc">${proj.description}</p>
        ${proj.link ? `<a href="${proj.link}" target="_blank" rel="noopener noreferrer" class="proj-link">View Repository ↗</a>` : ''}
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

  container.querySelectorAll('.proj-card .proj-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
}

function renderPapersSection(publications) {
  const container = document.getElementById('papers-list');
  if (!container || !publications) return;
  
  container.innerHTML = publications.map(pub => {
    const highlightsHTML = pub.highlights 
      ? `<ul class="paper-highlights">${pub.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` 
      : `<p class="paper-desc">${pub.description}</p>`;
      
    return `
      <div class="paper-item">
        <span class="paper-venue-badge">${pub.venue}</span>
        <h3>${pub.title}</h3>
        ${highlightsHTML}
        ${pub.link ? `<a href="${pub.link}" target="_blank" rel="noopener noreferrer" style="font-size: 13px; font-weight:600; display:inline-block; margin-top:8px;">Read Paper ↗</a>` : ''}
      </div>
    `;
  }).join('');
}

function renderCertificationsSection(certifications) {
  const container = document.getElementById('certifications-list');
  if (!container || !certifications) return;
  
  container.innerHTML = certifications.map(cert => `
    <div class="cert-card" data-id="${cert.id}">
      <div>
        <h3>${cert.title}</h3>
        <span class="cert-issuer">${cert.issuer}</span>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.getAttribute('data-id'));
      const cert = certifications.find(c => c.id === id);
      if (cert) openCertModal(cert);
    });
  });
}

function renderSystemDesignsSection(systemDesigns) {
  const container = document.getElementById('system-designs-list');
  if (!container || !systemDesigns) return;
  
  container.innerHTML = systemDesigns.map(design => {
    const coverImage = design.image || (design.images && design.images.length > 0 ? design.images[0] : '');
    const mediaHTML = coverImage 
      ? `<div class="article-card-media">
           <img src="${coverImage}" alt="${design.title}" class="article-card-img" style="width:100%; height:100%; object-fit:cover;">
         </div>`
      : '';
    return `
      <div class="article-card" data-id="${design.slug}" data-type="design">
        ${mediaHTML}
        <h3>${design.title}</h3>
        <div class="article-card-footer">
          <div class="article-read-btn">Read Article ↗</div>
        </div>
      </div>
    `;
  }).join('');

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
  const highlights = project.highlights ? project.highlights.map(h => `<li>${h}</li>`).join('') : '';
  
  const formattedHTML = `
    <div style="margin-bottom: 24px; border-bottom: 1.5px solid var(--border-color); padding-bottom: 16px;">
      <h2 style="font-size:24px; margin: 4px 0;">${project.title}</h2>
    </div>
    <div class="markdown-body">
      <p>${project.fullDescription || project.description}</p>
      ${highlights ? `
        <h3 style="font-size:16px; margin:20px 0 10px 0;">Key Accomplishments</h3>
        <ul>${highlights}</ul>
      ` : ''}
      ${project.link ? `
        <div style="margin-top:24px;">
          <a href="${project.link}" target="_blank" rel="noopener noreferrer" style="font-size:14px; font-weight:700;">View Code Repository ↗</a>
        </div>
      ` : ''}
    </div>
  `;
  openModal(formattedHTML);
}

function openCertModal(cert) {
  const isPdf = cert.image && cert.image.toLowerCase().endsWith('.pdf');
  const certificateVisualHTML = cert.image 
    ? (isPdf 
       ? `<div style="text-align: center; margin-bottom: 24px; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; background: var(--bg-secondary); height: 500px;">
            <iframe src="${cert.image}" style="width: 100%; height: 100%; border: none;"></iframe>
          </div>`
       : `<div style="text-align: center; margin-bottom: 24px; border: 1px solid var(--border-color); border-radius: var(--radius-md); overflow: hidden; background: var(--bg-secondary);">
            <img src="${cert.image}" alt="${cert.title}" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">
          </div>`)
    : `<!-- Digital Certificate Representation -->
       <div class="digital-certificate" style="
         background: radial-gradient(circle at 10% 20%, rgba(249, 248, 244, 1) 0%, rgba(244, 241, 234, 1) 90%);
         border: 8px double #dcd6cd;
         padding: 32px 24px;
         position: relative;
         text-align: center;
         border-radius: var(--radius-md);
         box-shadow: 0 4px 20px rgba(0,0,0,0.03);
       ">
         <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--color-accent); letter-spacing: 0.12em; margin-bottom: 10px;">Certificate of Completion</div>
         <div style="font-family: var(--font-headings); font-size: 14px; font-style: italic; margin-bottom: 12px; color: var(--text-secondary);">This professional credential is awarded to</div>
         <h2 style="font-family: var(--font-headings); font-size: 24px; font-weight: 500; color: var(--text-primary); border-bottom: 2px solid var(--color-accent); display: inline-block; padding-bottom: 6px; margin: 0 auto 16px auto;">Aryan Kasat</h2>
         
         <p style="font-size: 13px; max-width: 460px; margin: 0 auto 16px auto; line-height: 1.5; color: var(--text-secondary);">
           for successfully fulfilling all training requirements and evaluations for
         </p>
         <h3 style="font-size: 18px; font-weight: 700; color: var(--color-accent); margin-bottom: 20px; line-height: 1.3;">${cert.title}</h3>
         
         <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px; border-top: 1px solid var(--border-color); padding-top: 16px; text-align: left;">
           <div>
             <span style="font-size: 10px; text-transform: uppercase; color: var(--text-muted); display: block; font-weight: 600; letter-spacing: 0.05em;">Issuer</span>
             <span style="font-size: 12.5px; font-weight: 700; color: var(--text-primary);">${cert.issuer}</span>
           </div>
           <div style="text-align: right;">
             <span style="font-size: 10px; text-transform: uppercase; color: var(--text-muted); display: block; font-weight: 600; letter-spacing: 0.05em;">Date Issued</span>
             <span style="font-size: 12.5px; font-weight: 700; color: var(--text-primary);">${cert.date}</span>
           </div>
         </div>
         
         <div style="margin-top: 20px; font-family: var(--font-mono); font-size: 9.5px; color: var(--text-muted);">
           Credential ID: <span style="font-weight: 600; color: var(--text-primary);">${cert.credentialId || 'N/A'}</span>
         </div>
       </div>`;

  const formattedHTML = `
    <div class="markdown-body">
      ${certificateVisualHTML}
      
      ${cert.verificationLink ? `
        <div style="margin-top: 24px; text-align: center;">
          <a href="${cert.verificationLink}" target="_blank" rel="noopener noreferrer" style="
            display: inline-block;
            padding: 10px 24px;
            background-color: var(--color-accent);
            color: #ffffff;
            font-size: 13.5px;
            font-weight: 600;
            text-decoration: none;
            border-radius: var(--radius-sm);
            box-shadow: 0 4px 12px rgba(29, 78, 216, 0.15);
            transition: opacity var(--transition-speed) ease;
          " onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">Verify Official Credential ↗</a>
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
