const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');

const webSocekt = require('./socket');
const {COOKIE_SECRET : cookieSecret, MONGO_URL : mongoURL} = process.env

dotenv.config();
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser(cookieSecret));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: cookieSecret,
    cookie: {
        httpOnly: true,
        secure: false
    }
}));
app.use(flash());

app.listen(app.get('port'), () => {
    console.log(app.get('port'),'번 포트에서 대기 중');
});