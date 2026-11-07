# Books API Week 02 Spec

This document contains Version 1 of the Week 02 specification, an evaluation of Version 1, and the
improved Version 2 that was used as the implementation checklist.

---

# Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

## Feature 2: Author CRUD Operations

### Goal
Add an `authors` collection and an API that supports all CRUD operations for authors. Every author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required

Authors will use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Books
Books reference authors through `books.authorId`, which must match `authors.id`. An author who still has books cannot be deleted.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a4",
      "name": "Example Author",
      "birthYear": 1980
    }

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author.

Request body:

    {
      "name": "Updated Author",
      "birthYear": 1981
    }

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if the author still has books
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every author route.

### Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

---

# Evaluation of Version 1

**Bugs or short-sighted decisions**
- "Required" only checked that a field exists. A client could send `"title": ""`, `"birthYear": "abc"` or `"publicationDate": "soon"` and it would be stored. Types and formats need to be defined.
- The PUT request body does not say what happens if the client also sends an `id`. Changing an id through PUT would break the bookâ€“author references, so ids must not change on update.
- Error response bodies were not defined, so every route could return a different shape.
- The Week 01 book documents still contain an `author` name field. Version 1 does not say how existing data moves to `authorId`.

**Security**
- If the controller stored `req.body` directly, a client could add any extra fields to the database (mass assignment). Only the documented fields should be saved.
- Raw MongoDB errors must never be returned; 500 responses need a fixed, safe message.

**Efficiency**
- Checking whether an author has books should use a count/`findOne` on `books.authorId`, not load every book.
- Responses include MongoDB's internal `_id`, which clients do not need because routes use the custom `id`.

**Unclear behavior**
- No example JSON was given for error responses.
- It was not clear whether `birthYear` could be a future year or a decimal.

---

# Version 2 (implementation checklist)

## Shared rules (books and authors)

- Routes use the custom string `id` (`b1`, `a1`), never MongoDB `_id`.
- Responses never include `_id`; they include only the documented fields.
- Only the documented fields are read from `req.body`; any extra fields are ignored and never stored.
- On PUT, the `id` comes only from the URL. An `id` in the body is ignored, so ids cannot change.
- String fields must be strings that are not empty after trimming; values are stored trimmed.
- Every error response uses the same shape: `{ "message": "..." }`.
- Unexpected errors are logged on the server with `console.error` and return `500` with
  `{ "message": "Internal server error" }`. Raw database errors are never sent to the client.
- A request body that is not valid JSON returns `400` with `{ "message": "Request body must be valid JSON" }`.
- Duplicate ids return `400` (documented choice instead of `409`, matching the provided book spec).

## Feature 1: Books

### Data Model (`books` collection)
| Field | Type | Rules |
|---|---|---|
| `id` | string | required, non-empty, unique |
| `authorId` | string | required, must match an existing `authors.id` |
| `title` | string | required, non-empty |
| `publicationDate` | string | required, ISO 8601 date `YYYY-MM-DD` that is a real calendar date |

Data migration: the existing documents `b1`, `b2`, `b3` get `authorId` values `a1`, `a2`, `a3`, and the old
`author` name field is removed.

### Routes
| Route | Success | Errors |
|---|---|---|
| `GET /books` | `200`, array of books | `500` |
| `GET /books/:id` | `200`, one book | `404` `{"message":"Book not found"}`, `500` |
| `POST /books` | `201`, created book | `400` validation message, `400` `{"message":"A book with that id already exists"}`, `400` `{"message":"authorId does not match an existing author"}`, `500` |
| `PUT /books/:id` | `200`, updated book | `400` validation message, `400` `{"message":"authorId does not match an existing author"}`, `404` `{"message":"Book not found"}`, `500` |
| `DELETE /books/:id` | `204`, no body | `404` `{"message":"Book not found"}`, `500` |

Validation order for POST/PUT: required fields and types â†’ date format â†’ author exists â†’ (POST) duplicate id â†’ write.

Example book response:

    {
      "id": "b1",
      "authorId": "a1",
      "title": "Patterns of Light",
      "publicationDate": "2021-08-17"
    }

Example validation error:

    { "message": "id, authorId, title, and publicationDate are required" }

    { "message": "publicationDate must be a valid date in YYYY-MM-DD format" }

## Feature 2: Authors

### Data Model (`authors` collection)
| Field | Type | Rules |
|---|---|---|
| `id` | string | required, non-empty, unique |
| `name` | string | required, non-empty |
| `birthYear` | number | required, whole number between 1 and the current year |

Seed data: `a1` Maya Rivera (1978), `a2` Daniel Okafor (1985), `a3` Lindiwe Nkosi (1990).

### Routes
| Route | Success | Errors |
|---|---|---|
| `GET /authors` | `200`, array of authors | `500` |
| `GET /authors/:id` | `200`, one author | `404` `{"message":"Author not found"}`, `500` |
| `POST /authors` | `201`, created author | `400` validation message, `400` `{"message":"An author with that id already exists"}`, `500` |
| `PUT /authors/:id` | `200`, updated author | `400` validation message, `404` `{"message":"Author not found"}`, `500` |
| `DELETE /authors/:id` | `204`, no body | `404` `{"message":"Author not found"}`, `409` `{"message":"Author cannot be deleted while books reference them"}`, `500` |

POST body: `{ "id": "a4", "name": "Example Author", "birthYear": 1980 }`
PUT body: `{ "name": "Updated Author", "birthYear": 1981 }`

Example validation errors:

    { "message": "id, name, and birthYear are required" }

    { "message": "birthYear must be a whole number between 1 and the current year" }

### Delete rule
An author who is referenced by at least one book cannot be deleted. The API checks `books` for a document
with that `authorId` (single `findOne`, no full scan into memory) and returns `409 Conflict`, because the
request is valid but conflicts with the current state of the data. The client must delete or reassign
those books first.

## Swagger
- Every book and author route is documented at `/api-docs`, grouped under **Books** and **Authors** tags.
- Reusable schemas: `Book`, `BookInput`, `BookUpdate`, `Author`, `AuthorInput`, `AuthorUpdate`, `Message`.
- POST and PUT routes include a `requestBody` with an example; every documented status code has an example body.
- `swagger.json` is regenerated with `npm run swagger` and committed.

## Deployment
- All routes are tested locally and on Render at `https://cse341-books-dteq.onrender.com/api-docs`.
- No new environment variables are needed (`MONGODB_URI`, `MONGODB_DB_NAME` already exist on Render).
- `npm run lint` passes before each commit.
