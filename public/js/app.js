// DOM Elements
const form = document.getElementById('portfolioForm');
const generateBtn = form.querySelector('.generate-btn');
const btnText = generateBtn.querySelector('.btn-text');
const loadingSpinner = generateBtn.querySelector('.loading-spinner');
const outputSection = document.getElementById('portfolioOutput');
const portfolioContent = document.getElementById('portfolioContent');
const mainElement = document.querySelector('main');
// New mode toggle functionality
document.getElementById('manualModeBtn').addEventListener('click', () => {
    document.getElementById('manualInputSection').style.display = 'block';
    document.getElementById('githubInputSection').style.display = 'none';
    document.getElementById('examplesSection').style.display = 'block';
    
    // Clear GitHub username when switching to manual mode
    document.getElementById('githubUsername').value = '';
    
    // Update button styles
    document.getElementById('manualModeBtn').classList.add('active');
    document.getElementById('githubModeBtn').classList.remove('active');
});

document.getElementById('githubModeBtn').addEventListener('click', () => {
    document.getElementById('manualInputSection').style.display = 'none';
    document.getElementById('githubInputSection').style.display = 'block';
    document.getElementById('examplesSection').style.display = 'none';
    
    // Clear manual form fields when switching to GitHub mode
    document.getElementById('name').value = '';
    document.getElementById('title').value = '';
    document.getElementById('experience').value = '';
    document.getElementById('skills').value = '';
    document.getElementById('about').value = '';
    document.getElementById('projects').value = '';
    
    // Update button styles
    document.getElementById('githubModeBtn').classList.add('active');
    document.getElementById('manualModeBtn').classList.remove('active');
});
// Form submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Determine input mode
    const isGitHubMode = document.getElementById('githubInputSection').style.display !== 'none';
    
    let developerInfo = null;
    
    // Show loading state
    setLoadingState(true);
    
    try {
        if (isGitHubMode) {
    // GitHub mode
    const githubUsername = document.getElementById('githubUsername').value.trim();
    
    if (!githubUsername) {
        throw new Error('Please enter a GitHub username');
    }
    
    const githubProfile = await fetchGitHubProfile(githubUsername);
    
    if (!githubProfile) {
        throw new Error('Could not fetch GitHub profile');
    }
    
    // Extract skills from README and repositories
    const repoLanguages = [...new Set(githubProfile.projects.map(p => p.language).filter(Boolean))];
    const repoTopics = [...new Set(githubProfile.projects.flatMap(p => p.topics || []))];
    const allSkills = [...repoLanguages, ...repoTopics].slice(0, 15);
    
    // Build enhanced about section
    let aboutText = githubProfile.bio || '';
    if (githubProfile.readme) {
        // Extract useful information from README (first few lines)
        const readmeLines = githubProfile.readme.split('\n').slice(0, 10);
        const meaningfulLines = readmeLines.filter(line => 
            line.trim() && 
            !line.startsWith('#') && 
            !line.startsWith('![') && 
            line.length > 20
        );
        if (meaningfulLines.length > 0) {
            aboutText += meaningfulLines.slice(0, 3).join(' ');
        }
    }
    
    // Build developer info from GitHub data
    developerInfo = {
        name: githubProfile.name || githubUsername,
        title: `${githubProfile.bio ? githubProfile.bio.substring(0, 50) : 'Software Developer'}${githubProfile.location ? ` based in ${githubProfile.location}` : ''}`,
        experience: `Active GitHub developer with ${githubProfile.publicRepos} repositories and ${githubProfile.followers} followers`,
        skills: allSkills.join(', '),
        about: aboutText || `Passionate developer with expertise in ${repoLanguages.slice(0, 3).join(', ')}. Check out my ${githubProfile.publicRepos} projects on GitHub.`,
        projects: githubProfile.projects.map(p => 
            `${p.name}: ${p.description || 'Innovative project showcasing my skills'} (⭐ ${p.stars}, Language: ${p.language || 'Multiple'}, Topics: ${p.topics?.join(', ') || 'N/A'})`
        ).join('\n\n')
    };
} else {
    // Manual mode - ensure we only use manual data
    const formData = new FormData(form);
    developerInfo = {
        name: formData.get('name'),
        title: formData.get('title'),
        experience: formData.get('experience'),
        skills: formData.get('skills'),
        about: formData.get('about'),
        projects: formData.get('projects')
    };
    
    // Validate manual input
    if (!developerInfo.name || !developerInfo.title) {
        throw new Error('Please fill in at least Name and Title fields');
    }
}
        // Make API request
        const response = await fetch('/api/generate-portfolio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ developerInfo })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayPortfolio(data.portfolio);
            showSuccessMessage();
        } else {
            throw new Error(data.error || 'Failed to generate portfolio');
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage(error.message);
    } finally {
        setLoadingState(false);
    }
});

// Set loading state
function setLoadingState(isLoading) {
    if (isLoading) {
        generateBtn.disabled = true;
        btnText.style.display = 'none';
        loadingSpinner.style.display = 'inline-block';
    } else {
        generateBtn.disabled = false;
        btnText.style.display = 'inline-block';
        loadingSpinner.style.display = 'none';
    }
}

