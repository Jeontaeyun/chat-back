const mongoose = require('mongoose');

const { Schema } = mongoose;

// 스키마 생성자
const userShema = new Schema({
	userId: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	nickname: {
		type: String,
		required: true
	},
	job: {
		type: String,
		required: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('User', userShema);
// mongoose.model('스키마이름', 스키마객체)
// 데이터베이스에서는 복수형 rooms로 컬렉션이름을 만든다.
