# Smart Research Collaboration & Idea Incubator — Design Spec

**Date:** 2026-04-26
**GitHub Repo:** `smart-research-collaboration-idea-incubator`
**Owner:** ShadowMonarch71
**Stack:** MERN (MongoDB Atlas + Express 5 + React 19 + Node.js)

---

## 1. Repository Structure

```
IDEA-INCUBATOR/
├── .tools/                  # gitignored — CLAUDE.md, memory/, superpowers files
├── .gitignore
├── docker-compose.yml
├── docs/
├── backend/
│   ├── server.js
│   ├── .env.example
│   ├── package.json
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ideaController.js
│   │   ├── commentController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Idea.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ideaRoutes.js
│   │   ├── commentRoutes.js
│   │   └── userRoutes.js
│   └── validators/
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   └── axiosInstance.js
        ├── store/
        │   ├── authStore.js
        │   └── ideaStore.js
        ├── hooks/
        ├── utils/
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── IdeaDetailPage.jsx
        │   ├── CreateIdeaPage.jsx
        │   ├── EditIdeaPage.jsx
        │   ├── DashboardPage.jsx
        │   ├── ProfilePage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   └── NotFoundPage.jsx
        └── components/
            ├── idea/
            │   ├── IdeaCard.jsx
            │   ├── IdeaForm.jsx
            │   └── IdeaList.jsx
            ├── comment/
            │   └── Comment.jsx
            ├── common/
            │   └── ProtectedRoute.jsx
            └── layout/
                ├── Navbar.jsx
                └── Footer.jsx
```

---

## 2. Tech Stack

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI framework |
| Vite | latest | Build tool + dev server |
| react-router-dom | v7 | Client-side routing |
| zustand | latest | Global state (auth + ideas) |
| axios | latest | HTTP client |
| formik + yup | latest | Forms + validation |
| tailwindcss + @tailwindcss/vite | v4 | Styling (Vite plugin, no config file) |
| react-icons | latest | Icons |
| react-toastify | latest | Toast notifications |

### Backend
| Package | Purpose |
|---------|---------|
| express (v5) | REST API framework |
| mongoose | MongoDB ODM |
| jsonwebtoken | JWT auth |
| bcryptjs | Password hashing |
| cors | Cross-origin requests |
| dotenv | Environment variables |
| nodemon | Dev hot reload |
| express-validator | Input validation |

---

## 3. Data Models

### User
```js
{ name, email, password, bio, department, avatar, savedIdeas[], timestamps }
```

### Idea
```js
{ title, description, category (enum), tags[], author, collaborators[], interestedUsers[], status (enum), timestamps }
```

### Comment
```js
{ idea (ref), author (ref), text, timestamps }
```

---

## 4. API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login + JWT |
| GET | /api/ideas | No | List ideas (search/filter/paginate) |
| POST | /api/ideas | Yes | Create idea |
| GET | /api/ideas/:id | No | Get single idea |
| PUT | /api/ideas/:id | Yes (author) | Update idea |
| DELETE | /api/ideas/:id | Yes (author) | Delete idea |
| POST | /api/ideas/:id/interest | Yes | Toggle interest |
| POST | /api/ideas/:id/collaborate | Yes | Toggle collaboration |
| GET | /api/comments?ideaId=:id | No | Get comments for idea |
| POST | /api/comments | Yes | Post comment |
| DELETE | /api/comments/:id | Yes (author) | Delete comment |
| GET | /api/users/:id | No | Get user profile |
| PUT | /api/users/:id | Yes (self) | Update profile |

---

## 5. Frontend Pages & Routes

| Route | Page | Protected |
|-------|------|-----------|
| `/` | LandingPage | No |
| `/login` | LoginPage | No |
| `/register` | RegisterPage | No |
| `/home` | HomePage | Yes |
| `/ideas/new` | CreateIdeaPage | Yes |
| `/ideas/:id` | IdeaDetailPage | Yes |
| `/ideas/:id/edit` | EditIdeaPage | Yes (author) |
| `/dashboard` | DashboardPage | Yes |
| `/profile/:id` | ProfilePage | No |
| `*` | NotFoundPage | No |

---

## 6. State Management

- **authStore** — `{ user, token }`, persisted to localStorage. Actions: `login`, `logout`, `register`.
- **ideaStore** — `{ ideas[], pagination, filters: { keyword, category, page } }`. Actions: `fetchIdeas`, `createIdea`, `updateIdea`, `deleteIdea`.
- `axiosInstance.js` auto-injects `Authorization: Bearer <token>` from authStore. Redirects to `/login` on 401.

---

## 7. .gitignore Strategy

A `.tools/` folder at the repo root holds all AI/Claude-related files (CLAUDE.md, memory/, superpowers plugins). This folder is added to `.gitignore` so it never appears in the GitHub repository.

Standard ignores: `node_modules/`, `.env`, `dist/`, build artifacts.

---

## 8. Git Commit Strategy (Organic History)

1. `Initial project setup — monorepo structure, .gitignore, docker-compose`
2. `Backend: Express server, DB connection, auth models and routes`
3. `Backend: Ideas, comments, users — controllers, routes, validators`
4. `Frontend: Vite scaffold, Tailwind v4, routing skeleton, Zustand stores`
5. `Frontend: Auth pages — Login, Register with Formik+Yup`
6. `Frontend: Home feed, IdeaCard, search/filter, pagination`
7. `Frontend: Idea detail, create, edit pages`
8. `Frontend: Profile page, Navbar, Footer`
9. `Add docker-compose, env examples, final cleanup`

All commits authored as `ShadowMonarch71`. Repo pushed to GitHub as public under `smart-research-collaboration-idea-incubator`.
