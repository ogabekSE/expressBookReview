const express = require("express"),
  books = require("../booksdb.js"),
  users = require("../usersdb.js").users;

const authenticated = express.Router();

// Log in (dummy, just checks match in users array)
authenticated.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password,
  );
  return user
    ? res.status(200).json({ message: "User successfully logged in." })
    : res.status(401).json({ message: "Invalid credentials." });
});

// Add/Update a book review
authenticated.put("/review/:isbn", (req, res) => {
  const { username, review } = req.body;
  const { isbn } = req.params;
  if (!username || !review)
    return res.status(400).json({ message: "Username and review required." });
  if (!books[isbn]) return res.status(404).json({ message: "Book not found." });

  if (!books[isbn].reviews) books[isbn].reviews = {};
  books[isbn].reviews[username] = { review };
  return res.json({ message: "Review successfully added!" });
});

// Delete a book review
authenticated.delete("/review/:isbn", (req, res) => {
  const { username } = req.body;
  const { isbn } = req.params;
  if (!books[isbn] || !books[isbn].reviews[username])
    return res.status(404).json({ message: "Review not found." });

  delete books[isbn].reviews[username];
  return res.json({ message: "Review successfully deleted!" });
});

module.exports.authenticated = authenticated;
