const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;

const chatShema = new Schema({
	room: {
		type: ObjectId,
		required: true,
		ref: 'Room'
		// Room 스키마를 참조(연결)하는 방법입니다. 외래키와 비슷한 역할인 듯 하다.
	},
	user: {
		type: ObjectId,
		required: true,
		ref: 'User'
	},
	chat: String,
	gif: String,
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Chat', chatShema);
