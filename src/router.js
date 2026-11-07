import express from 'express';
import { getBooksHandler, getBookByIdHandler } from './controllers/books.js';
import {
  getAuthorsHandler,
  getAuthorByIdHandler,
  createAuthorHandler,
  updateAuthorHandler,
  deleteAuthorHandler
} from './controllers/authors.js';

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: 6ae5a14a8cf9ca5942af17ec
 *         id:
 *           type: string
 *           description: Custom book id
 *           example: b1
 *         author:
 *           type: string
 *           example: Maya Rivera
 *         title:
 *           type: string
 *           example: Patterns of Light
 *         publicationDate:
 *           type: string
 *           format: date
 *           description: ISO 8601 date (YYYY-MM-DD)
 *           example: '2021-08-17'
 *     Author:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Custom author id
 *           example: a1
 *         name:
 *           type: string
 *           example: Maya Rivera
 *         birthYear:
 *           type: integer
 *           example: 1978
 *     AuthorInput:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - birthYear
 *       properties:
 *         id:
 *           type: string
 *           description: Custom author id (must be unique)
 *         name:
 *           type: string
 *         birthYear:
 *           type: integer
 *           description: Whole number between 1 and the current year
 *       example:
 *         id: a4
 *         name: Example Author
 *         birthYear: 1980
 *     AuthorUpdate:
 *       type: object
 *       required:
 *         - name
 *         - birthYear
 *       properties:
 *         name:
 *           type: string
 *         birthYear:
 *           type: integer
 *           description: Whole number between 1 and the current year
 *       example:
 *         name: Updated Author
 *         birthYear: 1981
 *     Message:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *   responses:
 *     ServerError:
 *       description: Unexpected server or database error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Message'
 *           example:
 *             message: Internal server error
 */

/**
 * @openapi
 * /books:
 *   get:
 *     summary: Get all books
 *     tags:
 *       - Books
 *     responses:
 *       200:
 *         description: Books returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Unable to retrieve books
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *             example:
 *               message: Internal server error
 */
router.get('/books', getBooksHandler);

/**
 * @openapi
 * /books/{id}:
 *   get:
 *     summary: Get one book by id
 *     tags:
 *       - Books
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The custom book id, such as b1
 *         schema:
 *           type: string
 *           example: b1
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *             example:
 *               message: Book not found
 *       500:
 *         description: Unable to retrieve book
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *             example:
 *               message: Internal server error
 */
router.get('/books/:id', getBookByIdHandler);

/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: Authors returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Author'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   post:
 *     summary: Create an author
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorInput'
 *     responses:
 *       201:
 *         description: Author created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Missing or invalid fields, or the id already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *             examples:
 *               missingFields:
 *                 value:
 *                   message: id, name, and birthYear are required
 *               invalidBirthYear:
 *                 value:
 *                   message: birthYear must be a whole number between 1 and the current year
 *               duplicateId:
 *                 value:
 *                   message: An author with that id already exists
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/authors', getAuthorsHandler);
router.post('/authors', createAuthorHandler);

/**
 * @openapi
 * /authors/{id}:
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       description: The custom author id, such as a1
 *       schema:
 *         type: string
 *         example: a1
 *   get:
 *     summary: Get one author by id
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: Author returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *             example:
 *               message: Author not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   put:
 *     summary: Update an author
 *     description: The id in the URL identifies the author. An id in the body is ignored, so ids cannot change.
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthorUpdate'
 *     responses:
 *       200:
 *         description: Author updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Author'
 *       400:
 *         description: Missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *             example:
 *               message: name and birthYear are required
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *             example:
 *               message: Author not found
 *       500:
 *         $ref: '#/components/responses/ServerError'
 *   delete:
 *     summary: Delete an author
 *     description: An author who still has books cannot be deleted (409). Delete or reassign their books first.
 *     tags:
 *       - Authors
 *     responses:
 *       204:
 *         description: Author deleted successfully (no response body)
 *       404:
 *         description: Author not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *             example:
 *               message: Author not found
 *       409:
 *         description: Author still has books
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *             example:
 *               message: Author cannot be deleted while books reference them
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.get('/authors/:id', getAuthorByIdHandler);
router.put('/authors/:id', updateAuthorHandler);
router.delete('/authors/:id', deleteAuthorHandler);

export default router;
