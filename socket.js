/*Socket.io라이브러리에 대한 설정 파일입니다.*/

const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
	const io = SocketIO(server, { path: '/socket.io' });
	// 라우터에서 io객체를 쓸 수 있게 저장하는 코드.
	// req.app.get('io')로 접근 가능
	app.set('io', io);

	// Socekt.io에 네임스페이스를 부여하는 메서드 of
	// Socket.io는 기본적으로 / 네임스페이스에 접속하지만 of 메소드를 사용하면 다른 네임스페이스를 만들어 접속 가능
	// 같은 네임스페이스 끼리만 데이터를 전달
	const chat = io.of('/chat');

	io.use((socket, next) => {
		sessionMiddleware(socket.request, socket.request.res, next);
	});

	// chat 네임스페이스에 이벤트 리스너를 붙여주는 것. 네임 스페이스마다 각각 이벤트 리스너를 붙여줄 수 있습니다.
	chat.on('connection', (socket) => {
		const req = socket.request;
		const { headers: { referer } } = req;

		// socket.request.headers.referer를 통해 현재 웹 페이지의 URL을 가져옴
		const roomId = referer.split('/')[4].replace(/\?.+/, '');
		console.log(`chat 네임스페이스 ${roomId}에 접속`);

		// 소켓 > 네입스페이스 > 룸(방)으로 접속하기 위해 socket.join 과 socket.leave 메소드를 사용한다.
		socket.join(roomId);

		// socket.to(roomId).emit('join', {
		// 	user: 'system',
		// 	chat: `${req.session}님이 입장하셨습니다.`
		// });

		socket.on('disconnect', async (data) => {
			console.log(`chat 네임스페이스 ${roomId} 접속 해제`);
			const currentRoom = socket.adapter.rooms[roomId];
			const userCount = currentRoom ? currentRoom.length : 0;
			socket.leave(roomId);
			//새로고침하는 유저를 위해 잠깐 시간 제한을 걸어준다.
			setTimeout(async () => {
				if (userCount === 0) {
					try {
						await axios.delete(`http://localhost:8000/api/room/${roomId}`);
					} catch (e) {
						console.error(e);
					}
				} else {
					socket.to(roomId).emit('exit', {
						user: 'system',
						chat: `${req.session}님이 퇴장하셨습니다.`
					});
				}
			}, 500);
			// 접속 해제 시 현재 방의 사람 수를 구해서 참여자 수가 0이면 방을 제거하는 HTTP 요청을 보내야 한다.
			// socket.adapter.rooms[방 아이디]에 참여 중인 소켓 정보가 있습니다.
			// Room은 위의 room 네임스페이스가 아니라 socket.io의 룸이라는 개념이다.
		});
	});
};
