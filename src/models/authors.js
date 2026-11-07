import { getDb } from '../db/connect.js';

const toAuthor = (document) => {
  return {
    id: document.id,
    name: document.name,
    birthYear: document.birthYear
  };
};

const getAllAuthors = async () => {
  const db = getDb();
  const collection = db.collection('authors');
  const authors = await collection.find({}).toArray();
  return authors.map(toAuthor);
};

const getAuthorById = async (authorId) => {
  const db = getDb();
  const collection = db.collection('authors');
  const author = await collection.findOne({ id: authorId });
  return author ? toAuthor(author) : null;
};

const createAuthor = async (author) => {
  const db = getDb();
  const collection = db.collection('authors');
  await collection.insertOne({ ...author });
  return toAuthor(author);
};

const updateAuthor = async (authorId, changes) => {
  const db = getDb();
  const collection = db.collection('authors');
  const updatedAuthor = await collection.findOneAndUpdate(
    { id: authorId },
    { $set: changes },
    { returnDocument: 'after' }
  );
  return updatedAuthor ? toAuthor(updatedAuthor) : null;
};

const deleteAuthor = async (authorId) => {
  const db = getDb();
  const collection = db.collection('authors');
  const result = await collection.deleteOne({ id: authorId });
  return result.deletedCount === 1;
};

const authorHasBooks = async (authorId) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ authorId }, { projection: { _id: 1 } });
  return book !== null;
};

export {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorHasBooks
};
