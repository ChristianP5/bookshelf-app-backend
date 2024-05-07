const {
  addBookHandler, getAllBooksHandler, getBookByIdHandler,
  editBookHandler, deleteBookHandler,
} = require('./handler');

const routes = [
  {
    path: '/books',
    method: 'POST',
    handler: addBookHandler,
  },
  {
    path: '/books',
    method: 'GET',
    handler: getAllBooksHandler,
  },
  {
    path: '/books/{id}',
    method: 'GET',
    handler: getBookByIdHandler,
  },
  {
    path: '/books/{id}',
    method: 'PUT',
    handler: editBookHandler,
  },
  {
    path: '/books/{id}',
    method: 'DELETE',
    handler: deleteBookHandler,
  },
];

module.exports = routes;
