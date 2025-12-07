# GitHub Clone - Repository Viewer

A GitHub-like application built with Next.js, TypeScript, Tailwind CSS, and Express.js. This application allows users to sign in, view top repositories, explore repository details, and browse issues.

## Features

- 🔐 **Authentication**: Sign in with demo credentials
- 📦 **Repository List**: View top repositories with details (stars, forks, language, topics)
- 🔍 **Repository Details**: Click into repositories to view file structure
- 🐛 **Issues Page**: Browse all issues or filter by repository
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

### Running the Application

Start both the Express backend server and Next.js frontend:

```bash
npm run dev
```

This will start:
- Express server on `http://localhost:3001`
- Next.js app on `http://localhost:3000`

### Demo Credentials

The login page displays the demo credentials, but here they are:

- **Username**: `demo`
- **Password**: `password123`

## Project Structure

```
github/
├── app/
│   ├── contexts/
│   │   └── AuthContext.tsx      # Authentication context
│   ├── login/
│   │   └── page.tsx              # Login page
│   ├── repositories/
│   │   ├── page.tsx              # Repositories list
│   │   └── [id]/
│   │       ├── page.tsx          # Repository detail
│   │       └── issues/
│   │           └── page.tsx      # Repository issues
│   ├── issues/
│   │   └── page.tsx              # All issues page
│   ├── layout.tsx                # Root layout with AuthProvider
│   └── page.tsx                  # Root page (redirects)
├── server.js                     # Express backend API
└── package.json
```

## API Endpoints

The Express server provides the following endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/repositories` - Get all repositories
- `GET /api/repositories/:id` - Get single repository
- `GET /api/repositories/:id/files` - Get repository files
- `GET /api/issues` - Get all issues (optional `?repoId=:id` filter)
- `GET /api/issues/:id` - Get single issue

## Features in Detail

### Authentication
- Login page with demo credentials displayed
- Session persistence using localStorage
- Protected routes that redirect to login if not authenticated

### Repositories
- List view showing top repositories
- Each repository displays:
  - Name, owner, description
  - Stars, forks, language
  - Topics/tags
  - Last updated date
- Click any repository to view details

### Repository Details
- View repository information
- Browse file structure
- Navigate to repository-specific issues
- Star and Fork buttons (UI only)

### Issues
- View all issues across repositories
- Filter by state (All, Open, Closed)
- View repository-specific issues
- Each issue shows:
  - Title, description
  - State (open/closed)
  - Author, creation date
  - Labels

## Development

### Running Individual Servers

If you need to run servers separately:

```bash
# Terminal 1 - Express server
npm run server

# Terminal 2 - Next.js client
npm run client
```

### Building for Production

```bash
npm run build
npm start
```

## Notes

- The application uses dummy data stored in `server.js`
- Authentication tokens are stored in localStorage (not secure for production)
- All data is mock data for demonstration purposes
