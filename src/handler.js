const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  // Inputan User
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Input dari sistem
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  // Respon jika user tidak input nama
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Jika readPage lebih besar daripada pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Masukkan variable ke dalam objek
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

  // Masukkan objek ke dalam array
  books.push(newBook);

  // Buar variable boolean jika sukses
  const isSucces = books.filter((book) => book.id === id).length > 0;

  // Respon jika sukses
  if (isSucces) {
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

  // Default nya respon akan menampilkan error
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBookHandler = (request, h) => {
  // Ambil query parameters
  const { name, reading, finished } = request.query;

  // Respon jika ada query name
  if (name) {
    const arr = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    const response = h.response({
      status: 'success',
      data: {
        books: arr.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher })),
      },
    });
    return response;
  }

  // Respon jika ada query reading
  if (reading) {
    const arr = books.filter((book) => (book.reading ? '1' : '0') === reading);
    const response = h.response({
      status: 'success',
      data: {
        books: arr.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher })),
      },
    });
    return response;
  }

  // Respon jika ada query finished
  if (finished) {
    const arr = books.filter((book) => (book.finished ? '1' : '0') === finished);
    const response = h.response({
      status: 'success',
      data: {
        books: arr.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher })),
      },
    });
    return response;
  }

  // Respon jika tidak ada query parameters
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher })),
    },
  });
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  // Ambil id dari request
  const { id } = request.params;

  // Inputan User
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Input nilai update
  const updatedAt = new Date().toISOString();

  // Respon jika user tidak input nama
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // Jika readPage lebih besar daripada pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  // Dapatkan index dari array books yang memiliki id yang dicari
  const index = books.findIndex((book) => book.id === id);

  // Respon jika index ditemukan
  if (index !== -1) {
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
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // Respon jika index tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  // Ambil id dari request
  const { id } = request.params;

  // Dapatkan index dari array books yang memiliki id yang dicari
  const index = books.findIndex((book) => book.id === id);

  // Respon jika id ditemukan
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // Respon jika id tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
