# Smart Research Collaboration & Idea Incubator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete MERN stack Idea Incubator platform with JWT auth, idea CRUD, comments, interest/collaboration, and user profiles — then push to GitHub as ShadowMonarch71.

**Architecture:** Monorepo with `/backend` (Express 5 + Mongoose + JWT) and `/frontend` (React 19 + Vite + Tailwind v4 + Zustand). All API calls go through a single axiosInstance that injects the Bearer token. Backend follows MVC: models → validators → controllers → routes → server.js.

**Tech Stack:** Node.js + Express 5 + MongoDB Atlas + Mongoose + bcryptjs + JWT | React 19 + Vite + Tailwind CSS v4 + Zustand + Formik + Yup + Axios + react-icons + react-toastify

> **Note:** No test suite exists in this project. TDD steps are omitted. Each task ends with a git commit.

---

## File Map

```
IDEA-INCUBATOR/
├── .tools/                          # gitignored AI files
├── .gitignore
├── docker-compose.yml
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env
│   ├── .env.example
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Idea.js
│   │   └── Comment.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ideaController.js
│   │   ├── commentController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ideaRoutes.js
│   │   ├── commentRoutes.js
│   │   └── userRoutes.js
│   └── validators/
│       ├── authValidators.js
│       ├── ideaValidators.js
│       └── commentValidators.js
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   └── axiosInstance.js
        ├── store/
        │   ├── authStore.js
        │   └── ideaStore.js
        ├── hooks/
        │   ├── useIdeas.js
        │   └── useAuth.js
        ├── utils/
        │   └── helpers.js
        ├── pages/
        │   ├── LandingPage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── HomePage.jsx
        │   ├── IdeaDetailPage.jsx
        │   ├── CreateIdeaPage.jsx
        │   ├── EditIdeaPage.jsx
        │   ├── DashboardPage.jsx
        │   ├── ProfilePage.jsx
        │   └── NotFoundPage.jsx
        └── components/
            ├── common/
            │   └── ProtectedRoute.jsx
            ├── layout/
            │   ├── Navbar.jsx
            │   └── Footer.jsx
            ├── idea/
            │   ├── IdeaCard.jsx
            │   ├── IdeaForm.jsx
            │   └── IdeaList.jsx
            └── comment/
                └── Comment.jsx
```

---

## Task 1: Git Init, .gitignore, .tools Folder

**Files:**
- Create: `.gitignore`
- Create: `.tools/` (folder)
- Move: `CLAUDE.md` → `.tools/CLAUDE.md`

- [ ] **Step 1: Configure git with ShadowMonarch71 identity**

```bash
cd "X:/Projects/College/IDEA-INCUBATOR"
git init
git config user.name "ShadowMonarch71"
git config user.email "xz9coder@gmail.com"
```

- [ ] **Step 2: Create .tools folder and move CLAUDE.md into it**

```bash
mkdir .tools
mv CLAUDE.md .tools/CLAUDE.md
```

- [ ] **Step 3: Create .gitignore**

Create `X:/Projects/College/IDEA-INCUBATOR/.gitignore`:

```gitignore
# AI / Claude tools — keep off GitHub
.tools/

# Temp docx extraction artifacts
_docx_extract/
_docx_extract.zip
.~lock.*

# Dependencies
node_modules/

# Environment variables
.env
backend/.env

# Build output
dist/
build/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# Vite
*.local
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "Initial project setup — .gitignore, .tools folder for AI files"
```

---

## Task 2: Docker Compose + Folder Scaffolding

**Files:**
- Create: `docker-compose.yml`
- Create: `backend/` (folder)
- Create: `frontend/` (folder)

- [ ] **Step 1: Create docker-compose.yml**

