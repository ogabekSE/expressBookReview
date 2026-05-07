const express = require("express");
const axios = require("axios");
const books = require("../booksdb.js");

let users = require("../usersdb.js").users;

const public_users = express.Router();

const BASE_URL = "http://localhost:5000"; // Adjust as needed for your environment

// --- Helper Functions ---

async function getAllBooksViaAxios() {
  // Get all books from the public '/' endpoint using Axios, as per assignment rubric
  const response = await axios.get(`${BASE_URL}/`);
  return response.data;
}

function filterBooksBy(allBooks, filterFn) {
  // Return an array of books matching the filter function
  return Object.values(allBooks).filter(filterFn);
}

// --- ROUTES ---

// Get all books (direct, no Axios needed)
public_users.get("/", async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get book by ISBN using Axios and proper error handling
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const allBooks = await getAllBooksViaAxios();
    const isbn = req.params.isbn;
    const book = allBooks[isbn];
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get books by author using Axios and proper error handling
public_users.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const allBooks = await getAllBooksViaAxios();
    const matches = filterBooksBy(allBooks, (book) => book.author === author);
    if (matches.length > 0) {
      return res.status(200).json(matches);
    } else {
      return res
        .status(404)
        .json({ message: "No books found for this author" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get books by title using Axios and proper error handling
public_users.get("/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const allBooks = await getAllBooksViaAxios();
    const matches = filterBooksBy(allBooks, (book) => book.title === title);
    if (matches.length > 0) {
      return res.status(200).json(matches);
    } else {
      return res
        .status(404)
        .json({ message: "No books found with this title" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// --- Reviews Endpoints: get, put, and delete ---

// Get book reviews by ISBN
public_users.get("/review/:isbn", async (req, res) => {
  try {
    const allBooks = await getAllBooksViaAxios();
    const isbn = req.params.isbn;
    const book = allBooks[isbn];
    if (book) {
      // Always return message and reviews object per rubric
      return res.status(200).json({
        message: "Reviews retrieved successfully",
        reviews: book.reviews || {},
      });
    } else {
      return res.status(404).json({ message: "Book not found", reviews: {} });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", reviews: {} });
  }
});

// Add or update a review for a book (PUT /review/:isbn)
public_users.put("/review/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const { username, review } = req.body;
    if (!username || !review) {
      return res
        .status(400)
        .json({ message: "Username and review are required" });
    }

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) books[isbn].reviews = {};
    books[isbn].reviews[username] = review;
    // Per rubric, output message and current reviews object
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a review for a book (DELETE /review/:isbn)
public_users.delete("/review/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    if (
      !books[isbn] ||
      !books[isbn].reviews ||
      !books[isbn].reviews[username]
    ) {
      return res.status(404).json({ message: "Review not found" });
    }

    delete books[isbn].reviews[username];
    // Per rubric: message with ISBN
    return res.status(200).json({ message: `Review for ISBN ${isbn} deleted` });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports.general = public_users;
