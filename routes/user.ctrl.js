const User = require('../schemas/user');
const bcrypt = require('bcrypt-nodejs');
const passport = require('passport');

exports.signupUser = async (req, res, next) => {
	try {
		const exUser = await User.find({
			userId: req.body.userId
		});
		if (exUser.length !== 0) {
			return res.status(403).send('이미 사용 중인 아이디입니다.');
		}
		bcrypt.hash(req.body.userPassword, null, null, async (err, hash) => {
			if (err) {
				console.log('bcrypt.genSalt() Error: ', err.message);
			} else {
				const user = new User({
					userId: req.body.userId,
					password: hash,
					nickname: req.body.userNickname,
					job: req.body.userJob,
					profile: req.body.userProfile
				});
				const newUser = await user.save();
				const filteredUser = Object.assign({}, newUser.toJSON());
				delete filteredUser.password;
				return res.status(200).send(filteredUser);
			}
		});
	} catch (e) {
		console.error(e);
		next(e);
	}
};

exports.loginUser = async (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			console.error(err);
			return next(err);
		}
		if (info) {
			console.log(info);
			return res.status(401).send(info.reason);
		}
		req.login(user, (loginErr) => {
			if (loginErr) {
				return next(loginErr);
			}
			//user.toJSON()을 통해서 객체를 JSON데이터 형태로 바꿔줌
			const filteredUser = Object.assign({}, user.toJSON());
			delete filteredUser.password;
			return res.json(filteredUser);
		});
	})(req, res, next);
};

exports.logoutUser = (req, res, next) => {
	req.logout();
	req.session.destroy();
	return res.status(200).send('ok');
};
