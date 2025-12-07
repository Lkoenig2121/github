const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '2.0', timestamp: new Date().toISOString() });
});

// Dummy user credentials
const DUMMY_USER = {
  username: 'demo',
  password: 'password123',
  name: 'Demo User',
  email: 'demo@github.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
};

// Dummy repositories data
const REPOSITORIES = [
  {
    id: 1,
    name: 'awesome-project',
    owner: 'demo',
    description: 'An awesome project with amazing features',
    stars: 1234,
    forks: 567,
    language: 'TypeScript',
    updatedAt: '2024-01-15',
    isPrivate: false,
    topics: ['typescript', 'nextjs', 'react']
  },
  {
    id: 2,
    name: 'web-app',
    owner: 'demo',
    description: 'Modern web application built with Next.js',
    stars: 890,
    forks: 234,
    language: 'JavaScript',
    updatedAt: '2024-01-14',
    isPrivate: false,
    topics: ['javascript', 'nextjs', 'tailwind']
  },
  {
    id: 3,
    name: 'api-server',
    owner: 'demo',
    description: 'RESTful API server with Express',
    stars: 456,
    forks: 123,
    language: 'Node.js',
    updatedAt: '2024-01-13',
    isPrivate: false,
    topics: ['nodejs', 'express', 'api']
  },
  {
    id: 4,
    name: 'mobile-app',
    owner: 'demo',
    description: 'Cross-platform mobile application',
    stars: 789,
    forks: 345,
    language: 'React Native',
    updatedAt: '2024-01-12',
    isPrivate: false,
    topics: ['react-native', 'mobile', 'ios', 'android']
  },
  {
    id: 5,
    name: 'data-visualization',
    owner: 'demo',
    description: 'Beautiful data visualization library',
    stars: 2345,
    forks: 678,
    language: 'Python',
    updatedAt: '2024-01-11',
    isPrivate: false,
    topics: ['python', 'visualization', 'data-science']
  }
];

// Dummy issues data
const ISSUES = [
  {
    id: 1,
    repoId: 1,
    title: 'Fix authentication bug',
    body: 'There is an issue with the authentication flow that needs to be fixed.',
    state: 'open',
    author: 'demo',
    createdAt: '2024-01-10',
    labels: ['bug', 'high-priority']
  },
  {
    id: 2,
    repoId: 1,
    title: 'Add dark mode support',
    body: 'It would be great to add dark mode to improve user experience.',
    state: 'open',
    author: 'demo',
    createdAt: '2024-01-09',
    labels: ['enhancement', 'ui']
  },
  {
    id: 3,
    repoId: 2,
    title: 'Performance optimization needed',
    body: 'The app is slow on mobile devices. Need to optimize rendering.',
    state: 'closed',
    author: 'demo',
    createdAt: '2024-01-08',
    labels: ['performance', 'mobile']
  },
  {
    id: 4,
    repoId: 3,
    title: 'Update dependencies',
    body: 'Several dependencies are outdated and need to be updated.',
    state: 'open',
    author: 'demo',
    createdAt: '2024-01-07',
    labels: ['maintenance']
  }
];

// Authentication endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Debug: Log the raw request
    console.log('Raw request body:', JSON.stringify(req.body));
    console.log('DUMMY_USER:', JSON.stringify(DUMMY_USER));
    
    // Trim whitespace and normalize
    const trimmedUsername = username?.toString().trim();
    const trimmedPassword = password?.toString().trim();
    
    console.log('Login attempt:', { 
      received: { username: trimmedUsername, password: trimmedPassword },
      expected: { username: DUMMY_USER.username, password: DUMMY_USER.password },
      usernameMatch: trimmedUsername === DUMMY_USER.username,
      passwordMatch: trimmedPassword === DUMMY_USER.password,
      usernameType: typeof trimmedUsername,
      passwordType: typeof trimmedPassword
    });
    
    if (trimmedUsername === DUMMY_USER.username && trimmedPassword === DUMMY_USER.password) {
      console.log('Login successful');
      res.json({
        success: true,
        user: {
          username: DUMMY_USER.username,
          name: DUMMY_USER.name,
          email: DUMMY_USER.email,
          avatar: DUMMY_USER.avatar
        },
        token: 'dummy-jwt-token-12345'
      });
    } else {
      console.log('Login failed - invalid credentials');
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get repositories
app.get('/api/repositories', (req, res) => {
  res.json(REPOSITORIES);
});

// Get single repository
app.get('/api/repositories/:id', (req, res) => {
  const repo = REPOSITORIES.find(r => r.id === parseInt(req.params.id));
  if (repo) {
    res.json(repo);
  } else {
    res.status(404).json({ message: 'Repository not found' });
  }
});

// Get repository files (dummy file structure)
app.get('/api/repositories/:id/files', (req, res) => {
  const repoId = parseInt(req.params.id);
  const files = [
    {
      name: 'src',
      type: 'directory',
      path: 'src'
    },
    {
      name: 'components',
      type: 'directory',
      path: 'src/components'
    },
    {
      name: 'App.tsx',
      type: 'file',
      path: 'src/App.tsx',
      size: 2048,
      language: 'TypeScript'
    },
    {
      name: 'index.tsx',
      type: 'file',
      path: 'src/index.tsx',
      size: 512,
      language: 'TypeScript'
    },
    {
      name: 'package.json',
      type: 'file',
      path: 'package.json',
      size: 1024,
      language: 'JSON'
    },
    {
      name: 'README.md',
      type: 'file',
      path: 'README.md',
      size: 3072,
      language: 'Markdown'
    }
  ];
  res.json(files);
});

// Get issues
app.get('/api/issues', (req, res) => {
  const repoId = req.query.repoId;
  if (repoId) {
    const repoIssues = ISSUES.filter(i => i.repoId === parseInt(repoId));
    res.json(repoIssues);
  } else {
    res.json(ISSUES);
  }
});

// Get single issue
app.get('/api/issues/:id', (req, res) => {
  const issue = ISSUES.find(i => i.id === parseInt(req.params.id));
  if (issue) {
    res.json(issue);
  } else {
    res.status(404).json({ message: 'Issue not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

