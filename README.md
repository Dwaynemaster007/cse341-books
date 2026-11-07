# cse341-books

A read-only Books web service built with Express and MongoDB for CSE 341.

Deployed URL: https://cse341-books-dteq.onrender.com

## Endpoints

Interactive documentation: https://cse341-books-dteq.onrender.com/api-docs

| Method | Route | Success | Errors |
|---|---|---|---|
| GET | `/` | 200 `{ "message": "Server is running" }` | |
| GET | `/books` | 200, array of books | 500 |
| GET | `/books/:id` | 200, one book | 404, 500 |
| POST | `/books` | 201, created book | 400 (invalid fields, duplicate id, unknown `authorId`), 500 |
| PUT | `/books/:id` | 200, updated book | 400, 404, 500 |
| DELETE | `/books/:id` | 204 | 404, 500 |
| GET | `/authors` | 200, array of authors | 500 |
| GET | `/authors/:id` | 200, one author | 404, 500 |
| POST | `/authors` | 201, created author | 400 (invalid fields, duplicate id), 500 |
| PUT | `/authors/:id` | 200, updated author | 400, 404, 500 |
| DELETE | `/authors/:id` | 204 | 404, 409 (author still has books), 500 |

All errors use the shape `{ "message": "..." }`. See `spec-week02.md` for full details.

Book shape (`authorId` references `authors.id`):

```json
{
  "id": "b1",
  "authorId": "a1",
  "title": "Patterns of Light",
  "publicationDate": "2021-08-17"
}
```

Author shape:

```json
{
  "id": "a1",
  "name": "Maya Rivera",
  "birthYear": 1978
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

- `npm run dev` Ã¢â‚¬â€œ start with nodemon and `.env`
- `npm start` Ã¢â‚¬â€œ start with node and `.env`
- `npm run lint` / `npm run lint:fix` Ã¢â‚¬â€œ check / fix coding standards
