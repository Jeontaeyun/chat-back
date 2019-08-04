const mongoose = require('mongoose');

const {MONGO_ID, MONGO_PASSWORD, NODE_ENV} = process.env;

const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/chatapp`

module.exports = () => {
    //MongoDB 연결하는 connect 함수 선언
    const connect = () => {
        if(NODE_ENV !=='production'){
            mongoose.set('debug', true);
        }
        // MongoDB연결하는 코드
        mongoose.connect(MONGO_URL, {
            dbName: 'gifchat'
        }, (error)=> {
            if(error){
                console.log('몽고디비 연결 에러', error);
            }
            else{
                console.log('몽고디비 연결 성공');
            }
        });
    };
    // MongoDB 연결하는 코드 실행
    connect();
    // 이벤트 처리를 통해서 error, disconnected 이벤트가 발생할 때마다. 다음 작업을 수행하도록 합니다.
    mongoose.connection.on('error', (errorr) => {
        console.error('몽고디비 연결 에러', error);
    });
    mongoose.connection.on('disconnected', () => {
        console.error('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.');
        connect();
    });
    require('./room');
    require('./chat');
}