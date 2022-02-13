const express = require('express');
const app = express();
const User = require('./models/user');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const { port } = process.env;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/user', (req, res) => {
    res.json([{
        "name": "Abhishek Paul",
        "email": "abhishek.paulcp.dbs@gmail.com"
    }])
})

app.listen(port, () => {
    console.log(`Server listening on port:${port}...`);
})