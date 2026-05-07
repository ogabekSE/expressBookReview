const express = require("express");
const books = require("../booksdb.js");
let users = require("../usersdb.js").users;

const public_users = express.Router();

// Get all books
public_users.get("/", async (req, res) => {
  return res.status(200).json(books);
});

// Get book by ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return book
    ? res.status(200).json(book)
    : res.status(404).json({ message: "Book not found" });
});

// Get books by author
public_users.get("/author/:author", async (req, res) => {
  const author = req.params.author;
  const results = [];
  for (let isbn in books) {
    if (books[isbn].author === author) results.push(books[isbn]);
  }
  return results.length
    ? res.status(200).json(results)
    : res.status(404).json({ message: "No books found by this author" });
});

// Get books by title
public_users.get("/title/:title", async (req, res) => {
  const title = req.params.title;
  const results = [];
  for (let isbn in books) {
    if (books[isbn].title === title) results.push(books[isbn]);
  }
  return results.length
    ? res.status(200).json(results)
    : res.status(404).json({ message: "No books found with this title" });
});

// Get book reviews
public_users.get("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  return book
    ? res.status(200).json(book.reviews)
    : res.status(404).json({ message: "Book not found" });
});

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });
  if (users.find((u) => u.username === username))
    return res.status(409).json({ message: "User already exists" });

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

module.exports.general = public_users;
