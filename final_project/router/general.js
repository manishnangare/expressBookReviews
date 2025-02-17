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

function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    
    try{
        const bks = await getBooks();
      res.send(JSON.stringify(bks," ",4)); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
  
});

function getByISBN(isbn) {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({status:404, message:`ISBN ${isbn} not found`});
        }
    })
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    getByISBN(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
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
