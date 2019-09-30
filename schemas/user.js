const mongoose = require('mongoose');

const { Schema } = mongoose;

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
	profile: {
		type: String
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
