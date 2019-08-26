/* passport의 strategy를 구현 */
const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt-nodejs');
const User = require('../schemas/user');

module.exports = (passport) => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: 'userId',
				passwordField: 'userPassword'
			},
			async (username, password, done) => {
				try {
					const user = await User.findOne({ userId: username });
					if (!user) {
						return done(null, false, { reason: '존재하지 않는 사용자입니다!' });
					}
					bcrypt.compare(password, user.password, (err, result) => {
						if (result) {
							return done(null, user);
						}
						return done(null, false, { reason: '비밀번호가 틀립니다.' });
					});
				} catch (e) {
					console.error(e);
					return done(e);
				}
			}
		)
	);
};
