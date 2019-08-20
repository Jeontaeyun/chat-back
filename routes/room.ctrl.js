const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

exports.renderRooms = async (req, res, next) => {
	try {
		const rooms = await Room.find({}).populate('owner', 'nickname');
		const io = req.app.get('io');

		const filteredRooms = rooms.map((item) => {
			const roomInfo = io.of('/chat').adapter.rooms[item._id];
			const numberUser = roomInfo ? roomInfo.length : 0;

			return { ...item._doc, numberUser };
		});

		res.status(200).send(filteredRooms);
	} catch (e) {
		console.error(e);
		next(e);
	}
};

exports.createRoom = async (req, res, next) => {
	try {
		const room = new Room({
			title: req.body.title,
			max: req.body.max,
			owner: req.body.owner,
			password: req.body.password
		});
		const newRoom = await room.save();
		// 아래의 코드를 통해서 socket.io의 io객체를 사용할 수 있다.
		const io = req.app.get('io');
		// /room 네임 스페이스에 newRoom 이벤트를 전달하는 코드.
		io.of('/room').emit('newRoom', newRoom);
	} catch (e) {
		console.log(e);
		next(e);
	}
};

exports.renderRoom = async (req, res, next) => {
	try {
		const room = await Room.findOne({ _id: req.params.id });
		const io = req.app.get('io');
		const roomInfo = io.of('/chat').adapter.rooms[req.params.id];
		// const io = req.app.get('io');
		// if (!room) {
		// 	req.flash('roomError', '존재하지 않는 방입니다.');
		// 	return res.redirect('/');
		// }
		// if (room.password && room.password !== req.query.password) {
		// 	req.flash('roomError', '비밀번호가 틀렸습니다.');
		// 	return res.redirect('/');
		// }
		// const { rooms } = io.of('/chat').adapter;
		// if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
		// 	req.flash('roomError', '허용 인원이 초과하였습니다.');
		// 	return res.redirect('/');
		// }
		return res.status(200).send({
			title: room.title,
			numberUser: roomInfo,
			password: room.password
		});
	} catch (e) {
		console.error(e);
		return next(e);
	}
};

exports.deleteRoom = async (req, res, next) => {
	try {
		await Room.remove({ _id: req.params.id });
		await Chat.remove({ room: req.params.id });
		res.send('ok');
		setTimeout(() => {
			req.app.get('io').of('./room').emit('removeRoom', req.params.id);
		}, 2000);
	} catch (e) {
		console.error(e);
		next(e);
	}
};
