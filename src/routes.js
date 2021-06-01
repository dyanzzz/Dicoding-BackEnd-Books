// routes.js : Memuat kode konfigurasi routing server seperti menentukan path, method, dan handler yang digunakan.

const { addBooksHandler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBooksHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: () => {},
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: () => {},
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: () => {},
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: () => {},
  },
];

module.exports = routes;
