const express = require('express');
const app = express();
const User = require('./models/user');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

dotenv.config();

const { port } = process.env;

mongoose.connect('mongodb://localhost:27017/authDemo', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Mongo connection establised...");
    })
    .catch(err => {
        console.log("Mongo error...");
        console.log(err);
    })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Home page')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async(req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hashedPassword
    })
    await user.save();
    res.redirect('/');
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async(req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.send('Incorrect username or password!')
    }
    const isUser = await bcrypt.compare(password, user.password);
    if (isUser) {
        res.send('Logged in!')
    } else {
        return res.send('Incorrect username or password!')
    }
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