# AI-Powered Recruitment Platform

A modern, AI-assisted recruitment platform where candidates build structured profiles without uploading resumes. Recruiters efficiently search, filter, and compare candidates using measurable metrics and impact scores.

## Features

### For Candidates
- **AI-Powered Onboarding**: Chat-first profile building instead of traditional forms
- **Conversational AI Parser**: Automatically extracts technologies, metrics, and structured insights from natural language
- **Structured Profile Building**: Projects, skills, and experience with measurable outcomes
- **Auto-Save System**: Real-time profile saves with status indicators
- **Progress Tracking**: Visual completion percentage with smart nudges
- **Profile Preview**: See your profile as recruiters will see it
- **Public Profile Links**: Share your profile with a private/public toggle
- **Resume Export**: Generate PDF resumes from structured data

### For Recruiters
- **Advanced Filtering**: Search by skills, experience, impact score, availability
- **Candidate Comparison**: Side-by-side comparison of up to 5 candidates
- **Evidence-Based Ranking**: Candidates ranked by measurable outcomes and verified skills
- **Dashboard**: Quick overview of candidates and their metrics
- **Shortlisting**: Mark and organize candidates by fit

### Technical
- **No Resume Uploads**: Structured data capture via conversational AI
- **JSON Data Storage**: All candidate profiles stored as structured JSON
- **AI Simulation**: Smart NLP parsing that extracts technologies, metrics, and project insights
- **Backend API**: RESTful API for all operations
- **Real-time Updates**: Live preview canvas as profiles are built
- **Responsive UI**: Works on desktop and mobile

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **API**: RESTful JSON API
- **Data Storage**: JSON files (no database required)
- **Dependencies**: cors, body-parser, uuid

### Frontend
- **HTML5** + **CSS3** + **Vanilla JavaScript** (no frameworks)
- **Design System**: Custom CSS with design tokens
- **API Client**: Fetch API
- **State Management**: Client-side state object

## Project Structure

```
ai-recruitment-platform/
├── backend/
│   ├── server.js                    # Express server entry point
│   ├── package.json                 # Node dependencies
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   └── candidateRoutes.js       # Candidate endpoints
│   ├── controllers/
│   │   ├── authController.js        # Auth logic (signup, login)
│   │   └── candidateController.js   # Candidate operations
│   ├── utils/
│   │   └── aiParser.js              # AI NLP parsing logic
│   └── data/
│       ├── users.json               # User accounts
│       └── candidates.json          # Candidate profiles
│
├── frontend/
│   ├── index.html                   # Main HTML entry
│   ├── styles.css                   # Global styles + design system
│   ├── app.js                       # Frontend application logic
│
└── README.md                        # This file
```

## Setup Instructions

### Prerequisites
- Node.js 14+ installed
- Terminal/Command Line access
- A modern web browser

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node server.js
```

You should see:
```
✓ AI Recruitment Backend running on http://localhost:3001
✓ API routes available at /api/auth and /api/candidates
```

The server is now running on `http://localhost:3001`.

### Frontend Setup

1. Open `frontend/index.html` in your browser:
   - **Option A**: Double-click the file
   - **Option B**: Use Python HTTP server:
   ```bash
   cd frontend
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```
   - **Option C**: Use Live Server (VS Code extension)

2. The frontend will connect to `http://localhost:3001/api` automatically.

## Demo Login Credentials

### Candidate Account
- **Email**: `hire-me@anshumat.org`
- **Password**: `HireMe@2025!`

This account already has:
- 3 sample projects with metrics
- 4 sample skills
- 2 work experiences
- Complete profile (95% completion)

### How to Test

1. **Login** with demo credentials
2. **Explore Onboarding** → Click "Start Building Your Profile"
3. **View Builder** → See the two-pane chat + preview interface
4. **Type a project description** like: "Built a React dashboard that reduced page load time by 60% using GraphQL"
5. **AI extracts** technologies, metrics, and creates a project card
6. **View Dashboard** to see all candidates
7. **Click a candidate** to see their full structured profile

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with credentials

