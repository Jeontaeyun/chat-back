/*Socket.io라이브러리에 대한 설정 파일입니다.*/

const SocketIO = require('socket.io');

module.exports = (server) => {
    const io = SocketIO(server, {path:'/socket.io'});

    io.on('connection',(socket) => {
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속!', ip, socket.id);
        socket.on('disconnect', ()=> {
            console.log('클라이언트 접속 해제',ip,socket.id);
            clearInterval(socket.interval);
        });
        socket.on('error', (error)=> {
            console.error(error);
        });
        socket.on('reply', (data) => {
            console.log(data);
        });
        //socket객체의 interval에 해당 함수를 넣는다.
        socket.interval = setInterval(() => {
            socket.emit('news', 'Hello Socket.IO');
        }, 3000);
    });
}