const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const passportConfig = require('./passport');
//schema에서 .env파일을 사용하므로 이 위에 먼저 .env 설정을 해주어야한다.
const FileStore = require('session-file-store')(session)
dotenv.config();
const connect = require('./schemas');

const webSocket = require('./socket');
const { COOKIE_SECRET: cookieSecret } = process.env;
const sessionMiddleware = session({
	resave: true,
	saveUninitialized: false,
	secret: cookieSecret,
	cookie: {
		httpOnly: true,
		secure: false
	},
	store: new FileStore()
});
const app = express();
connect();

app.use(
	cors({
		origin: true,
		credentials: true
	})
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser(cookieSecret));
app.use(sessionMiddleware);
app.use(flash());
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

const apiLogic = require('./routes/index');

app.use('/api', apiLogic);


const server = app.listen(8000, () => {
	console.log('8000번 포트에서 대기 중');
});
webSocket(server, app, sessionMiddleware);
