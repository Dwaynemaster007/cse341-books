import { getDb } from '../db/connect.js';

const toBook = (document) => {
  return {
    id: document.id,
    authorId: document.authorId,
    title: document.title,
    publicationDate: document.publicationDate
  };
};

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection.find({}).toArray();
  return books.map(toBook);
};

const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id: bookId });
  return book ? toBook(book) : null;
};

const createBook = async (book) => {
  const db = getDb();
  const collection = db.collection('books');
  await collection.insertOne({ ...book });
  return toBook(book);
};

const updateBook = async (bookId, changes) => {
  const db = getDb();
  const collection = db.collection('books');
  const updatedBook = await collection.findOneAndUpdate(
    { id: bookId },
    { $set: changes },
    { returnDocument: 'after' }
  );
  return updatedBook ? toBook(updatedBook) : null;
};

const deleteBook = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const result = await collection.deleteOne({ id: bookId });
  return result.deletedCount === 1;
};

const authorExists = async (authorId) => {
  const db = getDb();
  const collection = db.collection('authors');
  const author = await collection.findOne({ id: authorId }, { projection: { _id: 1 } });
  return author !== null;
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  authorExists
};
