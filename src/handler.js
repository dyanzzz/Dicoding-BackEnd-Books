// handler.js : Memuat seluruh fungsi-fungsi handler yang digunakan pada berkas routes.

const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (req, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage = 0, reading = false } = req.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = false;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  let status = '';
  let message = '';
  let data = '';
  let codeResponse = '';

  if (name) {
    if (readPage < pageCount) {
      books.push(newBook);

      const isSuccess = books.filter((book) => book.id === id).length > 0;

      if (isSuccess) {
        status = 'success';
        message = 'Buku berhasil ditambahkan';
        data = {
          bookId: newBook,
        };
        codeResponse = 201;
      } else {
        status = 'error';
        message = 'Buku gagal ditambahkan';
        data = {};
        codeResponse = 500;
      }
    } else {
      status = 'fail';
      message = 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';
      data = {};
      codeResponse = 400;
    }
  } else {
    status = 'fail';
    message = 'Gagal menambahkan buku. Mohon isi nama buku';
    data = {};
    codeResponse = 400;
  }

  const response = h.response({
    status: status.toString(),
    message: message.toString(),
    data,
  });

  response.code(codeResponse);
  return response;
};

const getAllBooksHandler = () => ({
  status: 'success',
  data: {
    books,
  },
});

const getBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const book = books.filter((item) => item.id === id)[0];

  let status = '';
  let message = '';
  let data = '';
  let codeResponse = '';

  if (book !== undefined) {
    status = 'success';
    message = 'Buku ditemukan';
    data = {
      book,
    };
    codeResponse = 200;
  } else {
    status = 'fail';
    message = 'Buku tidak ditemukan';
    data = {};
    codeResponse = 404;
  }

  const response = h.response({
    status: status.toString(),
    message: message.toString(),
    data,
  });

  response.code(codeResponse);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
};
