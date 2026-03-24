const API_BASE = 'http://localhost:3001/api';

class App {
  constructor() {
    this.state = {
      currentPage: 'landing',
      user: null,
      candidate: null,
      selectedCandidates: []
    };
    this.init();
  }

  async init() {
    this.checkAuth();
    this.render();
  }

  checkAuth() {
    const user = localStorage.getItem('user');
    if (user) {
      this.state.user = JSON.parse(user);
    }
  }

  setPage(page) {
    this.state.currentPage = page;
    this.render();
  }

  async render() {
    const app = document.getElementById('app');
    
    if (this.state.currentPage === 'landing') {
      app.innerHTML = this.renderLanding();
    } else if (this.state.currentPage === 'auth') {
      app.innerHTML = this.renderAuth();
    } else if (this.state.currentPage === 'onboarding') {
      app.innerHTML = this.renderOnboarding();
    } else if (this.state.currentPage === 'builder') {
      app.innerHTML = this.renderBuilder();
    } else if (this.state.currentPage === 'dashboard') {
      app.innerHTML = this.renderDashboard();
    } else if (this.state.currentPage === 'preview') {
      app.innerHTML = this.renderPreview();
    }
    
    this.attachEventListeners();
  }

  renderLanding() {
    return `
      <div class="header">
        <div class="header-container">
          <div class="logo">AI Recruitment</div>
          <div class="cta-buttons">
            <button class="btn btn-primary" onclick="app.setPage('auth')">Get Started</button>
            <button class="btn btn-secondary" onclick="app.setPage('dashboard')">View Candidates</button>
          </div>
        </div>
      </div>
      <div class="main-container">
        <div class="landing">
          <h1>Build Your Profile with AI</h1>
          <p>No resume uploads. No standard forms. Just you and our AI assistant building your best professional profile.</p>
          <div class="cta-buttons">
            <button class="btn btn-primary" onclick="app.setPage('auth')">Start Building</button>
            <button class="btn btn-secondary" onclick="app.setPage('dashboard')">Explore Profiles</button>
          </div>
        </div>
      </div>
    `;
  }

  renderAuth() {
    return `
      <div class="header">
        <div class="header-container">
          <div class="logo">AI Recruitment</div>
          <button class="btn btn-secondary btn-small" onclick="app.setPage('landing')">← Back</button>
        </div>
      </div>
      <div class="main-container">
        <div class="form-container">
          <div id="auth-tabs" style="display: flex; gap: 16px; margin-bottom: 32px;">
            <button class="auth-tab active" data-tab="login" onclick="app.switchAuthTab('login')">Login</button>
            <button class="auth-tab" data-tab="signup" onclick="app.switchAuthTab('signup')">Sign Up</button>
          </div>
          
          <div id="login-form" class="auth-tab-content active">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" id="login-email" placeholder="hire-me@anshumat.org" value="hire-me@anshumat.org">
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" id="login-password" placeholder="HireMe@2025!" value="HireMe@2025!">
            </div>
            <button class="btn btn-primary" style="width: 100%;" onclick="app.login()">Login</button>
          </div>
          
          <div id="signup-form" class="auth-tab-content">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-input" id="signup-name" placeholder="Your Name">
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" class="form-input" id="signup-email" placeholder="you@example.com">
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" class="form-input" id="signup-password" placeholder="Create a strong password">
            </div>
            <button class="btn btn-primary" style="width: 100%;" onclick="app.signup()">Sign Up</button>
          </div>
        </div>
      </div>
    `;
  }

  renderOnboarding() {
    return `
      <div class="header">
        <div class="header-container">
          <div class="logo">AI Recruitment</div>
          <div class="user-info">
            ${this.state.user ? `<span>${this.state.user.name}</span>` : ''}
            <button class="logout-btn" onclick="app.logout()">Logout</button>
          </div>
        </div>
      </div>
      <div class="main-container">
        <div class="form-container">
          <h2 style="margin-bottom: 24px;">Welcome to Your AI Career Assistant</h2>
          <p style="margin-bottom: 24px; color: var(--text-light);">
            Let's build your professional profile together. No resume. No forms. Just a conversation about your work and achievements.
          </p>
          
          <div class="card">
            <div class="card-title">How it works</div>
            <div style="margin-top: 16px; font-size: 14px; color: var(--text-light);">
              <div style="margin-bottom: 12px;">✓ Chat with AI about your projects and skills</div>
              <div style="margin-bottom: 12px;">✓ AI extracts structured insights</div>
              <div style="margin-bottom: 12px;">✓ You review and refine</div>
              <div>✓ Recruiters see your best work</div>
            </div>
          </div>
          
          <button class="btn btn-primary" style="width: 100%; margin-top: 32px;" onclick="app.startBuilder()">
            Start Building Your Profile
          </button>
        </div>
      </div>
    `;
  }

