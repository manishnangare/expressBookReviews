const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let filterUser = users.filter( (user) => user.username = username);
    
    return !(filterUser > 0);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    let filterUser = users.filter( user => user.username === username && user.password === password);

    return !(filterUser > 0);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  
    const un = req.body.username;
    const pw = req.body.password;

    if( un && pw)
    {
        if( authenticatedUser(un,pw))
        {
            let accessToken = jwt.sign({data:pw},"access",{expiresIn:60*60});
            req.session.authorization = {accessToken,un};
            return res.status(200).send("User successfully logged in.");
        }
        else
        {
            return res.status(208).json({message:"Invalid username or password"});
        }
    }
    else {
        return res.status(400).json({message:"Enter all details."});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        book.reviews[username] = review;
        return res.status(200).send("Review successfully posted");
    }
    else {
        return res.status(404).json({message: `ISBN ${isbn} not found`});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if (books[isbn]) {
        let book = books[isbn];
        delete book.reviews[username];
        return res.status(200).send("Review successfully deleted");
    }
    else {
        return res.status(404).json({message: `ISBN ${isbn} not found`});
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
