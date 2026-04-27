# SkillRoute 🚀

An AI-powered learning platform that creates personalized roadmaps, skill assessments, mock interview preparation, and progress tracking to help you master any skill. Built with React and Spring Boot, powered by Groq AI.

## ✨ Features

- 🤖 **AI-Powered Roadmap** - Generate personalized weekly learning paths in seconds
- 📊 **Smart Assessment** - Take AI-generated quizzes to evaluate your skill level
- 🎤 **Mock Interview Preparation** - Practice with AI-generated interview questions and get detailed feedback
- 📅 **Visual Progress Tracking** - Calendar view with task completion tracking and progress percentage
- 🎯 **Goal-Oriented** - Customize roadmaps for job-readiness, interviews, or projects
- 🛠️ **Hands-On Learning** - Includes practice questions and mini projects
- 🔄 **Adaptive Plans** - Choose weekly or daily plans with revision periods
- 📊 **User Dashboard** - Overview of quizzes, interviews, roadmaps, and performance stats
- ⚡ **Lightning Fast** - Roadmaps generated in 5-10 seconds with Groq inference
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend
- **React + Vite** - UI framework with fast build tooling
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Router** - Navigation
- **Axios** - HTTP client for API calls

### Backend
- **Spring Boot** - REST API with business logic
- **Spring Data JPA** - Database interaction
- **Jackson ObjectMapper** - JSON parsing
- **RestTemplate** - Groq API communication

### Database & Deployment
- **PostgreSQL (Neon.tech)** - Serverless relational database
- **Vercel** - Frontend deployment
- **Railway** - Backend deployment

### AI
- **Groq API (Llama 3.1)** - Quiz generation, roadmap generation, and interview evaluation

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Java 17+
- Maven
- Groq API key (free tier available)
- PostgreSQL database

### Frontend Setup

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/skillroute.git
   cd skillroute/frontend
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**

   Create a `.env` file in the frontend root:
```env
   VITE_BACKEND_URL=http://localhost:8080
```

4. **Start the development server**
```bash
   npm run dev
```

5. **Open your browser**

   Navigate to `http://localhost:5173`

### Backend Setup

1. **Navigate to backend folder**
```bash
   cd skillroute/backend
```

2. **Set up environment variables in `application.properties`**
```properties
   spring.datasource.url=your_postgresql_url
   spring.datasource.username=your_db_username
   spring.datasource.password=your_db_password
   groq.api.key=your_groq_api_key
   groq.api.url=https://api.groq.com/openai/v1/chat/completions
```

3. **Run the backend**
```bash
   mvn spring-boot:run
```

## 🎯 How It Works

### 1. Skill Discovery
Enter the skill you want to learn and select your current level — Beginner, Intermediate, Advanced, or Not Sure.

### 2. Assessment
If you are unsure of your level, take an AI-generated quiz that evaluates your knowledge and determines your starting point automatically.

### 3. Customize Your Plan
Choose duration in weeks or months, include practice questions, mini projects, and revision periods, and set specific learning goals.

### 4. Get Your Roadmap
AI generates a personalized week-by-week roadmap with specific tasks, practice exercises, and revision strategies tailored to your level and goals.

### 5. Mock Interview Preparation
Start an AI-powered mock interview session for your selected skill. Answer generated questions and receive detailed feedback and evaluation.

### 6. Track Progress
Mark tasks as complete, view your progress percentage, and monitor your learning schedule through the calendar view and dashboard.

## 🔑 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/quiz/generate` | Generate AI quiz |
| POST | `/api/quiz/evaluate` | Evaluate answers and return skill level |
| GET | `/api/quiz/all` | Retrieve quiz history |
| POST | `/api/roadmap/generate` | Generate personalized roadmap |
| GET | `/api/roadmap/all` | Retrieve roadmap history |
| POST | `/api/interviews/start` | Start mock interview session |
| POST | `/api/interviews/evaluate` | Evaluate interview answers |
| POST | `/api/interviews/feedback` | Get detailed AI feedback |

## 🔧 AI Configuration

Groq API is configured in the Spring Boot backend. The system uses prompt engineering to ensure consistent JSON output for all AI-generated content including quizzes, roadmaps, and interview questions.

Available models:
- `llama-3.1-8b-instant` (Fast)
- `llama-3.3-70b-versatile` (Best quality)
- `mixtral-8x7b-32768` (Balanced)

## 🚧 Upcoming Features

- [ ] JWT-based user authentication
- [ ] Advanced analytics dashboard
- [ ] Share roadmaps with others
- [ ] Export roadmaps as PDF
- [ ] Google Calendar integration
- [ ] Mobile application (iOS and Android)
- [ ] Multi-language support
- [ ] AI Tutor chatbot for concept doubts

## 🙏 Acknowledgments

- [Groq](https://groq.com) for providing fast AI inference
- [Tailwind CSS](https://tailwindcss.com) for the styling framework
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [Lucide](https://lucide.dev) for beautiful icons
- [Neon.tech](https://neon.tech) for serverless PostgreSQL hosting
- [Railway](https://railway.app) for backend deployment
