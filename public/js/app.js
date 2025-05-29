// DOM Elements
const form = document.getElementById('portfolioForm');
const generateBtn = form.querySelector('.generate-btn');
const btnText = generateBtn.querySelector('.btn-text');
const loadingSpinner = generateBtn.querySelector('.loading-spinner');
const outputSection = document.getElementById('portfolioOutput');
const portfolioContent = document.getElementById('portfolioContent');
const mainElement = document.querySelector('main');

// Form submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const developerInfo = {
        name: formData.get('name'),
        title: formData.get('title'),
        experience: formData.get('experience'),
        skills: formData.get('skills'),
        about: formData.get('about'),
        projects: formData.get('projects')
    };
    
    // Show loading state
    setLoadingState(true);
    
    try {
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