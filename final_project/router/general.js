const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

//Task-6
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res
    .status(404)
    .json({ message: "Username &/ password are not provided." });
});

//Task-1
// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

//Task-2
// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const bookIsbn = req.params.isbn;
  res.send(books[bookIsbn]);
});

//Task-3
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const bookAuthor = req.params.author;
  const bookValues = Object.values(books);
  const book = bookValues.find((book) => book.author === bookAuthor);

  if (book) {
    res.send(book);
  } else {
    return res
      .status(404)
      .json({ message: "A book from that author was not found" });
  }
});

//Task-4
// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const bookTitle = req.params.title;
  const bookValues = Object.values(books);
  const book = bookValues.find((book) => book.title === bookTitle);

  if (book) {
    res.send(book);
  } else {
    return res
      .status(404)
      .json({ message: "A book with that title was not found" });
  }
});

//Task-5
//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const bookIsbn = req.params.isbn;
  res.send(books[bookIsbn]["reviews"]);
});

//Task-10-13 common function
async function getBooksAsync(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Task-10 Using async-await with Axios - getting the list of books
public_users.get("/async-await", async function (req, res) {
  try {
    const books = await getBooksAsync("http://localhost:5000/");
    res.send(JSON.stringify(books, null, 4));
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching books");
  }
});

// Task-11 Using async-await with Axios - getting the book details based on ISBN
public_users.get("/async-await/isbn/:isbn", async function (req, res) {
  try {
    const bookIsbn = req.params.isbn;
    const book = await getBooksAsync(`http://localhost:5000/isbn/${bookIsbn}`);
    res.send(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

// Task-12 Using async-await with Axios -  getting the book details based on Author
public_users.get("/async-await/author/:author", async function (req, res) {
  try {
    const bookAuthor = req.params.author;
    const book = await getBooksAsync(
      `http://localhost:5000/author/${bookAuthor}`
    );
    res.send(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

// Task-13 Using async-await with Axios -  getting the book details based on Title
public_users.get("/async-await/title/:title", async function (req, res) {
  try {
    const bookTitle = req.params.title;
    const book = await getBooksAsync(
      `http://localhost:5000/title/${bookTitle}`
    );
    res.send(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

module.exports.general = public_users;
