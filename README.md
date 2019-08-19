# 웹 소켓을 이용한 채팅 어플 - 서버

## 01. 프로젝트 개요

### (01) 프로젝트 목적

 해당 프로젝트는 HTML5에서 지원하는 웹 소켓 모듈을 사용하며 채팅 어플을 구현하기 위한 프로젝트의 서버(백엔드)부분 입니다. 해당 프로젝트의 목적은 웹 소켓에 대해 올바르게 이해하고 HTTP 프로토콜과 ws프로토콜의 차이를 이해하는데 있습니다. 또한, 서버(백엔드)와 클라이언트(프론트)부분을 구분하여 구분함으로서 MVC 패턴으로 프로젝트를 구현하는 연습을 할 것 입니다.

- HTML5의 웹 소켓과 ws 프로토콜에 대한 이해.

- Express와 웹 소켓 모듈을 연동하는 방법 학습.

- MongoDB 사용에 대한 숙달도 향상.

 ### (02) 프로젝트 아키텍쳐

 - **Language** : Node.js 
 - **Server Framework** : Express.js
 - **Socket module** : Socket.io
 - **Solving CORS** : cors.js
 - **DataBase** : MongoDB, Mongoose
 - **Log** : morgan
 - **Session and Cookie** : express-session, cookie-parser

 ### (03) 프로젝트 리스트

 - [x] 프로젝트 초기 설정 및 git 설정
 - [x] 프로젝트 개발 리스트 작성 및 README.md 프로젝트 정리
 - [X] 개발 환경 설정 및 기본 개념 습득
 - [X] MongoDB를 이용한 프로젝트 데이터 모델링
 - [ ] API 구현하기
 - [ ] 웹 소켓을 이용한 채팅 구현하기
 - [ ] 프로필 사진 구현하기
 - [ ] 프로젝트 고찰 및 피드백

 ## 02. 프로젝트 이론

 ### (01) 웹 소켓 | Web Socket

 #### 01) Socket.io

- 웹 소켓을 지원하지 않는 브라우저에도 폴링 방식으로 실시간 통신을 지원하고, 웹 소켓을 지원하는 브라우저에서는 웹 소켓을 사용하여 실시간 통신을 지원하는 자바스크립트 모듈

- ``` $npm i socket.io ``` 를 통해 설치합니다.

- socket.io의 기본 설정은 다음과 같습니다.

```javascript

/*Socket.io라이브러리에 대한 설정 파일입니다.*/

const SocketIO = require('socket.io');

module.exports = (server) => {
    const io = SocketIO(server, {path:'/socket.io'});
    // connection이 이루어지면 socket 을 반환하고 콜백을 수행한다.
    io.on('connection',(socket) => {
        // http의 요청은 socket객체에 저장되어 있다.
        const req = socket.request;
        // 사용자의 ip를 알아내는 주요한 방법입니다.
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
        // socket객체의 interval에 해당 함수를 넣는다. 3초마다 new이벤트를 클라이언트 측으로 보내고 데이터는 "Hello Socket.IO" 입니다.
        // setInterval(()=>{},000)는 변수 선언과 동시에 실행된다.
        socket.interval = setInterval(() => {
            socket.emit('news', 'Hello Socket.IO');
        }, 3000);
    });
}

```

 ## 03. 프로젝트 API 문서 | REST

 기능            |                   메소드                 |                     주소 
 -------------- | -------------------------------------- | ------------------------------------------------
 채팅방 생성 | POST | /room
 메인화면 렌더링 | GET | /room 
 채팅방 렌더링 | GET | /room/:id
 채팅방 삭제 | DELETE | /room/:id
 회원가입 | GET | /user
 특정 방 채팅 생성 | POST | /room/:id/chat
 특정 방 채팅 렌더링 | GET | /room/:id/chat 
 

### 그 외 회원가입 및 로그인 API

기능            |                   메소드                 |                     주소 
 -------------- | -------------------------------------- | ------------------------------------------------
 회원 가입 | POST | /user </br> {userId, userPassword, userNickname}
 로그인 | GET | /user </br> {}


 ## 04. 프로젝트 고찰 

 ### (01) Dependencies 에러 처리하는 방법

 해당 프로젝트를 진행하면서 Socket.io를 설치했을 때 engine.io와 dependencies 에러가 발생하였다. 이 문제를 해결하기 위해 스택 오버플로우와 구글의 자료를 읽어 본 결과 프로젝트 시작부분에 이 문제가 발생했을 경우에 node_moudles과 package-lock.json을 모두 삭제한 후 npm i 키워드를 통해 모듈을 다시 전부 설치하는 것이 낫다는 결론을 얻었다.

 ```bash

$sudo rm -rf node_modules
$sudo rm -rf package-lock.json
$sudo npm i

 ```

 이번 프로젝트에서는 패키지간의 의존도에 따른 에러를 어떻게 처리하는 가에 대해서 배웠다. 앞으로 해당 문제가 발생할 때 이 방법을 실행한 후 안된다면 다른 해결책을 찾아봐야겠다. 우선적으로는 이 방법이 가장 효과가 좋다.
 
 ### (02) 서버 분할에 대한 시도

  해당 프로젝트의 의도적 연습의 하나는 서버를 분할해서 설계해 보는 것이다. 포트 번호를 다르게 해서 2개의 서버를 만들고 하나의 서버에서는 MongoDB와 관련된 처리를 진행하고 다른 하나의 서버에서는 이미지를 저장하고 압축하는 서버를 구축할 것이다.

  구분           | 설명
  -----------   | ----------------------------------------------------------------------------
  이미지 처리 서버  | 이미지를 받아서 압축한 후 파일 형식으로 저장하는 서버. 파일의 경로를 데이터 베이스 서버로 보내 저장한다.
  데이터 베이스 서버 | 데이터 베이스에 Room, User, Chat 에 대한 데이터를 저장하는 서버

 더 세분화 하면, Chat 소켓 통신을 수행하는 서버와 데이터를 저장하는 서버를 분할할 수 있지만 첫 번째 서버 분할이기에 이번에는 두 개의 서버만 구성하도록 할 것이다. (해당 아키텍처를 도식화해서 그림으로 표현해두자.)