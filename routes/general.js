const express = require("express");
const axios = require("axios");
const books = require("../booksdb.js");
let users = require("../usersdb.js").users;

const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Get all books (no axios needed here)
public_users.get("/", async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error." });
  }
});

// Get book by ISBN (using axios)
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    // Here, you might call another service or your own endpoint
    // For the exercise, simulate by calling '/' and filtering
    const response = await axios.get(`${BASE_URL}/`);
    const allBooks = response.data;
    const book = allBooks[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving book by ISBN" });
  }
});

// Get books by author (using axios)
public_users.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`${BASE_URL}/`);
    const allBooks = response.data;
    const results = [];
    for (let isbn in allBooks) {
      if (allBooks[isbn].author === author) {
        results.push(allBooks[isbn]);
      }
    }
    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res
        .status(404)
        .json({ message: "No books found for this author" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving books by author" });
  }
});

// Get books by title (using axios)
public_users.get("/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`${BASE_URL}/`);
    const allBooks = response.data;
    const results = [];
    for (let isbn in allBooks) {
      if (allBooks[isbn].title === title) {
        results.push(allBooks[isbn]);
      }
    }
    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res
        .status(404)
        .json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

module.exports.general = public_users;
