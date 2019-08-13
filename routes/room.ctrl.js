const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

exports.renderRooms = async (req, res, next) => {
	try {
		const rooms = await Room.find({});
		res.render('main', { rooms, title: 'GIF 채팅방', error: req.flash('roomError') });
	} catch (e) {
		console.error(e);
		next(e);
	}
};

exports.renderRoomTitle = (req, res) => {
	res.render('room', { title: 'GIF 채팅방 생성' });
};

exports.createRoom = async (req, res, next) => {
	try {
		const room = new Room({
			title: req.body.title,
			max: req.body.max,
			owner: req.session,
			password: req.body.password
		});
		const newRoom = await room.save();
		// 아래의 코드를 통해서 socket.io의 io객체를 사용할 수 있다.
		const io = req.app.get('io');
		// /room 네임 스페이스에 newRoom 이벤트를 전달하는 코드.
		io.of('/room').emit('newRoom', newRoom);
		// 방 주소에 room_id와 passwor가 같이 있는 것은 보안상 위험하지 않을까?
		// 다른 방식으로 구성하도록 나중에 수정하자.
		res.redirect(`/room/${newRoom._id}?password=${req.body.password}`);
	} catch (e) {
		console.log(e);
		next(e);
	}
};

exports.renderRoom = async (req, res, next) => {
	try {
		const room = await Room.findOne({ _id: req.params.id });
		const io = req.app.get('io');
		if (!room) {
			req.flash('roomError', '존재하지 않는 방입니다.');
			return res.redirect('/');
		}
		if (room.password && room.password !== req.query.password) {
			req.flash('roomError', '비밀번호가 틀렸습니다.');
			return res.redirect('/');
		}
		const { rooms } = io.of('/chat').adapter;
		if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) {
			req.flash('roomError', '허용 인원이 초과하였습니다.');
			return res.redirect('/');
		}
		return res.render('chat', {
			room,
			title: room.title,
			user: req.session
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
