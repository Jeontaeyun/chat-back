const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types: {ObjectId}} = Schema;
// 스키마 생성자 
const chatShema = new Schema({
    room: {
        type: ObjectId,
        required: true,
        ref: 'Room'         
        // Room 스키마를 참조(연결)하는 방법입니다. 외래키와 비슷한 역할인 듯 하다. 
    },
    user: {
        type: ObjectId,
        required: true,
        ref: 'User'
    },
    chat: String,
    gif: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Chat', chatShema);
// mongoose.model('스키마이름', 스키마객체)
// 데이터베이스에서는 복수형 rooms로 컬렉션이름을 만든다.