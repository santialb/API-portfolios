# 🚀 AI Portfolio Generator

A real-time developer portfolio generator powered by Groq AI (Llama 3 70B model) with GitHub profile integration.

## ✨ Features

### 🤖 AI-Powered Generation
- **Groq AI Integration**: Uses Llama 3 70B model for intelligent portfolio creation
- **Real-time Processing**: Generate portfolios in seconds
- **Smart Content Analysis**: Extracts meaningful information from your data

### 🐙 GitHub Profile Integration
- **Automatic Profile Fetching**: Import data directly from GitHub profiles
- **Repository Analysis**: Analyzes your top repositories for skills and projects
- **README Parsing**: Extracts additional information from your profile README
- **Language Detection**: Automatically identifies programming languages and technologies

### 🎯 Dual Input Modes
- **📝 Manual Input**: Traditional form-based portfolio creation
- **🐙 GitHub Profile**: One-click import from GitHub username
- **Smart Mode Switching**: Clean transitions between input methods
- **Example Templates**: Pre-built examples for different experience levels

### 🎨 Modern UI/UX
- **Dark Theme**: Professional dark-themed interface
- **Smooth Animations**: Polished user experience with CSS transitions
- **Responsive Design**: Works perfectly on all device sizes
- **Interactive Elements**: Hover effects and visual feedback

### 🛠️ Additional Features
- **📋 One-click Copy**: Copy generated portfolio to clipboard
- **⚡ Real-time Updates**: Instant portfolio generation and display
- **🔄 Mode Toggle**: Switch between manual and GitHub input seamlessly
- **📱 Mobile Optimized**: Full functionality on mobile devices

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: Node.js, Express.js
- **AI**: Groq API (Llama 3 70B model)
- **APIs**: GitHub REST API v3
- **Styling**: Custom CSS with CSS variables and animations
- **HTTP Client**: Axios for API requests

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Groq API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-portfolio-generator.git
   cd ai-portfolio-generator
    ```
2. **Install dependencies**
    ```bash
    npm install
    ```
3. **Environment Setup**

    Create a .env file in the root directory:
     ```bash
    PORT=3000
    GROQ_API_KEY=your_groq_api_key_here
    ```
4. **Get your Groq API Key**
    - Visit Groq Console
    - Sign up for a free account
    - Generate an API key
    - Add it to your .env file

5. **Start the application**
    ```bash
    # Development mode
    npm run dev
    # Production mode
    npm start
    ```
6. **Open in browser**

    Navigate to http://localhost:3000

# 📖 Usage

## Manual Input Mode
1. Select "📝 Manual Input" mode
2. Fill in your personal information:
   - Full Name
   - Current Title/Role
   - Years of Experience
   - Skills (comma-separated)
   - Brief About Yourself
   - Recent Project Description
3. Click "Generate Portfolio"

## GitHub Profile Mode
1. Select "🐙 GitHub Profile" mode
2. Enter your GitHub username (e.g., `santialb`)
3. Click "Generate Portfolio"

The system will automatically:
- Fetch your GitHub profile information
- Analyze your repositories
- Extract skills from your projects
- Parse your README for additional context

# Example Templates
Try the pre-built examples for inspiration:

- 👶 **Junior Dev**: Entry-level developer template
- 🚀 **Senior Dev**: Experienced developer template
- 💪 **Full Stack**: Full-stack developer template

# 🔧 API Endpoints
- `POST /api/generate-portfolio` - Generate portfolio from developer info
- `GET /api/github-profile/:username` - Fetch GitHub profile data

# 📁 Project Structure

```bash
📦 ai-portfolio-generator
├── 📂 public
│   ├── 📂 css
│   │   └── 📄 style.css          # Styling and animations
│   ├── 📂 js
│   │   └── 📄 app.js             # Frontend JavaScript logic
│   └── 📄 index.html             # Main HTML interface
├── 📄 server.js                  # Express server and API routes
├── 📄 package.json               # Dependencies and scripts
├── 📄 .env                       # Environment variables
└── 📄 README.md                  # Project documentation

```
# 🌟 Features in Detail

## GitHub Integration
- **Profile Fetching**: Retrieves user profile, bio, location, and statistics
- **Repository Analysis**: Analyzes top 5 most recent repositories
- **Language Detection**: Identifies programming languages from repository data
- **README Parsing**: Extracts additional context from profile README
- **Smart Skill Extraction**: Combines repository languages, topics, and README content

## AI Portfolio Generation
- **Contextual Analysis**: AI analyzes all provided information
- **Professional Formatting**: Generates well-structured portfolio sections
- **Skill Categorization**: Organizes skills into relevant categories
- **Project Highlighting**: Emphasizes key projects and achievements
- **Career Insights**: Creates compelling career highlight sections

# 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

# 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

# 🙏 Acknowledgments
- Groq AI for providing the powerful Llama 3 70B model
- GitHub API for enabling seamless profile integration

# 📞 Support
If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the documentation
- Contact me https://santialb.github.io/Portfolio/contact.html