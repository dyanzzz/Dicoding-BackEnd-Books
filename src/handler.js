// handler.js : Memuat seluruh fungsi-fungsi handler yang digunakan pada berkas routes.

const { nanoid } = require('nanoid');
const books = require('./books');

const addBooksHandler = (req, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage = 0, reading = false } = req.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = (pageCount === readPage);

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
  let data;
  let codeResponse = '';

  if (name) {
    if (readPage <= pageCount) {
      books.push(newBook);

      const isSuccess = books.filter((book) => book.id === id).length > 0;

      if (isSuccess) {
        status = 'success';
        message = 'Buku berhasil ditambahkan';
        data = {
          bookId: id,
        };
        codeResponse = 201;
      } else {
        status = 'error';
        message = 'Buku gagal ditambahkan';
        codeResponse = 500;
      }
    } else {
      status = 'fail';
      message = 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';
      codeResponse = 400;
    }
  } else {
    status = 'fail';
    message = 'Gagal menambahkan buku. Mohon isi nama buku';
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

const getAllBooksHandler = (req, h) => {
  const { reading, finished, name } = req.query;

  let data = books;

  if (reading !== undefined) {
    if (reading === '1') {
      data = data.filter((item) => item.reading === (reading === '1'));
    } else if (reading === '0') {
      data = data.filter((item) => !item.reading === (reading !== '1'));
    }
  }

  if (finished !== undefined) {
    if (finished === '1') {
      data = data.filter((item) => item.finished === (finished === '1'));
    } else if (finished === '0') {
      data = data.filter((item) => !item.finished === (finished !== '1'));
    }
  }

  if (name !== undefined) {
    data = data.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: data.map((book) => {
        return {
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        };
      }),
    },
  });

  response.code(200);
  return response;
};

const getBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const book = books.filter((item) => item.id === id)[0];

  let status = '';
  let message = '';
  let data;
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

const updateBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.payload;

  const updatedAt = new Date().toISOString();
  const index = books.findIndex((book) => book.id === id);
  const finished = (pageCount === readPage);

  let status = '';
  let message = '';
  let codeResponse = '';

  if (index !== -1) {
    if (name) {
      if (readPage <= pageCount) {
        books[index] = {
          ...books[index],
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          reading,
          finished,
          updatedAt,
        };

        status = 'success';
        message = 'Buku berhasil diperbarui';
        codeResponse = 200;
      } else {
        status = 'fail';
        message = 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount';
        codeResponse = 400;
      }
    } else {
      status = 'fail';
      message = 'Gagal memperbarui buku. Mohon isi nama buku';
      codeResponse = 400;
    }
  } else {
    status = 'fail';
    message = 'Gagal memperbarui buku. Id tidak ditemukan';
    codeResponse = 404;
  }

  const response = h.response({
    status: status.toString(),
    message: message.toString(),
  });

  response.code(codeResponse);
  return response;
};

const deleteBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const index = books.findIndex((book) => book.id === id);

  let status = '';
  let message = '';
  let codeResponse = '';

  if (index !== -1) {
    books.splice(index, 1);

    status = 'success';
    message = 'Buku berhasil dihapus';
    codeResponse = 200;
  } else {
    status = 'fail';
    message = 'Buku gagal dihapus. Id tidak ditemukan';
    codeResponse = 404;
  }

  const response = h.response({
    status: status.toString(),
    message: message.toString(),
  });

  response.code(codeResponse);
  return response;
};

module.exports = {
  addBooksHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
