# Book Store API

Express + TypeScript + MongoDB backend for a role-based book catalog and personal reading lists.

## Features

- **Auth:** register / login with JWT (`admin` | `user`)
- **Catalog:** list and view books (authenticated); create / update / delete (admin only)
- **Library:** users add catalog books to a personal list and set status (`want_to_read` | `reading` | `completed`)

## Stack

- Node.js, Express, TypeScript
- MongoDB Atlas via Mongoose
- `bcryptjs` + `jsonwebtoken`

## Setup

```bash
npm install
```

Create a `.env` in the project root:

```env
NODE_APP_PORT=5000
NODE_DB_USERNAME=your_atlas_user
NODE_DB_PASSWORD=your_atlas_password
NODE_DB_NAME=your_db_name
NODE_ALLOWED_ORIGIN=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me
ADMIN_NAME=Admin
```

Seed the first admin (safe to re-run; upgrades existing email to admin if needed):

```bash
npm run seed:admin
```

Run in development:

```bash
npm run dev
```

Build and run production:

```bash
npm run build
npm start
```

## Roles

| Role  | Capabilities                                      |
| ----- | ------------------------------------------------- |
| admin | Full catalog CRUD; can also use personal library  |
| user  | Browse catalog; manage personal library only      |

Public registration always creates a `user`. Admins are created via `seed:admin`.

## API (`/api/v1`)

| Method | Path                 | Access       | Description                          |
| ------ | -------------------- | ------------ | ------------------------------------ |
| POST   | `/auth/register`     | public       | Register user                        |
| POST   | `/auth/login`        | public       | Login; returns JWT + user            |
| GET    | `/auth/me`           | auth         | Current user                         |
| GET    | `/books`             | auth         | List catalog                         |
| GET    | `/books/:bookId`     | auth         | Book detail                          |
| POST   | `/books`             | admin        | Create book                          |
| PUT    | `/books/:bookId`     | admin        | Update book                          |
| DELETE | `/books/:bookId`     | admin        | Delete book (+ cascade library rows) |
| GET    | `/library`           | auth         | My library (`?status=` optional)     |
| POST   | `/library`           | auth         | Add book `{ bookId, status? }`       |
| PATCH  | `/library/:id`       | auth (owner) | Update status                        |
| DELETE | `/library/:id`       | auth (owner) | Remove from library                  |

Send `Authorization: Bearer <token>` on authenticated routes.

Responses use `{ data: { msg, info? } }` or `{ data: { err, errMessage } }`.

## Project layout

```
src/
  index.ts
  models/          # Book, User, UserBook
  routes/          # auth, books, library
  middlewares/     # auth, book validation, errors
  scripts/         # seed-admin
  utils/
```
