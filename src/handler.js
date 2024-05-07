const { nanoid } = require('nanoid');

const books = require('./books');
/*
{
    "id": "Qbax5Oy7L8WKf74l",
    "name": "Buku A",
    "year": 2010,
    "author": "John Doe",
    "summary": "Lorem ipsum dolor sit amet",
    "publisher": "Dicoding Indonesia",
    "pageCount": 100,
    "readPage": 25,
    "finished": false,
    "reading": false,
    "insertedAt": "2021-03-04T09:11:44.598Z",
    "updatedAt": "2021-03-04T09:11:44.598Z"
}
*/

const addBookHandler = (request, h) => {
  /*
    Request Body:
    {
        "name": string,
        "year": number,
        "author": string,
        "summary": string,
        "publisher": string,
        "pageCount": number,
        "readPage": number,
        "reading": boolean
    }
    */

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

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

  if (!name) {
    // if no Name
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);

    return response;
  } if (readPage > pageCount) {
    // if Read Page > Page Count
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);

    return response;
  }

  books.push(newBook);

  const isAdded = books.filter((book) => book.id === id).length > 0;

  if (isAdded) {
    // No Issues
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);

    return response;
  }
  // Inserting Issue
  const response = h.response({
    status: 'fail',
    message: 'Ada masalah saat menambahkan buku. Coba lagi',
  });
  response.code(500);

  return response;
};

const getAllBooksHandler = (request, h) => {
  let { name: queriedName } = request.query;
  const { reading, finished } = request.query;

  let filteredBooks = [...books];
  if (queriedName) {
    // name Query Exis[s
    if (queriedName.includes('"')) {
      [, queriedName] = queriedName;
    }

    // Display books that includes name query
    filteredBooks = filteredBooks.filter((book) => {
      const loweredBookName = book.name.toLowerCase();
      return loweredBookName.includes(queriedName.toLowerCase());
    });
  }

  if (reading) {
    // reading Query Exists
    if (reading === '0') {
      // Display Not Reading Books
      filteredBooks = filteredBooks.filter((book) => book.reading === false);
    } else if (reading === '1') {
      // Display Reading Books
      filteredBooks = filteredBooks.filter((book) => book.reading === true);
    }
  }

  if (finished) {
    // finished Query Exists
    if (finished === '0') {
      // Display Not finished Books
      filteredBooks = filteredBooks.filter((book) => book.finished === false);
    } else if (finished === '1') {
      // Display finished Books
      filteredBooks = filteredBooks.filter((book) => book.finished === true);
    }
  }

  filteredBooks.forEach((book, index) => {
    const { id, name, publisher } = book;
    filteredBooks[index] = { id, name, publisher };
  });

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks,
    },
  });

  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((item) => item.id === id)[0];

  if (book === undefined) {
    // If book doesn't exist
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });

    response.code(404);
    return response;
  }

  // If book exist
  const response = h.response({
    status: 'success',
    data: {
      book,
    },
  });

  response.code(200);
  return response;
};

const editBookHandler = (request, h) => {
  /*
        Request Body:
        {
            "name": string,
            "year": number,
            "author": string,
            "summary": string,
            "publisher": string,
            "pageCount": number,
            "readPage": number,
            "reading": boolean
        }
    */

  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const finished = pageCount === readPage;

  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    // If book doesn't exist
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',

    });

    response.code(404);
    return response;
  }

  // If Book Exists

  if (!name) {
    // If No Name
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',

    });

    response.code(400);
    return response;
  } if (readPage > pageCount) {
    // If ReadPage > Page Count
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',

    });

    response.code(400);
    return response;
  }

  // If No Issue
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
    updatedAt,
    finished,
  };

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',

  });

  response.code(200);
  return response;
};

const deleteBookHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index === -1) {
    // Book Doesn't Exist

    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });

    response.code(404);
    return response;
  }

  // Book Exists
  books.splice(index, 1);
  const response = h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });

  response.code(200);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookHandler,
  deleteBookHandler,
};
