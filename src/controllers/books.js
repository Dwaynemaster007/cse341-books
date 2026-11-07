import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  authorExists
} from '../models/books.js';
import { isNonEmptyString, isValidIsoDate } from '../utils/validation.js';

const DUPLICATE_KEY_ERROR = 11000;
const DATE_MESSAGE = 'publicationDate must be a valid date in YYYY-MM-DD format';
const AUTHOR_MESSAGE = 'authorId does not match an existing author';
const DUPLICATE_MESSAGE = 'A book with that id already exists';

const sendServerError = (res, routeLabel, error) => {
  console.error(`${routeLabel} failed:`, error.message);
  return res.status(500).json({ message: 'Internal server error' });
};

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    return sendServerError(res, 'GET /books', error);
  }
};

const getBookByIdHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const book = await getBookById(requestedId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return sendServerError(res, 'GET /books/:id', error);
  }
};

const createBookHandler = async (req, res) => {
  const { id, authorId, title, publicationDate } = req.body ?? {};
  const requiredValues = [id, authorId, title, publicationDate];

  if (!requiredValues.every(isNonEmptyString)) {
    return res.status(400).json({ message: 'id, authorId, title, and publicationDate are required' });
  }

  if (!isValidIsoDate(publicationDate)) {
    return res.status(400).json({ message: DATE_MESSAGE });
  }

  const newBook = {
    id: id.trim(),
    authorId: authorId.trim(),
    title: title.trim(),
    publicationDate
  };

  try {
    if (!(await authorExists(newBook.authorId))) {
      return res.status(400).json({ message: AUTHOR_MESSAGE });
    }

    const existingBook = await getBookById(newBook.id);

    if (existingBook) {
      return res.status(400).json({ message: DUPLICATE_MESSAGE });
    }

    const book = await createBook(newBook);
    return res.status(201).json(book);
  } catch (error) {
    if (error.code === DUPLICATE_KEY_ERROR) {
      return res.status(400).json({ message: DUPLICATE_MESSAGE });
    }
    return sendServerError(res, 'POST /books', error);
  }
};

const updateBookHandler = async (req, res) => {
  const requestedId = req.params.id;
  const { authorId, title, publicationDate } = req.body ?? {};
  const requiredValues = [authorId, title, publicationDate];

  if (!requiredValues.every(isNonEmptyString)) {
    return res.status(400).json({ message: 'authorId, title, and publicationDate are required' });
  }

  if (!isValidIsoDate(publicationDate)) {
    return res.status(400).json({ message: DATE_MESSAGE });
  }

  const changes = {
    authorId: authorId.trim(),
    title: title.trim(),
    publicationDate
  };

  try {
    if (!(await authorExists(changes.authorId))) {
      return res.status(400).json({ message: AUTHOR_MESSAGE });
    }

    const book = await updateBook(requestedId, changes);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(200).json(book);
  } catch (error) {
    return sendServerError(res, 'PUT /books/:id', error);
  }
};

const deleteBookHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const deleted = await deleteBook(requestedId);

    if (!deleted) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return sendServerError(res, 'DELETE /books/:id', error);
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler
};
