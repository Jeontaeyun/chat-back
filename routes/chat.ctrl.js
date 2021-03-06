const Chat = require('../schemas/chat');

exports.createChat = async (req, res, next) => {
	try {
		const room = req.params.id;
		const { user } = req.body;
		const chat = new Chat({
			room: room,
			user: req.body.user._id,
			chat: req.body.chat
		});
		await chat.save();

		req.app.get('io').of('/chat').to(room).emit('chat', {
			chat: chat.chat,
			user: {
				_id: user._id,
				nickname: user.nickname,
				profile: user.profile
			}
		});
		res.send('ok');
	} catch (e) {
		console.error(e);
		next(e);
	}
};
exports.renderChat = async (req, res, next) => {
	try {
		const chats = await Chat.find({
			room: req.params.id
		})
			.sort('createdAt')
			.populate('user', 'nickname _id profile')
			.exec();
		//populate를 통해 MongoDB에서 외래키 역할을 할 수 있다.
		return res.status(200).send(chats);
	} catch (e) {
		console.error(e);
		next(e);
	}
};
