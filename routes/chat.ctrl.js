const Chat = require('../schemas/chat');

exports.createChat = async (req, res, next) => {
	try {
		const chat = new Chat({
			room: req.params.id,
			user: req.session,
			chat: req.body.chat
		});
		await chat.save();
		req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
		res.send('ok');
	} catch (e) {
		console.error(e);
		next(e);
	}
};