Create `X:/Projects/College/IDEA-INCUBATOR/docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - '5000:5000'
    env_file:
      - ./backend/.env
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

- [ ] **Step 2: Create backend and frontend stub folders**

```bash
mkdir backend frontend
```

- [ ] **Step 3: Commit**

```bash
git add docker-compose.yml
git commit -m "Add docker-compose for backend and MongoDB services"
```

---

## Task 3: Backend — package.json + server.js

**Files:**
- Create: `backend/package.json`
- Create: `backend/server.js`
- Create: `backend/.env.example`
- Create: `backend/.env`

- [ ] **Step 1: Init backend package and install dependencies**

```bash
cd backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv cors express-validator
npm install -D nodemon
```

- [ ] **Step 2: Edit package.json to add scripts**

Edit `backend/package.json` — replace the `"scripts"` section:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

- [ ] **Step 3: Create backend/.env.example**

Create `backend/.env.example`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/idea-incubator
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

- [ ] **Step 4: Create backend/.env (local only, gitignored)**

Create `backend/.env` with same content as `.env.example` (swap in real values when available).

- [ ] **Step 5: Create backend/server.js**

Create `backend/server.js`:

```js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const ideaRoutes = require('./routes/ideaRoutes');
const commentRoutes = require('./routes/commentRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

- [ ] **Step 6: Commit**

```bash
cd ..
git add backend/
git commit -m "Backend: Express server scaffold, package.json, env example"
```

---

## Task 4: Backend — Database Config + Models

**Files:**
- Create: `backend/config/db.js`
- Create: `backend/models/User.js`
- Create: `backend/models/Idea.js`
- Create: `backend/models/Comment.js`

- [ ] **Step 1: Create backend/config/db.js**

```js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

- [ ] **Step 2: Create backend/models/User.js**

```js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    bio: { type: String, default: '' },
    department: { type: String, default: '' },
    avatar: { type: String, default: '' },
    savedIdeas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Idea' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
```

- [ ] **Step 3: Create backend/models/Idea.js**

```js
const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Tech', 'Business', 'Social', 'Science', 'Art', 'Other'],
    },
    tags: [{ type: String, trim: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    interestedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Idea', ideaSchema);
```

- [ ] **Step 4: Create backend/models/Comment.js**

```js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    idea: { type: mongoose.Schema.Types.ObjectId, ref: 'Idea', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
```

- [ ] **Step 5: Commit**

```bash
git add backend/config/ backend/models/
git commit -m "Backend: MongoDB connection config and Mongoose models (User, Idea, Comment)"
```

---

## Task 5: Backend — Middleware

**Files:**
- Create: `backend/middleware/authMiddleware.js`
- Create: `backend/middleware/errorMiddleware.js`

- [ ] **Step 1: Create backend/middleware/authMiddleware.js**

```js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
```

- [ ] **Step 2: Create backend/middleware/errorMiddleware.js**

```js
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
```

- [ ] **Step 3: Commit**

```bash
git add backend/middleware/
git commit -m "Backend: JWT auth middleware and error handler middleware"
```

---

## Task 6: Backend — Validators

**Files:**
- Create: `backend/validators/authValidators.js`
- Create: `backend/validators/ideaValidators.js`
- Create: `backend/validators/commentValidators.js`

- [ ] **Step 1: Create backend/validators/authValidators.js**

```js
const { body } = require('express-validator');

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidator = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

module.exports = { registerValidator, loginValidator };
```

- [ ] **Step 2: Create backend/validators/ideaValidators.js**

```js
const { body } = require('express-validator');

const ideaValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category')
    .isIn(['Tech', 'Business', 'Social', 'Science', 'Art', 'Other'])
    .withMessage('Invalid category'),
];

module.exports = { ideaValidator };
```

- [ ] **Step 3: Create backend/validators/commentValidators.js**

```js
const { body } = require('express-validator');

const commentValidator = [
  body('text').trim().notEmpty().withMessage('Comment text is required'),
  body('ideaId').notEmpty().withMessage('Idea ID is required'),
];

module.exports = { commentValidator };
```

- [ ] **Step 4: Commit**

```bash
git add backend/validators/
git commit -m "Backend: express-validator chains for auth, idea, and comment inputs"
```

---

## Task 7: Backend — Auth Controller + Routes

**Files:**
- Create: `backend/controllers/authController.js`
- Create: `backend/routes/authRoutes.js`

- [ ] **Step 1: Create backend/controllers/authController.js**

```js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, bio, department } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, bio, department });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    department: user.department,
    avatar: user.avatar,
    token: generateToken(user._id),
  });
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    department: user.department,
    avatar: user.avatar,
    token: generateToken(user._id),
  });
};

module.exports = { registerUser, loginUser };
```

- [ ] **Step 2: Create backend/routes/authRoutes.js**

```js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidators');

router.post('/register', registerValidator, registerUser);
router.post('/login', loginValidator, loginUser);

module.exports = router;
```

- [ ] **Step 3: Commit**

```bash
git add backend/controllers/authController.js backend/routes/authRoutes.js
git commit -m "Backend: auth controller and routes — register and login with JWT"
```

---

## Task 8: Backend — Idea Controller + Routes

**Files:**
- Create: `backend/controllers/ideaController.js`
- Create: `backend/routes/ideaRoutes.js`

- [ ] **Step 1: Create backend/controllers/ideaController.js**

```js
const Idea = require('../models/Idea');
const { validationResult } = require('express-validator');

const getIdeas = async (req, res) => {
  const { keyword, category, status, page = 1, limit = 9 } = req.query;
  const query = {};
  if (keyword) query.$or = [
    { title: { $regex: keyword, $options: 'i' } },
    { description: { $regex: keyword, $options: 'i' } },
    { tags: { $regex: keyword, $options: 'i' } },
  ];
  if (category) query.category = category;
  if (status) query.status = status;

  const total = await Idea.countDocuments(query);
  const ideas = await Idea.find(query)
    .populate('author', 'name email department avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({ ideas, total, page: Number(page), pages: Math.ceil(total / limit) });
};

const getIdeaById = async (req, res) => {
  const idea = await Idea.findById(req.params.id)
    .populate('author', 'name email department avatar')
    .populate('collaborators', 'name email department avatar')
    .populate('interestedUsers', 'name email department avatar');
  if (!idea) return res.status(404).json({ message: 'Idea not found' });
  res.json(idea);
};

const createIdea = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { title, description, category, tags, status } = req.body;
  const idea = await Idea.create({
    title, description, category,
    tags: tags || [],
    status: status || 'open',
    author: req.user._id,
  });
  res.status(201).json(idea);
};

