const passport = require('passport');
const User = require('../schemas/user');
const local = require('./local');

module.exports = () => {
	passport.serializeUser((user, done) => {
		// Server Side로 [{id:3, cookie: 'adf'}] 세션을 남긴다.
		const [ filterUser ] = user;
		console.log(filterUser);
		return done(null, filterUser._id);
	});
	passport.deserializeUser(async (_id, done) => {
		try {
			const user = await User.find({ _id });
			const [ filterUser ] = user;
			return done(null, filterUser); // req.user로 Request문에 데이터를 넣어준다.
		} catch (e) {
			console.error(e);
			return done(e);
		}
	});
	local();
};