  renderBuilder() {
    const isEditing = !!this.state.candidate;
    const candidateId = isEditing ? this.state.candidate.id : null;

    return `
      <div class="header">
        <div class="header-container">
          <div class="logo">AI Recruitment</div>
          <div class="user-info">
            <span>${this.state.user?.name || 'User'}</span>
            <button class="logout-btn" onclick="app.logout()">Logout</button>
          </div>
        </div>
      </div>
      <div class="main-container">
        ${this.state.candidate ? `
          <div class="progress-container">
            <div class="progress-label">
              <span>Profile Completion</span>
              <span>${this.state.candidate.completionPct}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${this.state.candidate.completionPct}%"></div>
            </div>
          </div>
        ` : ''}

        <div id="message-container"></div>

        <div class="two-pane">
          <div class="pane">
            <div class="pane-header">Chat with AI</div>
            <div class="chat-container">
              <div class="messages-container" id="messages">
                <div class="message-bubble ai">
                  <div class="bubble-content">Hi! Tell me about your most recent project or achievement. What problem did you solve?</div>
                </div>
              </div>
              <div class="chat-input-area">
                <input type="text" class="form-input" id="project-input" placeholder="Describe a project...">
                <button class="btn btn-primary btn-small" onclick="app.parseProject()">Send</button>
              </div>
            </div>
          </div>

          <div class="pane">
            <div class="pane-header">Profile Preview</div>
            <div class="canvas" id="preview-canvas">
              ${isEditing && this.state.candidate ? this.renderCandidatePreview(this.state.candidate) : '<div style="color: var(--text-light); font-size: 14px;">Your profile will appear here</div>'}
            </div>
          </div>
        </div>

        <div style="margin-top: 32px; display: flex; gap: 16px;">
          <button class="btn btn-secondary" onclick="app.setPage('onboarding')">← Back</button>
          <button class="btn btn-primary" onclick="app.setPage('dashboard')">View All Candidates</button>
        </div>
      </div>
    `;
  }

