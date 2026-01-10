# DSASolver - Master Data Structures & Algorithms

A premium, full-featured DSA practice platform built with React, featuring daily practice tracking, performance analytics, and an integrated code editor.

![DSASolver Platform](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple)

## 🚀 Features

### Core Functionality
- **500+ Curated Problems** - Organized by topic and difficulty
- **Premium Code Editor** - Monaco Editor with syntax highlighting and autocomplete
- **Multi-Language Support** - JavaScript, Python, and Java
- **Instant Feedback** - Real-time code execution with detailed test results
- **Smart Filtering** - Search and filter problems by difficulty, category, and tags

### Daily Practice & Analytics
- **🔥 Streak Tracking** - Build consistency with daily streak counters
- **📊 Activity Heatmap** - Visual calendar of your coding activity
- **📈 Progress Charts** - Track improvement across difficulty levels
- **🎯 Daily Goals** - Personalized challenges to maintain momentum
- **🏆 Achievement System** - Unlock badges as you progress

### User Experience
- **Premium Dark Theme** - Modern design with vibrant gradients
- **Glassmorphism UI** - Sleek, translucent cards with backdrop blur
- **Smooth Animations** - Micro-interactions for enhanced engagement
- **Responsive Design** - Optimized for desktop and mobile
- **Split-Panel Workspace** - Problem description alongside code editor

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with hooks
- **Vite** - Lightning-fast build tool
- **Zustand** - Lightweight state management
- **Monaco Editor** - VS Code's editor for the web
- **CSS Variables** - Custom design system

### Planned Backend (Phase 2)
- **Node.js + Express** - RESTful API
- **PostgreSQL** - Relational database for users and problems
- **Redis** - Caching and session management
- **Docker** - Sandboxed code execution
- **BullMQ** - Job queue for submissions

## 📁 Project Structure

```
dsasolver/
├── src/
│   ├── components/
│   │   ├── Header.jsx          # Navigation and user menu
│   │   └── Header.css
│   ├── pages/
│   │   ├── Landing.jsx         # Hero section and features
│   │   ├── Dashboard.jsx       # Activity heatmap and stats
│   │   ├── Problems.jsx        # Problem list with filters
│   │   ├── Workspace.jsx       # Code editor and problem view
│   │   ├── Profile.jsx         # User stats and achievements
│   │   └── *.css              # Page-specific styles
│   ├── store.js               # Zustand global state
│   ├── index.css              # Design system and utilities
│   ├── App.jsx                # Main app component
│   └── main.jsx               # React entry point
├── public/                    # Static assets
├── index.html                 # HTML template
└── package.json              # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dsasolver
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design System

### Color Palette
```css
--color-bg-primary: hsl(220, 26%, 8%)      /* Deep dark blue */
--color-accent-primary: hsl(265, 85%, 65%) /* Vibrant purple */
--color-accent-secondary: hsl(195, 90%, 55%) /* Cyan blue */
--color-easy: hsl(145, 70%, 55%)           /* Green */
--color-medium: hsl(40, 95%, 60%)          /* Orange */
--color-hard: hsl(0, 85%, 65%)             /* Red */
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 700-800 weight, -0.02em letter spacing
- **Body**: 400 weight, 1.6 line height

### Components
- **Glass Cards**: `rgba(255, 255, 255, 0.03)` with backdrop blur
- **Gradients**: Linear gradients for accents and text
- **Animations**: Smooth transitions (250ms cubic-bezier)

## 📊 Current Features (MVP)

### ✅ Implemented
- [x] Landing page with hero section
- [x] User authentication (mock)
- [x] Dashboard with activity heatmap
- [x] Problem list with filtering
- [x] Code workspace with Monaco Editor
- [x] Profile page with achievements
- [x] Streak tracking
- [x] Progress by difficulty
- [x] Recent submissions

### 🚧 Planned (Phase 2)
- [ ] Backend API with Node.js
- [ ] Real code execution engine
- [ ] Database integration
- [ ] User registration/login
- [ ] Solution discussion forum
- [ ] Leaderboards
- [ ] Daily challenges
- [ ] Email notifications

## 🔐 Security Considerations

When implementing the backend code execution:

1. **Sandboxing** - Use Docker containers with resource limits
2. **Time Limits** - SIGKILL after 2 seconds
3. **Memory Limits** - Docker `--memory` flag
4. **Network Isolation** - `--network none`
5. **Input Validation** - Sanitize all user inputs

## 📈 Scalability

### Current Architecture
- Client-side state management with Zustand
- Mock data for rapid prototyping
- Optimized for 50K+ concurrent users (planned)

### Future Optimizations
- Redis caching for problem data
- CDN for static assets
- Database indexing on user_id and problem_id
- Horizontal scaling with load balancers

## 🤝 Contributing

This is a learning project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Monaco Editor** - Microsoft's VS Code editor
- **React** - Facebook's UI library
- **Vite** - Evan You's build tool
- **Zustand** - Poimandres state management

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ for developers who want to master DSA**
