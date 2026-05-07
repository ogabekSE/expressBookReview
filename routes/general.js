const express = require("express");
const axios = require("axios");
const books = require("../booksdb.js");
let users = require("../usersdb.js").users;

const public_users = express.Router();
const BASE_URL = "http://localhost:5000"; // Adjust as needed

// --- Helper Functions ---
async function fetchAllBooks() {
  const response = await axios.get(`${BASE_URL}/`);
  return response.data;
}

function findBooksByPredicate(allBooks, predicate) {
  return Object.values(allBooks).filter(predicate);
}

// --- Route Handlers ---

// Get all books
public_users.get("/", async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch {
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Get books by ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const allBooks = await fetchAllBooks();
    const isbn = req.params.isbn;
    const book = allBooks[isbn];
    return book
      ? res.status(200).json(book)
      : res.status(404).json({ message: "Book not found" });
  } catch {
    return res.status(500).json({ message: "Error retrieving book by ISBN" });
  }
});

// Get books by Author
public_users.get("/author/:author", async (req, res) => {
  try {
    const allBooks = await fetchAllBooks();
    const author = req.params.author;
    const results = findBooksByPredicate(
      allBooks,
      (book) => book.author === author,
    );
    return results.length
      ? res.status(200).json(results)
      : res.status(404).json({ message: "No books found for this author" });
  } catch {
    return res
      .status(500)
      .json({ message: "Error retrieving books by author" });
  }
});

// Get books by Title
public_users.get("/title/:title", async (req, res) => {
  try {
    const allBooks = await fetchAllBooks();
    const title = req.params.title;
    const results = findBooksByPredicate(
      allBooks,
      (book) => book.title === title,
    );
    return results.length
      ? res.status(200).json(results)
      : res.status(404).json({ message: "No books found with this title" });
  } catch {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

module.exports.general = public_users;