  renderCandidatePreview(candidate) {
    return `
      <div>
        <div style="margin-bottom: 24px;">
          <div class="card-title">${candidate.displayName}</div>
          <div class="card-subtitle">${candidate.profileSummary || 'Building profile...'}</div>
        </div>

        ${candidate.skills.length > 0 ? `
          <div style="margin-bottom: 24px;">
            <div style="font-weight: 600; margin-bottom: 8px; font-size: 14px;">Skills</div>
            <div class="skills-container">
              ${candidate.skills.map(s => `<div class="skill-tag">${s.name} <span style="color: var(--text-light); font-size: 12px;">(L${s.level})</span></div>`).join('')}
            </div>
          </div>
        ` : ''}

        ${candidate.projects.length > 0 ? `
          <div>
            <div style="font-weight: 600; margin-bottom: 12px; font-size: 14px;">Projects</div>
            ${candidate.projects.map(p => `
              <div style="margin-bottom: 16px; padding: 12px; background: var(--surface); border-radius: 6px;">
                <div style="font-weight: 600; font-size: 13px;">${p.title}</div>
                <div style="font-size: 12px; color: var(--text-light); margin-top: 4px;">${p.problem}</div>
                ${p.metrics && p.metrics.length > 0 ? `
                  <div style="margin-top: 8px; font-size: 12px;">
                    ${p.metrics.map(m => `<span class="badge badge-success">${m.name}: ${m.value}${m.unit === 'percent' ? '%' : ''}</span>`).join(' ')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  renderDashboard() {
    const candidates = JSON.parse(localStorage.getItem('allCandidates') || '[]');

    return `
      <div class="header">
        <div class="header-container">
          <div class="logo">AI Recruitment</div>
          <div class="user-info">
            ${this.state.user ? `<span>${this.state.user.name}</span>` : ''}
            <button class="logout-btn" onclick="app.logout()">Logout</button>
          </div>
        </div>
      </div>
      <div class="main-container">
        <h2 style="margin-bottom: 24px;">Recruiter Dashboard</h2>

        <div class="dashboard-container">
          <div class="sidebar">
            <div class="sidebar-title">Filters</div>
            <div class="filter-group">
              <label class="filter-label">Skills</label>
              <input type="text" class="filter-input" placeholder="React, Node.js...">
            </div>
            <div class="filter-group">
              <label class="filter-label">Experience</label>
              <input type="text" class="filter-input" placeholder="2-4 years">
            </div>
            <div class="filter-group">
              <label class="filter-label">Impact Score</label>
              <input type="text" class="filter-input" placeholder="80+">
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-top: 24px;">Apply Filters</button>
          </div>

          <div class="results-area">
            <div style="font-size: 14px; font-weight: 600; margin-bottom: 24px;">All Candidates (${candidates.length})</div>
            ${candidates.length > 0 ? candidates.map((c, idx) => `
              <div class="candidate-card" onclick="app.viewCandidateDetails('${c.id}')">
                <div class="candidate-name">${c.displayName}</div>
                <div class="candidate-summary">${c.profileSummary || 'Building profile...'}</div>
                <div class="candidate-meta">
                  <span>✓ ${c.topSkills?.length || 0} Skills</span>
                  <span>✓ ${c.topProjects?.length || 0} Projects</span>
                  <span>⚡ ${c.completionPct || 0}% Complete</span>
                </div>
              </div>
            `).join('') : '<div style="color: var(--text-light);">No candidates yet.</div>'}
          </div>

          <div class="comparison-panel">
            <div class="comparison-title">Demo Candidate</div>
            <div id="demo-comparison" style="font-size: 13px;">
              ${candidates.length > 0 ? `
                <div class="comparison-item">
                  <div class="comparison-name">${candidates[0].displayName}</div>
                  <div class="comparison-value">${candidates[0].email}</div>
                </div>
                <div class="comparison-item">
                  <div class="comparison-name">Top Skills</div>
                  <div class="comparison-value">${candidates[0].topSkills?.slice(0, 3).map(s => s.name).join(', ') || 'N/A'}</div>
                </div>
                <div class="comparison-item">
                  <div class="comparison-name">Completion</div>
                  <div class="comparison-value">${candidates[0].completionPct}%</div>
                </div>
                <button class="btn btn-primary" style="width: 100%; margin-top: 16px;" onclick="app.viewCandidateDetails('${candidates[0].id}')">View Full Profile</button>
              ` : '<div style="color: var(--text-light);">Select a candidate to compare</div>'}
            </div>
          </div>
        </div>

        <div style="margin-top: 24px;">
          <button class="btn btn-secondary" onclick="app.setPage('landing')">← Back to Home</button>
        </div>
      </div>
    `;
  }

  renderPreview() {
    if (!this.state.candidate) {
      this.setPage('dashboard');
      return;
    }

    const c = this.state.candidate;

    return `
      <div class="header">
        <div class="header-container">
          <div class="logo">AI Recruitment</div>
          <button class="btn btn-secondary btn-small" onclick="app.setPage('dashboard')">← Back</button>
        </div>
      </div>
      <div class="main-container">
        <div style="max-width: 800px; margin: 0 auto;">
          <div class="card">
            <div class="card-header">
              <div>
                <div class="card-title">${c.displayName}</div>
                <div class="card-subtitle">${c.email}</div>
              </div>
              <div style="display: flex; gap: 8px;">
                <span class="badge badge-info">${c.completionPct}% Complete</span>
              </div>
            </div>
            
            <div style="margin: 24px 0; padding: 24px; background: var(--surface); border-radius: 8px;">
              ${c.profileSummary || 'Profile summary building...'}
            </div>

            <div style="margin-bottom: 32px;">
              <div style="font-weight: 600; margin-bottom: 16px; font-size: 16px;">Skills (${c.topSkills?.length || 0})</div>
              <div class="skills-container">
                ${c.topSkills && c.topSkills.length > 0 ? c.topSkills.map(s => `
                  <div class="skill-tag">
                    ${s.name} <span style="color: var(--text-light); font-size: 11px;">L${s.level}</span>
                  </div>
                `).join('') : '<div style="color: var(--text-light); font-size: 14px;">No skills added yet</div>'}
              </div>
            </div>

            <div style="margin-bottom: 32px;">
              <div style="font-weight: 600; margin-bottom: 16px; font-size: 16px;">Projects (${c.topProjects?.length || 0})</div>
              ${c.topProjects && c.topProjects.length > 0 ? c.topProjects.map(p => `
                <div class="card" style="background: var(--surface); margin-bottom: 16px;">
                  <div class="card-title" style="margin-bottom: 8px;">${p.title}</div>
                  <div class="card-subtitle">${p.problem}</div>
                  ${p.metrics && p.metrics.length > 0 ? `
                    <div style="margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap;">
                      ${p.metrics.map(m => `
                        <span class="badge badge-success">
                          ${m.name}: ${m.value}${m.unit === 'percent' ? '%' : m.unit}
                        </span>
                      `).join('')}
                    </div>
                  ` : ''}
                  <div style="margin-top: 12px; font-size: 12px; color: var(--text-light);">
                    Tech: ${p.tech?.join(', ') || 'N/A'} | Ownership: ${(p.ownership * 100).toFixed(0)}%
                  </div>
                </div>
              `).join('') : '<div style="color: var(--text-light); font-size: 14px;">No projects added yet</div>'}
            </div>

            <div style="display: flex; gap: 12px;">
              <button class="btn btn-primary">Request Interview</button>
              <button class="btn btn-secondary">Shortlist</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-tab-content').forEach(c => c.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}-form`).classList.add('active');
  }

  async login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        this.state.user = data.user;
        this.setPage('onboarding');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Connection error');
    }
  }

  async signup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (!name || !email || !password) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Signup successful! Please login.');
        this.setPage('auth');
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Connection error');
    }
  }

  async startBuilder() {
    if (!this.state.user) {
      alert('Please login first');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.state.user.id,
          displayName: this.state.user.name,
          email: this.state.user.email
        })
      });

      const data = await response.json();

      if (response.ok) {
        this.state.candidate = data.candidate;
        this.setPage('builder');
      } else {
        alert(data.error || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Connection error');
    }
  }

  async parseProject() {
    const input = document.getElementById('project-input').value.trim();

    if (!input) {
      alert('Please describe a project');
      return;
    }

    document.getElementById('project-input').value = '';

    const messagesContainer = document.getElementById('messages');
    messagesContainer.innerHTML += `<div class="message-bubble user"><div class="bubble-content">${input}</div></div>`;

    try {
      const response = await fetch(`${API_BASE}/candidates/parse-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectText: input })
      });

      const data = await response.json();

      if (response.ok) {
        const project = data.project;

        const aiResponse = `Great! I extracted: <strong>${project.title}</strong><br>Problem: ${project.problem}<br>Tech: ${project.tech.join(', ')}<br><br>${data.followUpQuestions[0] || 'Want to add more details?'}`;
        
        messagesContainer.innerHTML += `<div class="message-bubble ai"><div class="bubble-content">${aiResponse}</div></div>`;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        await this.addProjectToCandidate(project);
      }
    } catch (error) {
      console.error('Error:', error);
      messagesContainer.innerHTML += `<div class="message-bubble ai"><div class="bubble-content">Sorry, there was an error. Please try again.</div></div>`;
    }
  }

  async addProjectToCandidate(project) {
    if (!this.state.candidate) return;

    try {
      const response = await fetch(`${API_BASE}/candidates/${this.state.candidate.id}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project })
      });

      const data = await response.json();

      if (response.ok) {
        this.state.candidate.projects.push(data.project);
        this.state.candidate.completionPct = data.updatedCompletionPct;
        this.updatePreviewCanvas();
        this.fetchAllCandidates();
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  }

  updatePreviewCanvas() {
    const canvas = document.getElementById('preview-canvas');
    if (canvas && this.state.candidate) {
      canvas.innerHTML = this.renderCandidatePreview(this.state.candidate);
    }
  }

  async fetchAllCandidates() {
    try {
      const response = await fetch(`${API_BASE}/candidates`);
      const data = await response.json();
      localStorage.setItem('allCandidates', JSON.stringify(data.candidates));
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  }

  viewCandidateDetails(candidateId) {
    const allCandidates = JSON.parse(localStorage.getItem('allCandidates') || '[]');
    const candidate = allCandidates.find(c => c.id === candidateId);

    if (candidate) {
      this.state.candidate = candidate;
      this.setPage('preview');
    }
  }

  logout() {
    localStorage.removeItem('user');
    this.state.user = null;
    this.state.candidate = null;
    this.setPage('landing');
  }

  attachEventListeners() {
    // Event listeners attached inline in HTML
  }
}

const app = new App();