const updateIdea = async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  if (!idea) return res.status(404).json({ message: 'Idea not found' });
  if (idea.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });

  const { title, description, category, tags, status } = req.body;
  idea.title = title ?? idea.title;
  idea.description = description ?? idea.description;
  idea.category = category ?? idea.category;
  idea.tags = tags ?? idea.tags;
  idea.status = status ?? idea.status;

  const updated = await idea.save();
  res.json(updated);
};

const deleteIdea = async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  if (!idea) return res.status(404).json({ message: 'Idea not found' });
  if (idea.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });
  await idea.deleteOne();
  res.json({ message: 'Idea removed' });
};

const expressInterest = async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  if (!idea) return res.status(404).json({ message: 'Idea not found' });

  const alreadyInterested = idea.interestedUsers.includes(req.user._id);
  if (alreadyInterested) {
    idea.interestedUsers = idea.interestedUsers.filter(
      (uid) => uid.toString() !== req.user._id.toString()
    );
  } else {
    idea.interestedUsers.push(req.user._id);
  }
  await idea.save();
  res.json({ interestedUsers: idea.interestedUsers });
};

const requestCollaborate = async (req, res) => {
  const idea = await Idea.findById(req.params.id);
  if (!idea) return res.status(404).json({ message: 'Idea not found' });

  const alreadyCollaborating = idea.collaborators.includes(req.user._id);
  if (alreadyCollaborating) {
    idea.collaborators = idea.collaborators.filter(
      (uid) => uid.toString() !== req.user._id.toString()
    );
  } else {
    idea.collaborators.push(req.user._id);
  }
  await idea.save();
  res.json({ collaborators: idea.collaborators });
};

module.exports = { getIdeas, getIdeaById, createIdea, updateIdea, deleteIdea, expressInterest, requestCollaborate };
```

- [ ] **Step 2: Create backend/routes/ideaRoutes.js**

```js
const express = require('express');
const router = express.Router();
const {
  getIdeas, getIdeaById, createIdea, updateIdea, deleteIdea,
  expressInterest, requestCollaborate,
} = require('../controllers/ideaController');
const { protect } = require('../middleware/authMiddleware');
const { ideaValidator } = require('../validators/ideaValidators');

router.get('/', getIdeas);
router.post('/', protect, ideaValidator, createIdea);
router.get('/:id', getIdeaById);
router.put('/:id', protect, updateIdea);
router.delete('/:id', protect, deleteIdea);
router.post('/:id/interest', protect, expressInterest);
router.post('/:id/collaborate', protect, requestCollaborate);

module.exports = router;
```

- [ ] **Step 3: Commit**

```bash
git add backend/controllers/ideaController.js backend/routes/ideaRoutes.js
git commit -m "Backend: idea controller — CRUD, interest, collaboration with pagination and search"
```

---

## Task 9: Backend — Comment + User Controllers + Routes

**Files:**
- Create: `backend/controllers/commentController.js`
- Create: `backend/controllers/userController.js`
- Create: `backend/routes/commentRoutes.js`
- Create: `backend/routes/userRoutes.js`

- [ ] **Step 1: Create backend/controllers/commentController.js**

```js
const Comment = require('../models/Comment');
const { validationResult } = require('express-validator');

const getComments = async (req, res) => {
  const { ideaId } = req.query;
  const comments = await Comment.find({ idea: ideaId })
    .populate('author', 'name avatar department')
    .sort({ createdAt: 1 });
  res.json(comments);
};

const createComment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { text, ideaId } = req.body;
  const comment = await Comment.create({ text, idea: ideaId, author: req.user._id });
  const populated = await comment.populate('author', 'name avatar department');
  res.status(201).json(populated);
};

const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: 'Comment not found' });
  if (comment.author.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });
  await comment.deleteOne();
  res.json({ message: 'Comment removed' });
};

module.exports = { getComments, createComment, deleteComment };
```

- [ ] **Step 2: Create backend/routes/commentRoutes.js**

```js
const express = require('express');
const router = express.Router();
const { getComments, createComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const { commentValidator } = require('../validators/commentValidators');

router.get('/', getComments);
router.post('/', protect, commentValidator, createComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
```

- [ ] **Step 3: Create backend/controllers/userController.js**

```js
const User = require('../models/User');
const Idea = require('../models/Idea');

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  const ideas = await Idea.find({ author: user._id }).sort({ createdAt: -1 });
  res.json({ user, ideas });
};

const updateUserProfile = async (req, res) => {
  if (req.params.id !== req.user._id.toString())
    return res.status(403).json({ message: 'Not authorized' });

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { name, bio, department, avatar } = req.body;
  user.name = name ?? user.name;
  user.bio = bio ?? user.bio;
  user.department = department ?? user.department;
  user.avatar = avatar ?? user.avatar;

  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    bio: updated.bio,
    department: updated.department,
    avatar: updated.avatar,
  });
};

module.exports = { getUserProfile, updateUserProfile };
```

- [ ] **Step 4: Create backend/routes/userRoutes.js**

```js
const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', getUserProfile);
router.put('/:id', protect, updateUserProfile);

