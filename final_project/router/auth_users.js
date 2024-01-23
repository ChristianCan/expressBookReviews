const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  let usersWithSameName = users.filter((user) => {
    return user.username === username;
  });
  if (usersWithSameName.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//Task-7
//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

//Task-8
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  try {
    const bookIsbn = req.params.isbn;
    const reviewText = req.query.review;
    const username = req.session.authorization.username;

    if (!username) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const book = books[bookIsbn];

    if (book) {
      book.reviews[username] = reviewText;
      res.status(200).json({ message: "Review added/modified sucessfully" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding/modifying review" });
  }
});

//Task-9
// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  try {
    const bookIsbn = req.params.isbn;
    const reviewText = req.query.review;
    const username = req.session.authorization.username;

    if (!username) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const book = books[bookIsbn];

    if (book) {
      if (book.reviews[username]) {
        book.reviews[username] = reviewText;
        delete book.reviews[username];
        res.json({ message: "Review deleted successfully" });
      } else {
        res.status(404).json({ message: "Review not found" });
      }
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting review" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
