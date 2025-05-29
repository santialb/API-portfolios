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
      model: "mixtral-8x7b-32768",
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Using Groq AI (Free tier)`);
});