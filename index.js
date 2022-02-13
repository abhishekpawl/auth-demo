const express = require('express');
const app = express();
const User = require('./models/user');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const users = require('./users');

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
app.use(session({ secret: 'secretsecretsecret' }));

const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next()
}

app.get('/', (req, res) => {
    res.render('home')
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
    // storing user id on successful registration
    req.session.user_id = user._id;
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
        // storing user id on successful login
        req.session.user_id = user._id;
        res.redirect('/user')
    } else {
        res.redirect('/login')
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
})

app.get('/user', requireLogin, (req, res) => {
    res.render('users', { users })
})

app.listen(port, () => {
    console.log(`Server listening on port:${port}...`);
})