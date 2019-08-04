const mongoose = require('mongoose');

const {Schema} = mongoose;

// 스키마 생성자 
const roomShema = new Schema({
    title: {
        type: String,
        required: true
    },
    max: {
        type: Number,
        required: true,
        defaultValue: 10,
        min: 2
    },
    owner: {
        type: String,
        required: true
    },
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Room', roomShema);
// mongoose.model('스키마이름', 스키마객체)
// 데이터베이스에서는 복수형 rooms로 컬렉션이름을 만든다.