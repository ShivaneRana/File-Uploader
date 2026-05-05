# File Uploader

A full-stack file storage web application built with Node.js and Express. Users can register, log in, and manage their files and folders — with files stored securely on **Supabase Storage** and metadata persisted in a **PostgreSQL** database via **Prisma ORM**.

---

## Screenshots

<!-- Add screenshots below -->

| Dashboard                                 | Folder View                                     |
| ----------------------------------------- | ----------------------------------------------- |
| ![Dashboard](./screenshots/dashboard.png) | ![Sidebar View](./screenshots/sidebar-view.png) |

---

## Features

- User authentication with **Passport.js** (local strategy) and **bcrypt** password hashing
- Create, rename, and delete **nested folders**
- Upload files to **Supabase Storage** (via Multer buffer)
- Download files directly from Supabase
- Delete files (removed from both Supabase and the database)
- Organize files inside specific folders or at the root level
- Flash messages for user feedback (toast notifications)
- Session persistence using **Prisma Session Store**
- Response compression via `compression` middleware
- DB keepalive ping every 4 days to prevent Supabase from pausing

---

## Tech Stack

| Layer             | Technology                   |
| ----------------- | ---------------------------- |
| Runtime           | Node.js                      |
| Framework         | Express.js v5                |
| View Engine       | EJS                          |
| ORM               | Prisma (PostgreSQL)          |
| File Storage      | Supabase Storage             |
| Auth              | Passport.js (Local Strategy) |
| Upload Middleware | Multer                       |
| Session Store     | @quixo3/prisma-session-store |
| Password Hashing  | bcryptjs                     |
| Validation        | express-validator            |
| Code Style        | Prettier                     |

---

## Database Schema

```prisma
model User {
  id       Int      @id @default(autoincrement())
  username String   @unique
  password String
  email    String?
  folders  Folder[]
  files    File[]
}

model Folder {
  id        Int      @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now())
  parentId  Int?        // supports nested folders
  userId    Int
  files     File[]
}

model File {
  id            Int      @id @default(autoincrement())
  name          String               // original filename
  newfilename   String               // Supabase storage path
  type          String               // MIME type
  size_in_bytes Int      @default(0)
  createdAt     DateTime @default(now())
  folderId      Int?     // null = root level
  userId        Int
}

model Session {
  id        String   @id
  sid       String   @unique
  data      String
  expiresAt DateTime
}
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- A [Supabase](https://supabase.com) project with a storage bucket
- A PostgreSQL database (Supabase provides one)

### Installation

```bash
# Clone the repo
git clone https://github.com/ShivaneRana/File-Uploader.git
cd File-Uploader

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@host:port/dbname
SESSION_SECRET=your_session_secret

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_BUCKET_NAME=your_bucket_name
```

### Database Setup

```bash
# Run Prisma migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### Running the App

```bash
# Development (with file watching)
npm run dev

# Production
npm start
```

---

## Project Structure

```
File-Uploader/
├── app.js                    # Express app entry point
├── config/
│   └── supabase.js           # Supabase client setup
├── controllers/
│   ├── indexController.js    # Home/dashboard views
│   ├── loginController.js    # Login logic
│   ├── registerController.js # Registration + validation
│   └── uploadController.js   # File & folder CRUD + Supabase ops
├── db/
│   └── queries.js            # Prisma database queries
├── generated/
│   └── prisma/               # Auto-generated Prisma client
├── lib/
│   └── prisma.js             # Prisma client singleton
├── middlewares/
│   ├── isAuth.js             # Auth guard middleware
│   └── passport.js           # Passport local strategy config
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration history
├── routers/                  # Express route definitions
├── views/                    # EJS templates
├── public/                   # Static assets
├── .env                      # Environment variables (not committed)
├── .gitignore
├── .prettierrc
└── package.json
```

---

## Routes Overview

| Method   | Path                            | Description                           |
| -------- | ------------------------------- | ------------------------------------- |
| `GET`    | `/`                             | Landing page                          |
| `GET`    | `/home`                         | User dashboard (root files & folders) |
| `GET`    | `/home/:folderId`               | View contents of a specific folder    |
| `POST`   | `/register`                     | Register a new user                   |
| `POST`   | `/login`                        | Log in                                |
| `GET`    | `/logout`                       | Log out and destroy session           |
| `POST`   | `/upload/file`                  | Upload a file to root                 |
| `POST`   | `/upload/file/:targetId`        | Upload a file to a specific folder    |
| `POST`   | `/upload/folder`                | Create a folder at root               |
| `POST`   | `/upload/folder/:targetId`      | Create a nested folder                |
| `DELETE` | `/upload/folder/:folderId`      | Delete folder and its files           |
| `PATCH`  | `/upload/folder/:folderId`      | Rename a folder                       |
| `DELETE` | `/upload/file/:fileId`          | Delete a file                         |
| `GET`    | `/upload/file/:fileId/download` | Download a file                       |

---

## Creating a Project ZIP (Excluding node_modules)

```bash
# Mac/Linux
zip -r project.zip . -x "node_modules/*"

# Windows (PowerShell)
Get-ChildItem -Recurse -Exclude node_modules | Compress-Archive -DestinationPath project.zip

# Git-tracked files only
git archive --format=zip HEAD -o project.zip
```

---

## Scripts

```bash
npm run dev      # Start with --watch (auto-restarts on file changes)
npm start        # Production start
npm run pwrite   # Format with Prettier, stage, and commit
npm run pcheck   # Check formatting with Prettier
```

---

## .gitignore

```
node_modules/
.env
generated/
```
