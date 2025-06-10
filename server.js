require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes

app.post('/api/generate-portfolio', async (req, res) => {
  try {
    const { developerInfo } = req.body;
    
    const prompt = `
      You are an expert at creating compelling developer portfolios. Based on the following information, generate a professional portfolio content in JSON format.
      
      Developer Information:
      ${JSON.stringify(developerInfo, null, 2)}
      
      Generate ONLY a valid JSON response (no markdown, no explanation) with this structure:
      {
        "headline": "A compelling professional headline",
        "bio": "A 2-3 paragraph professional bio",
        "skills": ["skill1", "skill2", ...],
        "projects": [
          {
            "name": "Project name",
            "description": "Brief description",
            "techStack": ["tech1", "tech2"],
            "highlights": ["key achievement or feature"]
          }
        ],
        "careerHighlights": ["highlight1", "highlight2", "highlight3"]
      }
    `;

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: "llama3-70b-8192", 
      messages: [
        { 
          role: "system", 
          content: "You are a professional technical writer. Respond ONLY with valid JSON, no markdown formatting, no explanations." 
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const content = response.data.choices[0].message.content;
    const portfolioContent = JSON.parse(content);
    
    res.json({ success: true, portfolio: portfolioContent });

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to generate portfolio' 
    });
  }
});

// GitHub Profile Route
app.get('/api/github-profile/:username', async (req, res) => {
    try {
        const username = req.params.username;
        console.log('Fetching GitHub profile for username:', username);
        
        // Fetch user profile
        const userResponse = await axios.get(`https://api.github.com/users/${username}`, {
            headers: {
                'User-Agent': 'AI-Portfolio-Generator'
            }
        });
        
        // Fetch user repositories
        const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos`, {
            params: {
                sort: 'updated',
                direction: 'desc',
                per_page: 5
            },
            headers: {
                'User-Agent': 'AI-Portfolio-Generator'
            }
        });

        // Try to fetch README content
        let readmeContent = null;
        try {
            const readmeResponse = await axios.get(`https://api.github.com/repos/${username}/${username}/readme`, {
                headers: {
                    'User-Agent': 'AI-Portfolio-Generator',
                    'Accept': 'application/vnd.github.v3.raw'
                }
            });
            readmeContent = readmeResponse.data;
        } catch (readmeError) {
            console.log('No README found for profile repository');
        }

        const profile = {
            name: userResponse.data.name || username,
            bio: userResponse.data.bio || 'Developer',
            location: userResponse.data.location,
            publicRepos: userResponse.data.public_repos,
            followers: userResponse.data.followers,
            company: userResponse.data.company,
            blog: userResponse.data.blog,
            email: userResponse.data.email,
            readme: readmeContent, // Add README content
            projects: reposResponse.data.map(repo => ({
                name: repo.name,
                description: repo.description,
                stars: repo.stargazers_count,
                language: repo.language,
                url: repo.html_url,
                topics: repo.topics || []
            }))
        };

        res.json(profile);
    } catch (error) {
        console.error('GitHub API Error:', error.message);
        res.status(404).json({ error: 'GitHub profile not found' });
    }
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Using Groq AI (Free tier)`);
});