module.exports = router;
```

- [ ] **Step 5: Commit**

```bash
git add backend/controllers/commentController.js backend/controllers/userController.js
git add backend/routes/commentRoutes.js backend/routes/userRoutes.js
git commit -m "Backend: comment and user controllers with routes — full backend complete"
```

---

## Task 10: Frontend — Vite Scaffold + Tailwind v4

**Files:**
- Create: `frontend/` (Vite scaffold)
- Create: `frontend/vite.config.js`
- Create: `frontend/src/index.css`

- [ ] **Step 1: Scaffold React app with Vite inside frontend/**

```bash
cd frontend
npm create vite@latest . -- --template react
npm install
```

- [ ] **Step 2: Install all frontend dependencies**

```bash
npm install react-router-dom zustand formik yup axios react-icons react-toastify
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Replace vite.config.js**

Create `frontend/vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
```

- [ ] **Step 4: Replace src/index.css with Tailwind v4 import**

Replace entire contents of `frontend/src/index.css`:

```css
@import "tailwindcss";
```

- [ ] **Step 5: Create frontend/.env**

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:5000
```

- [ ] **Step 6: Commit**

```bash
cd ..
git add frontend/
git commit -m "Frontend: Vite + React 19 scaffold, Tailwind CSS v4, all dependencies installed"
```

---

## Task 11: Frontend — Axios Instance + Zustand Stores

**Files:**
- Create: `frontend/src/api/axiosInstance.js`
- Create: `frontend/src/store/authStore.js`
- Create: `frontend/src/store/ideaStore.js`

- [ ] **Step 1: Create frontend/src/api/axiosInstance.js**

```js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
```

- [ ] **Step 2: Create frontend/src/store/authStore.js**

```js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from '../api/axiosInstance';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const { data } = await axiosInstance.post('/api/auth/login', { email, password });
        set({ user: data, token: data.token });
        return data;
      },

      register: async (formData) => {
        const { data } = await axiosInstance.post('/api/auth/register', formData);
        set({ user: data, token: data.token });
        return data;
      },

      logout: () => set({ user: null, token: null }),

      updateUser: (userData) =>
        set((state) => ({ user: { ...state.user, ...userData } })),
    }),
    { name: 'auth-storage' }
  )
);
```

- [ ] **Step 3: Create frontend/src/store/ideaStore.js**

```js
import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

export const useIdeaStore = create((set, get) => ({
  ideas: [],
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  filters: { keyword: '', category: '', status: '' },

  setFilters: (filters) => set({ filters: { ...get().filters, ...filters }, page: 1 }),
  setPage: (page) => set({ page }),

  fetchIdeas: async () => {
    set({ loading: true });
    const { filters, page } = get();
    const params = new URLSearchParams({ ...filters, page, limit: 9 });
    const { data } = await axiosInstance.get(`/api/ideas?${params}`);
    set({ ideas: data.ideas, total: data.total, page: data.page, pages: data.pages, loading: false });
  },

  createIdea: async (ideaData) => {
    const { data } = await axiosInstance.post('/api/ideas', ideaData);
    return data;
  },

  updateIdea: async (id, ideaData) => {
    const { data } = await axiosInstance.put(`/api/ideas/${id}`, ideaData);
    return data;
  },

  deleteIdea: async (id) => {
    await axiosInstance.delete(`/api/ideas/${id}`);
    set((state) => ({ ideas: state.ideas.filter((i) => i._id !== id) }));
  },
}));
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/api/ frontend/src/store/
git commit -m "Frontend: axios instance with auth interceptor, authStore and ideaStore (Zustand)"
```

---

## Task 12: Frontend — App.jsx + ProtectedRoute + Main

**Files:**
- Modify: `frontend/src/main.jsx`
- Create: `frontend/src/App.jsx`
- Create: `frontend/src/components/common/ProtectedRoute.jsx`

- [ ] **Step 1: Replace frontend/src/main.jsx**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 2: Create frontend/src/components/common/ProtectedRoute.jsx**

```jsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  return token ? children : <Navigate to="/login" replace />;
}
```

- [ ] **Step 3: Create frontend/src/App.jsx**

```jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import IdeaDetailPage from './pages/IdeaDetailPage';
import CreateIdeaPage from './pages/CreateIdeaPage';
import EditIdeaPage from './pages/EditIdeaPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/ideas/new" element={<ProtectedRoute><CreateIdeaPage /></ProtectedRoute>} />
          <Route path="/ideas/:id" element={<ProtectedRoute><IdeaDetailPage /></ProtectedRoute>} />
          <Route path="/ideas/:id/edit" element={<ProtectedRoute><EditIdeaPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/main.jsx frontend/src/App.jsx frontend/src/components/common/
git commit -m "Frontend: App routing skeleton, ProtectedRoute, ToastContainer in main"
```

---

## Task 13: Frontend — Layout (Navbar + Footer)

**Files:**
- Create: `frontend/src/components/layout/Navbar.jsx`
- Create: `frontend/src/components/layout/Footer.jsx`

- [ ] **Step 1: Create frontend/src/components/layout/Navbar.jsx**

```jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FiLogOut, FiUser, FiPlusCircle, FiHome } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          IdeaIncubator
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/home" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600">
                <FiHome /> Home
              </Link>
              <Link to="/ideas/new" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600">
                <FiPlusCircle /> New Idea
              </Link>
              <Link to={`/profile/${user._id}`} className="flex items-center gap-1 text-gray-600 hover:text-indigo-600">
                <FiUser /> {user.name}
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 hover:text-red-700">
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
              <Link to="/register" className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Create frontend/src/components/layout/Footer.jsx**

