# cse341-books

A read-only Books web service built with Express and MongoDB for CSE 341.

Deployed URL: https://cse341-books-dteq.onrender.com

## Endpoints

| Method | Route | Success | Errors |
|---|---|---|---|
| GET | `/` | 200 `{ "message": "Server is running" }` | |
| GET | `/books` | 200, array of books | 500 `{ "message": "Internal server error" }` |
| GET | `/books/:id` | 200, one book | 404 `{ "message": "Book not found" }`, 500 `{ "message": "Internal server error" }` |

Book shape:

```json
{
  "id": "b1",
  "author": "Maya Rivera",
  "title": "Patterns of Light",
  "publicationDate": "2021-08-17"
}
```

## Configuration

Settings come from environment variables, never from committed files.

| Variable | Purpose |
|---|---|
| `PORT` | Port to listen on (Render provides this automatically) |
| `MONGODB_URI` | MongoDB Atlas connection string (secret) |
| `MONGODB_DB_NAME` | Database name, `cse341-books-db` |

Locally, copy `.env.example` to `.env` and fill in real values. `.env` is listed in `.gitignore`.
On Render, the same variables are set under **Environment**.

## Scripts

- `npm run dev` â€“ start with nodemon and `.env`
- `npm start` â€“ start with node and `.env`
- `npm run lint` / `npm run lint:fix` â€“ check / fix coding standards
