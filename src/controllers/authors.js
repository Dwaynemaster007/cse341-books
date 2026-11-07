import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks
} from '../models/authors.js';
import { isNonEmptyString, isValidBirthYear } from '../utils/validation.js';

const DUPLICATE_KEY_ERROR = 11000;
const BIRTH_YEAR_MESSAGE = 'birthYear must be a whole number between 1 and the current year';
const DUPLICATE_MESSAGE = 'An author with that id already exists';

const isMissing = (value) => {
  return value === undefined || value === null;
};

const sendServerError = (res, routeLabel, error) => {
  console.error(`${routeLabel} failed:`, error.message);
  return res.status(500).json({ message: 'Internal server error' });
};

const getAuthorsHandler = async (req, res) => {
  try {
    const authors = await getAllAuthors();
    return res.status(200).json(authors);
  } catch (error) {
    return sendServerError(res, 'GET /authors', error);
  }
};

const getAuthorByIdHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const author = await getAuthorById(requestedId);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(author);
  } catch (error) {
    return sendServerError(res, 'GET /authors/:id', error);
  }
};

const createAuthorHandler = async (req, res) => {
  const { id, name, birthYear } = req.body ?? {};

  if (!isNonEmptyString(id) || !isNonEmptyString(name) || isMissing(birthYear)) {
    return res.status(400).json({ message: 'id, name, and birthYear are required' });
  }

  if (!isValidBirthYear(birthYear)) {
    return res.status(400).json({ message: BIRTH_YEAR_MESSAGE });
  }

  const newAuthor = { id: id.trim(), name: name.trim(), birthYear };

  try {
    const existingAuthor = await getAuthorById(newAuthor.id);

    if (existingAuthor) {
      return res.status(400).json({ message: DUPLICATE_MESSAGE });
    }

    const author = await createAuthor(newAuthor);
    return res.status(201).json(author);
  } catch (error) {
    if (error.code === DUPLICATE_KEY_ERROR) {
      return res.status(400).json({ message: DUPLICATE_MESSAGE });
    }
    return sendServerError(res, 'POST /authors', error);
  }
};

const updateAuthorHandler = async (req, res) => {
  const requestedId = req.params.id;
  const { name, birthYear } = req.body ?? {};

  if (!isNonEmptyString(name) || isMissing(birthYear)) {
    return res.status(400).json({ message: 'name and birthYear are required' });
  }

  if (!isValidBirthYear(birthYear)) {
    return res.status(400).json({ message: BIRTH_YEAR_MESSAGE });
  }

  try {
    const author = await updateAuthor(requestedId, { name: name.trim(), birthYear });

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    return res.status(200).json(author);
  } catch (error) {
    return sendServerError(res, 'PUT /authors/:id', error);
  }
};

const deleteAuthorHandler = async (req, res) => {
  const requestedId = req.params.id;

  try {
    const author = await getAuthorById(requestedId);

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    if (await authorHasBooks(requestedId)) {
      return res.status(409).json({ message: 'Author cannot be deleted while books reference them' });
    }

    await deleteAuthor(requestedId);
    return res.status(204).send();
  } catch (error) {
    return sendServerError(res, 'DELETE /authors/:id', error);
  }
};

export {
  getAuthorsHandler,
  getAuthorByIdHandler,
  createAuthorHandler,
  updateAuthorHandler,
  deleteAuthorHandler
};