```jsx
export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Smart Research Collaboration & Idea Incubator. All rights reserved.
    </footer>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/layout/
git commit -m "Frontend: Navbar with auth state and Footer layout components"
```

---

## Task 14: Frontend — Auth Pages (Login + Register)

**Files:**
- Create: `frontend/src/pages/LoginPage.jsx`
- Create: `frontend/src/pages/RegisterPage.jsx`
- Create: `frontend/src/pages/LandingPage.jsx`

- [ ] **Step 1: Create frontend/src/pages/LandingPage.jsx**

```jsx
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">
        Smart Research Collaboration
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mb-8">
        Share ideas, find collaborators, and turn your research into reality — all in one platform built for college innovators.
      </p>
      <div className="flex gap-4">
        <Link
          to="/register"
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2"
        >
          Get Started <FiArrowRight />
        </Link>
        <Link
          to="/login"
          className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create frontend/src/pages/LoginPage.jsx**

```jsx
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await login(values.email, values.password);
        toast.success('Logged in successfully!');
        navigate('/home');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Login failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" name="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" name="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
            )}
          </div>
          <button
            type="submit" disabled={formik.isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          No account? <Link to="/register" className="text-indigo-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create frontend/src/pages/RegisterPage.jsx**

```jsx
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', department: '', bio: '' },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Min 6 characters').required('Required'),
      department: Yup.string(),
      bio: Yup.string(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await register(values);
        toast.success('Account created!');
        navigate('/home');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Registration failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {[
            { name: 'name', label: 'Full Name', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'password', label: 'Password', type: 'password' },
            { name: 'department', label: 'Department (optional)', type: 'text' },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type={type} name={name}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values[name]}
              />
              {formik.touched[name] && formik.errors[name] && (
                <p className="text-red-500 text-xs mt-1">{formik.errors[name]}</p>
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio (optional)</label>
            <textarea
              name="bio" rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.bio}
            />
          </div>
          <button
            type="submit" disabled={formik.isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Already registered? <Link to="/login" className="text-indigo-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/LandingPage.jsx frontend/src/pages/LoginPage.jsx frontend/src/pages/RegisterPage.jsx
git commit -m "Frontend: Landing page, Login and Register pages with Formik+Yup validation"
```

---

## Task 15: Frontend — IdeaCard + IdeaList + HomePage

**Files:**
- Create: `frontend/src/components/idea/IdeaCard.jsx`
- Create: `frontend/src/components/idea/IdeaList.jsx`
- Create: `frontend/src/pages/HomePage.jsx`

- [ ] **Step 1: Create frontend/src/components/idea/IdeaCard.jsx**

```jsx
import { Link } from 'react-router-dom';
import { FiHeart, FiUsers, FiTag } from 'react-icons/fi';

const categoryColors = {
  Tech: 'bg-blue-100 text-blue-700',
  Business: 'bg-yellow-100 text-yellow-700',
  Social: 'bg-green-100 text-green-700',
  Science: 'bg-purple-100 text-purple-700',
  Art: 'bg-pink-100 text-pink-700',
  Other: 'bg-gray-100 text-gray-700',
};

export default function IdeaCard({ idea }) {
  return (
    <Link to={`/ideas/${idea._id}`} className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[idea.category] || 'bg-gray-100 text-gray-700'}`}>
          {idea.category}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full border ${idea.status === 'open' ? 'border-green-400 text-green-600' : idea.status === 'in-progress' ? 'border-yellow-400 text-yellow-600' : 'border-gray-400 text-gray-500'}`}>
          {idea.status}
        </span>
      </div>
      <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-2">{idea.title}</h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-3">{idea.description}</p>
      {idea.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {idea.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
              <FiTag size={10} />{tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{idea.author?.name}</span>
        <div className="flex gap-3">
          <span className="flex items-center gap-1"><FiHeart />{idea.interestedUsers?.length || 0}</span>
          <span className="flex items-center gap-1"><FiUsers />{idea.collaborators?.length || 0}</span>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create frontend/src/components/idea/IdeaList.jsx**

```jsx
import IdeaCard from './IdeaCard';

export default function IdeaList({ ideas }) {
  if (!ideas.length) {
    return <p className="text-center text-gray-400 py-12">No ideas found.</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {ideas.map((idea) => <IdeaCard key={idea._id} idea={idea} />)}
    </div>
  );
}
```

- [ ] **Step 3: Create frontend/src/pages/HomePage.jsx**

```jsx
import { useEffect } from 'react';
import { useIdeaStore } from '../store/ideaStore';
import IdeaList from '../components/idea/IdeaList';
import { FiSearch } from 'react-icons/fi';