### Candidates
- `GET /api/candidates` - List all candidates
- `GET /api/candidates/:id` - Get candidate by ID
- `GET /api/candidates/public/:slug` - Get public candidate profile
- `POST /api/candidates` - Create new candidate profile
- `POST /api/candidates/parse-project` - Parse project text with AI
- `POST /api/candidates/:candidateId/projects` - Add project to profile
- `POST /api/candidates/:candidateId/skills` - Add skills to profile
- `PATCH /api/candidates/:candidateId` - Update candidate profile
- `POST /api/candidates/:candidateId/generate-summary` - Auto-generate summary

## AI Parser Features

The `aiParser.js` utility intelligently processes user input:

### Technology Detection
Extracts tech stack from text:
- Frontend: React, Vue.js, Angular, Next.js, Svelte
- Backend: Node.js, Python, Java, Go, Rust
- Databases: PostgreSQL, MongoDB, Redis, DynamoDB
- Cloud: AWS, GCP, Azure, Heroku
- DevOps: Docker, Kubernetes, CI/CD, etc.

### Metric Detection
Finds numeric metrics in natural language:
- Percentages: "reduced latency 74%" → 74%
- Time improvements: "from 1.2s to 300ms" → calculates improvement
- Revenue impact: "recovered $450K" → captures amount
- User metrics: "100K users" → scales

### Follow-up Questions
AI suggests missing information:
- "Do you have a metric for this?" (if no numbers)
- "What was your ownership level?" (if unclear)
- "How many people on the team?" (if not mentioned)

## Key Design Decisions

### Why No Resumes?
Resumes are unstructured text that leads to:
- Inconsistent parsing and interpretation
- Important signals buried or hidden
- High bias (name, formatting, verbosity)
- Low signal-to-noise ratio

### Structured Data Approach
Structured profiles enable:
- Precise filtering and matching
- Fair, objective comparisons
- Evidence-based trust (provenance)
- Better recruiter decision-making
- Portability to other systems

### No Database Needed
This MVP uses JSON files for:
- Simplicity and fast setup
- No external dependencies
- Easy data inspection
- Clear learning model

*For production, replace JSON with PostgreSQL or MongoDB.*

## Customization

### Adding Skills to Taxonomy
Edit `backend/utils/aiParser.js`:
```javascript
const skillTaxonomy = {
  'Your Skill': { category: 'category', level: 3 },
};
```

### Changing Colors
Edit `frontend/styles.css`:
```css
:root {
  --primary: #1F4B99;
  --accent: #FF6B5A;
}
```

## Common Issues & Fixes

### Backend won't start
```bash
# Check if port 5000 is already in use
lsof -i :5000
# Kill process on port 5000
kill -9 <PID>
# Try again
node server.js
```

### Frontend can't connect to backend
- Ensure backend is running: `http://localhost:3001/api/health`
- Check browser console for CORS errors
- Clear browser cache

### Data not saving
- Check browser DevTools → Application → LocalStorage
- Ensure backend is writing to `backend/data/` directory
- Check file permissions

### Login fails
- Use exact credentials: `hire-me@anshumat.org` / `HireMe@2025!`
- Check `backend/data/users.json` exists
- Ensure backend is running

## Deployment

To deploy to production:

1. **Backend**: Deploy to Heroku, Railway, or AWS
2. **Frontend**: Deploy to Vercel, Netlify, or CDN
3. **Database**: Replace JSON with PostgreSQL/MongoDB

## Future Enhancements

- [ ] User authentication with JWT tokens
- [ ] Email notifications
- [ ] LinkedIn profile import
- [ ] GitHub profile integration
- [ ] Video introduction upload
- [ ] AI skill verification tests
- [ ] Interview scheduling
- [ ] Analytics dashboard for recruiters

## Support

For issues or questions, check the Common Issues section above.

---

**Built with ❤️ for better, fairer hiring**
