const mongoose = require('mongoose');

const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;

const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;
module.exports = () => {
	//MongoDB 연결하는 connect 함수 선언
	const connect = () => {
		if (NODE_ENV !== 'production') {
			mongoose.set('debug', true);
		}
		// MongoDB연결하는 코드
		mongoose.connect(
			MONGO_URL,
			{
				// 해당 URL의 데이터 베이스가 없으면 생성해주는 명령어
				useNewUrlParser: true,
				dbName: 'gifchat'
			},
			(error) => {
				if (error) {
					console.log('몽고디비 연결 에러', error);
				} else {
					console.log('몽고디비 연결 성공');
				}
			}
		);
	};
	// MongoDB 연결하는 코드 실행
	connect();
	// 이벤트 처리를 통해서 error, disconnected 이벤트가 발생할 때마다. 다음 작업을 수행하도록 합니다.
	mongoose.connection.on('error', (error) => {
		console.error('몽고디비 연결 에러', error);
	});

	require('./room');
	require('./chat');
	require('./user');
};
