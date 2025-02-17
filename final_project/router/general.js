const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

    let un = req.body.username;
    let pw = req.body.password;

    if( un && pw)
    {
        if(isValid(un))
        {
            users.push({"username":un,"password":pw});
            res.status(200).json({message:`New user ${un} created.`});
        }
        else
        {
            res.status(400).json({message:"Username already exists."});
        }
    }
    else {
        res.status(400).json({message:"Enter all details."});
    }
  
    
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let booksArray = Object.values(books);
    
    return res.status(200).json(booksArray);
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    let booksArray = Object.values(books);
    let filterBooks = booksArray.filter( (book) => book.isbn === req.params.isbn);
    if(filterBooks.length > 0) {
        return res.status(200).json(filterBooks);
    }
    else
    {
        return res.status(400).json({message:`No book found for isbn : ${req.params.isbn}.`});
    }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  
    let booksArray = Object.values(books);
    let filterBooks = booksArray.filter( (book) => book.author === req.params.author);
    if(filterBooks.length > 0) {
        return res.status(200).json(filterBooks);
    }
    else
    {
        return res.status(400).json({message:`No book found for author : ${req.params.author}.`});
    }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
    let booksArray = Object.values(books);
    let filterBooks = booksArray.filter( (book) => book.title === req.params.title);
    if(filterBooks.length > 0) {
        return res.status(200).json(filterBooks);
    }
    else
    {
        return res.status(400).json({message:`No book found for title : ${req.params.title}.`});
    }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
    let booksArray = Object.values(books);
    let filterBooks = booksArray.filter( (book) => book.isbn === req.params.isbn);
    if(filterBooks.length > 0) {
        return res.status(200).json(JSON.stringify(filterBooks.reviews));
    }
    else
    {
        return res.status(400).json({message:`No book found for isbn : ${req.params.isbn}.`});
    }

});

module.exports.general = public_users;