// Display generated portfolio
function displayPortfolio(portfolio) {
    // Update main layout
    mainElement.classList.add('has-output');
    
    // Build portfolio HTML
    const portfolioHTML = `
        <div class="portfolio-section">
            <h2 class="portfolio-headline">${escapeHtml(portfolio.headline)}</h2>
            <p class="portfolio-bio">${escapeHtml(portfolio.bio)}</p>
        </div>
        
        <div class="portfolio-section">
            <h3>🛠️ Skills & Technologies</h3>
            <div class="skills-container">
                ${portfolio.skills.map(skill => 
                    `<span class="skill-tag">${escapeHtml(skill)}</span>`
                ).join('')}
            </div>
        </div>
        
        <div class="portfolio-section">
            <h3>🚀 Projects</h3>
            ${portfolio.projects.map(project => `
                <div class="project-card">
                    <h4>${escapeHtml(project.name)}</h4>
                    <p>${escapeHtml(project.description)}</p>
                    <div class="tech-stack">
                        ${project.techStack.map(tech => 
                            `<span class="tech-tag">${escapeHtml(tech)}</span>`
                        ).join('')}
                    </div>
                    ${project.highlights && project.highlights.length > 0 ? `
                        <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                            ${project.highlights.map(highlight => 
                                `<li style="color: var(--text-secondary); font-size: 0.9rem;">${escapeHtml(highlight)}</li>`
                            ).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('')}
        </div>
        
        <div class="portfolio-section">
            <h3>✨ Career Highlights</h3>
            ${portfolio.careerHighlights.map(highlight => 
                `<div class="highlight-item">${escapeHtml(highlight)}</div>`
            ).join('')}
        </div>
    `;
    
    // Display the portfolio
    portfolioContent.innerHTML = portfolioHTML;
    outputSection.style.display = 'block';
    
    // Smooth scroll to output
    setTimeout(() => {
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// Copy portfolio to clipboard
async function copyPortfolio() {
    const portfolioText = portfolioContent.innerText;
    
    try {
        await navigator.clipboard.writeText(portfolioText);
        
        // Update button text temporarily
        const copyBtn = document.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    } catch (error) {
        console.error('Failed to copy:', error);
        showErrorMessage('Failed to copy to clipboard');
    }
}

// Show success message
function showSuccessMessage() {
    const message = createMessage('Portfolio generated successfully! 🎉', 'success');
    displayMessage(message);
}

// Show error message
function showErrorMessage(error) {
    const message = createMessage(`Error: ${error}`, 'error');
    displayMessage(message);
}

// Create message element
function createMessage(text, type) {
    const message = document.createElement('div');
    message.className = `message ${type}-message`;
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
    `;
    return message;
}

// Display message
function displayMessage(message) {
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add message animations to the page
const style = document.createElement('style');
style.textContent = `
        @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize
console.log('AI Portfolio Generator initialized ✨');

// Example templates
function fillExample(type) {
    const examples = {
        junior: {
            name: "Emma Thompson",
            title: "Junior Frontend Developer",
            experience: "1 year",
            skills: "HTML, CSS, JavaScript, React, Git, Figma, responsive design",
            about: "Recent bootcamp graduate passionate about creating user-friendly web interfaces. Background in graphic design brings a unique perspective to UI development.",
            projects: "Built a responsive portfolio website for a local photographer using React and Tailwind CSS. Implemented lazy loading for images and achieved 95+ Lighthouse scores."
        },
        senior: {
            name: "David Kumar",
            title: "Senior Software Engineer",
            experience: "8 years",
            skills: "Java, Python, Kubernetes, Docker, AWS, microservices, React, system design, team leadership",
            about: "Experienced in building scalable distributed systems and leading technical teams. Passionate about mentoring junior developers and implementing best practices.",
            projects: "Led migration of monolithic e-commerce platform to microservices architecture, reducing deployment time by 75% and improving system reliability to 99.9% uptime."
        },
        fullstack: {
            name: "Alex Rivera",
            title: "Full Stack Developer",
            experience: "4 years",
            skills: "JavaScript, TypeScript, Node.js, React, PostgreSQL, MongoDB, Docker, AWS, GraphQL, REST APIs",
            about: "Full stack developer who loves building end-to-end solutions. Strong focus on performance optimization and clean, maintainable code.",
            projects: "Developed a real-time collaboration platform using React, Node.js, and WebSockets. Implemented features including live document editing, video chat, and real-time notifications for 5000+ daily active users."
        }
    };

    const example = examples[type];
    if (example) {
        document.getElementById('name').value = example.name;
        document.getElementById('title').value = example.title;
        document.getElementById('experience').value = example.experience;
        document.getElementById('skills').value = example.skills;
        document.getElementById('about').value = example.about;
        document.getElementById('projects').value = example.projects;
        
        // Visual feedback
        const btn = event.target;
        btn.style.background = 'var(--success-color)';
        btn.textContent = '✓ Filled';
        setTimeout(() => {
            btn.style.background = '';
            btn.textContent = btn.getAttribute('data-original') || btn.textContent;
        }, 1000);
    }
}

async function fetchGitHubProfile(username) {
    try {
        const response = await fetch(`/api/github-profile/${username}`);
        
        if (!response.ok) {
            throw new Error('GitHub profile not found or API error');
        }
        
        const profile = await response.json();
        
        return profile;
    } catch (error) {
        console.error('Error fetching GitHub profile:', error);
        showErrorMessage(error.message || 'Could not fetch GitHub profile');
        return null;
    }
}