const CATEGORIES = ['', 'Tech', 'Business', 'Social', 'Science', 'Art', 'Other'];
const STATUSES = ['', 'open', 'in-progress', 'completed'];

export default function HomePage() {
  const { ideas, loading, pages, page, filters, setFilters, setPage, fetchIdeas } = useIdeaStore();

  useEffect(() => { fetchIdeas(); }, [filters, page]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Explore Ideas</h1>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-48 bg-white">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text" placeholder="Search ideas..."
            className="flex-1 outline-none text-sm"
            value={filters.keyword}
            onChange={(e) => setFilters({ keyword: e.target.value })}
          />
        </div>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value })}
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c || 'All Categories'}</option>)}
        </select>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-400 py-12">Loading ideas...</p>
      ) : (
        <IdeaList ideas={ideas} />
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p} onClick={() => setPage(p)}
              className={`px-3 py-1 rounded-lg text-sm border ${p === page ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/idea/ frontend/src/pages/HomePage.jsx
git commit -m "Frontend: IdeaCard, IdeaList components and HomePage with search, filter, pagination"
```

---

## Task 16: Frontend — IdeaForm + CreateIdeaPage + EditIdeaPage

**Files:**
- Create: `frontend/src/components/idea/IdeaForm.jsx`
- Create: `frontend/src/pages/CreateIdeaPage.jsx`
- Create: `frontend/src/pages/EditIdeaPage.jsx`

- [ ] **Step 1: Create frontend/src/components/idea/IdeaForm.jsx**

```jsx
import { useFormik } from 'formik';
import * as Yup from 'yup';

const CATEGORIES = ['Tech', 'Business', 'Social', 'Science', 'Art', 'Other'];
const STATUSES = ['open', 'in-progress', 'completed'];

export default function IdeaForm({ initialValues, onSubmit, showStatus = false, submitLabel = 'Submit' }) {
  const formik = useFormik({
    initialValues: initialValues || {
      title: '', description: '', category: 'Tech', tags: '', status: 'open',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      category: Yup.string().required('Category is required'),
      tags: Yup.string(),
      status: Yup.string(),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const payload = {
        ...values,
        tags: values.tags ? values.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      await onSubmit(payload, setSubmitting);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          name="title" type="text"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.title}
        />
        {formik.touched.title && formik.errors.title && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description" rows={5}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.description}
        />
        {formik.touched.description && formik.errors.description && (
          <p className="text-red-500 text-xs mt-1">{formik.errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          name="category"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.category}
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
        <input
          name="tags" type="text" placeholder="e.g. agriculture, mobile, social"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.tags}
        />
      </div>

      {showStatus && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.status}
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}

      <button
        type="submit" disabled={formik.isSubmitting}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
      >
        {formik.isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Create frontend/src/pages/CreateIdeaPage.jsx**

```jsx
import { useNavigate } from 'react-router-dom';
import { useIdeaStore } from '../store/ideaStore';
import IdeaForm from '../components/idea/IdeaForm';
import { toast } from 'react-toastify';

export default function CreateIdeaPage() {
  const createIdea = useIdeaStore((s) => s.createIdea);
  const navigate = useNavigate();

  const handleSubmit = async (values, setSubmitting) => {
    try {
      const idea = await createIdea(values);
      toast.success('Idea submitted!');
      navigate(`/ideas/${idea._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create idea');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Submit a New Idea</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <IdeaForm onSubmit={handleSubmit} submitLabel="Submit Idea" />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create frontend/src/pages/EditIdeaPage.jsx**

```jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useIdeaStore } from '../store/ideaStore';
import IdeaForm from '../components/idea/IdeaForm';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosInstance';

export default function EditIdeaPage() {
  const { id } = useParams();
  const updateIdea = useIdeaStore((s) => s.updateIdea);
  const navigate = useNavigate();
  const [idea, setIdea] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/api/ideas/${id}`).then(({ data }) => setIdea(data));
  }, [id]);

  const handleSubmit = async (values, setSubmitting) => {
    try {
      await updateIdea(id, values);
      toast.success('Idea updated!');
      navigate(`/ideas/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update idea');
    } finally {
      setSubmitting(false);
    }
  };

  if (!idea) return <p className="text-center py-12 text-gray-400">Loading...</p>;

  const initialValues = {
    title: idea.title,
    description: idea.description,
    category: idea.category,
    tags: idea.tags?.join(', ') || '',
    status: idea.status,
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Idea</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <IdeaForm initialValues={initialValues} onSubmit={handleSubmit} showStatus submitLabel="Update Idea" />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/components/idea/IdeaForm.jsx frontend/src/pages/CreateIdeaPage.jsx frontend/src/pages/EditIdeaPage.jsx
git commit -m "Frontend: reusable IdeaForm, CreateIdeaPage and EditIdeaPage with Formik+Yup"
```

---

## Task 17: Frontend — Comment Component + IdeaDetailPage

**Files:**
- Create: `frontend/src/components/comment/Comment.jsx`
- Create: `frontend/src/pages/IdeaDetailPage.jsx`

- [ ] **Step 1: Create frontend/src/components/comment/Comment.jsx**

```jsx
import { FiTrash2, FiUser } from 'react-icons/fi';
import { useAuthStore } from '../../store/authStore';

export default function Comment({ comment, onDelete }) {
  const user = useAuthStore((s) => s.user);
  const isOwner = user?._id === comment.author?._id;

  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
        <FiUser />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">{comment.author?.name}</span>
          {isOwner && (
            <button onClick={() => onDelete(comment._id)} className="text-red-400 hover:text-red-600">
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
        <p className="text-sm text-gray-600 mt-0.5">{comment.text}</p>
        <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create frontend/src/pages/IdeaDetailPage.jsx**

```jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useIdeaStore } from '../store/ideaStore';
import Comment from '../components/comment/Comment';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { FiHeart, FiUsers, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function IdeaDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const deleteIdea = useIdeaStore((s) => s.deleteIdea);
  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const fetchIdea = () => axiosInstance.get(`/api/ideas/${id}`).then(({ data }) => setIdea(data));
  const fetchComments = () => axiosInstance.get(`/api/comments?ideaId=${id}`).then(({ data }) => setComments(data));

  useEffect(() => { fetchIdea(); fetchComments(); }, [id]);

  const handleInterest = async () => {
    await axiosInstance.post(`/api/ideas/${id}/interest`);
    fetchIdea();
  };

  const handleCollaborate = async () => {
    await axiosInstance.post(`/api/ideas/${id}/collaborate`);
    fetchIdea();
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this idea?')) return;
    await deleteIdea(id);
    toast.success('Idea deleted');
    navigate('/home');
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await axiosInstance.post('/api/comments', { text: commentText, ideaId: id });
      setCommentText('');
      fetchComments();
    } catch (err) {
      toast.error('Failed to post comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    await axiosInstance.delete(`/api/comments/${commentId}`);
    fetchComments();
  };

  if (!idea) return <p className="text-center py-12 text-gray-400">Loading...</p>;

  const isAuthor = user?._id === idea.author?._id;
  const isInterested = idea.interestedUsers?.some((u) => u._id === user?._id);
  const isCollaborating = idea.collaborators?.some((u) => u._id === user?._id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full mr-2">{idea.category}</span>
            <span className="text-xs border border-gray-300 text-gray-500 px-2 py-1 rounded-full">{idea.status}</span>
          </div>
          {isAuthor && (
            <div className="flex gap-2">
              <Link to={`/ideas/${id}/edit`} className="text-indigo-500 hover:text-indigo-700"><FiEdit2 /></Link>
              <button onClick={handleDelete} className="text-red-400 hover:text-red-600"><FiTrash2 /></button>
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{idea.title}</h1>
        <p className="text-gray-600 mb-4">{idea.description}</p>
        {idea.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags.map((tag) => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">#{tag}</span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4">
          <button
            onClick={handleInterest}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border transition ${isInterested ? 'bg-red-50 border-red-400 text-red-500' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            <FiHeart /> {idea.interestedUsers?.length || 0} Interested
          </button>
          <button
            onClick={handleCollaborate}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium border transition ${isCollaborating ? 'bg-indigo-50 border-indigo-400 text-indigo-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}
          >
            <FiUsers /> {idea.collaborators?.length || 0} Collaborators
          </button>
        </div>
      </div>

      {/* Comments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Discussion</h2>
        <form onSubmit={handleAddComment} className="flex gap-2 mb-4">
          <input
            type="text" placeholder="Add a comment..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={commentText} onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
            Post
          </button>
        </form>
        {comments.length === 0 ? (
          <p className="text-sm text-gray-400">No comments yet. Be the first!</p>
        ) : (
          comments.map((c) => <Comment key={c._id} comment={c} onDelete={handleDeleteComment} />)
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/comment/ frontend/src/pages/IdeaDetailPage.jsx
git commit -m "Frontend: IdeaDetailPage with interest, collaboration, threaded comments"
```

---

## Task 18: Frontend — ProfilePage + DashboardPage + NotFoundPage

**Files:**
- Create: `frontend/src/pages/ProfilePage.jsx`
- Create: `frontend/src/pages/DashboardPage.jsx`
- Create: `frontend/src/pages/NotFoundPage.jsx`

- [ ] **Step 1: Create frontend/src/pages/ProfilePage.jsx**

```jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import IdeaCard from '../components/idea/IdeaCard';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { FiEdit2, FiCheck, FiX } from 'react-icons/fi';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: authUser, updateUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});

  const fetchProfile = () =>
    axiosInstance.get(`/api/users/${id}`).then(({ data }) => {
      setProfile(data.user);
      setIdeas(data.ideas);
      setForm({ name: data.user.name, bio: data.user.bio, department: data.user.department });
    });

  useEffect(() => { fetchProfile(); }, [id]);

  const handleSave = async () => {
    try {
      const { data } = await axiosInstance.put(`/api/users/${id}`, form);
      setProfile(data);
      updateUser(data);
      setEditing(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  if (!profile) return <p className="text-center py-12 text-gray-400">Loading...</p>;

  const isOwner = authUser?._id === id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Name"
                />
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="Department"
                />
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3} placeholder="Bio"
                />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
                {profile.department && <p className="text-indigo-600 text-sm">{profile.department}</p>}
                {profile.bio && <p className="text-gray-600 mt-2">{profile.bio}</p>}
              </>
            )}
          </div>
          {isOwner && (
            <div className="flex gap-2 ml-4">
              {editing ? (
                <>
                  <button onClick={handleSave} className="text-green-500 hover:text-green-700"><FiCheck size={18} /></button>
                  <button onClick={() => setEditing(false)} className="text-red-400 hover:text-red-600"><FiX size={18} /></button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-indigo-600"><FiEdit2 size={18} /></button>
              )}
            </div>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Submitted Ideas ({ideas.length})</h2>
      {ideas.length === 0 ? (
        <p className="text-gray-400">No ideas submitted yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => <IdeaCard key={idea._id} idea={idea} />)}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create frontend/src/pages/DashboardPage.jsx**

```jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useIdeaStore } from '../store/ideaStore';
import IdeaCard from '../components/idea/IdeaCard';
import { FiPlusCircle } from 'react-icons/fi';

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { ideas, fetchIdeas } = useIdeaStore();

  useEffect(() => { fetchIdeas(); }, []);

  const myIdeas = ideas.filter((i) => i.author?._id === user?._id || i.author === user?._id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name}</p>
        </div>
        <Link
          to="/ideas/new"
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <FiPlusCircle /> New Idea
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-indigo-600">{myIdeas.length}</p>
          <p className="text-gray-500 text-sm">My Ideas</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-green-500">
            {myIdeas.filter((i) => i.status === 'open').length}
          </p>
          <p className="text-gray-500 text-sm">Open</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-3xl font-bold text-yellow-500">
            {myIdeas.filter((i) => i.status === 'in-progress').length}
          </p>
          <p className="text-gray-500 text-sm">In Progress</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">My Ideas</h2>
      {myIdeas.length === 0 ? (
        <p className="text-gray-400">You haven't submitted any ideas yet. <Link to="/ideas/new" className="text-indigo-600 hover:underline">Create one!</Link></p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myIdeas.map((idea) => <IdeaCard key={idea._id} idea={idea} />)}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create frontend/src/pages/NotFoundPage.jsx**

```jsx
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-extrabold text-indigo-600 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Page not found</p>
      <Link to="/" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
        Go Home
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/ProfilePage.jsx frontend/src/pages/DashboardPage.jsx frontend/src/pages/NotFoundPage.jsx
git commit -m "Frontend: ProfilePage with inline editing, DashboardPage overview, 404 page"
```

---

## Task 19: Frontend — Cleanup (Remove Vite Boilerplate)

**Files:**
- Modify: `frontend/src/App.css` (delete content)
- Delete: `frontend/public/vite.svg`
- Delete: `frontend/src/assets/react.svg`

- [ ] **Step 1: Clear Vite boilerplate CSS**

Replace entire contents of `frontend/src/App.css` with:

```css
```

(empty file)

- [ ] **Step 2: Remove boilerplate assets**

```bash
rm -f frontend/public/vite.svg frontend/src/assets/react.svg
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Frontend: remove Vite boilerplate assets and default CSS"
```

---

## Task 20: Create GitHub Repo + Push

- [ ] **Step 1: Verify git identity is set correctly**

```bash
git config user.name
git config user.email
```

Expected output:
```
ShadowMonarch71
xz9coder@gmail.com
```

- [ ] **Step 2: Create public GitHub repo**

```bash
gh repo create smart-research-collaboration-idea-incubator --public --description "Smart Research Collaboration & Idea Incubator — MERN Stack College Project"
```

- [ ] **Step 3: Add remote and push**

```bash
git remote add origin https://github.com/ShadowMonarch71/smart-research-collaboration-idea-incubator.git
git branch -M main
git push -u origin main
```

- [ ] **Step 4: Verify on GitHub**

```bash
gh repo view ShadowMonarch71/smart-research-collaboration-idea-incubator --web
```

---

## Self-Review Checklist

- [x] `.gitignore` covers `.tools/`, `node_modules/`, `.env`, `dist/`
- [x] All 3 Mongoose models defined (User, Idea, Comment)
- [x] Auth: register + login + JWT — Task 7
- [x] Ideas: CRUD + interest + collaborate + search/filter/pagination — Task 8
- [x] Comments: get + create + delete — Task 9
- [x] Users: get profile + update profile — Task 9
- [x] authMiddleware protects all write routes
- [x] errorMiddleware registered last in server.js — Task 3
- [x] axiosInstance injects Bearer token + handles 401 — Task 11
- [x] authStore persisted to localStorage — Task 11
- [x] ProtectedRoute guards all authenticated pages — Task 12
- [x] All 9 pages implemented — Tasks 14–18
- [x] IdeaForm is reusable across Create and Edit — Task 16
- [x] react-icons used throughout (Navbar, IdeaCard, Comment, etc.)
- [x] react-toastify on all success/error paths
- [x] Tailwind v4 via `@tailwindcss/vite` plugin — no tailwind.config.js
- [x] Git commits are organic and authored as ShadowMonarch71 — Task 20
- [x] All function names consistent across tasks (no rename drift)
