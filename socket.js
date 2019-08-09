/*Socket.io라이브러리에 대한 설정 파일입니다.*/

const SocketIO = require('socket.io');

module.exports = (server, app) => {
	const io = SocketIO(server, { path: '/socket.io' });
	// 라우터에서 io객체를 쓸 수 있게 저장하는 코드.
	// req.app.get('io')로 접근 가능
	app.set('io', io);
	// Socekt.io에 네임스페이스를 부여하는 메서드 of
	// Socket.io는 기본적으로 / 네임스페이스에 접속하지만 of 메소드를 사용하면 다른 네임스페이스를 만들어 접속 가능
	// 같은 네임스페이스 끼리만 데이터를 전달
	const room = io.of('/room');
	const chat = io.of('/chat');

	// romm 네임스페이스에 이벤트 리스너를 붙여주는 것. 네임 스페이스마다 각각 이벤트 리스너를 붙여줄 수 있습니다.
	room.on('connection', (socket) => {
		console.log('room 네임스페이스에 접속');
		socket.on('disconnect', () => {
			console.log('room 네임스페이스 접속 해제');
		});
	});

	// chat 네임스페이스에 이벤트 리스너를 붙여주는 것. 네임 스페이스마다 각각 이벤트 리스너를 붙여줄 수 있습니다.
	chat.on('connection', (socket) => {
		console.log('chat 네임스페이스에 접속');
		socket.join('hi');
		socket.on('send', (data) => {
			socket.to('hi').emit('chat', data);
			socket.emit('chat', data);
		});
		socket.on('disconnect', () => {
			console.log('chat 네임스페이스 접속 해제');
		});
	});
};
