const express = require('express');

const roomCtrl = require('./room.ctrl');
const router = express.Router();

router.get('/', (req, res, next) => {});

router.post('/chat', async (req, res, next) => {
	try {
		const chat = {
			user: 'stark',
			chat: req.body.chat
		};
		req.app.get('io').of('/caht').emit('chat', chat);
		res.send('ok');
	} catch (e) {
		console.error(e);
		next(e);
	}
});

module.exports = router;
