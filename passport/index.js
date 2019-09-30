const User = require('../schemas/user');
const local = require('./local');

module.exports = (passport) => {
	passport.serializeUser((user, done) => {
		// Server Side로 [{id:3, cookie: 'adf'}] 세션을 남긴다.
		return done(null, user._id);
	});
	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findOne({ _id: id }, { password: false });
			return done(null, user);
			// req.user로 Request문에 데이터를 넣어준다.
		} catch (e) {
			console.error(e);
			return done(e);
		}
	});
	local(passport);
};
