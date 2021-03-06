const express = require('express');

const roomCtrl = require('./room.ctrl');
const userCtrl = require('./user.ctrl');
const chatCtrl = require('./chat.ctrl');
const router = express.Router();

router.get('/room', (req, res, next) => roomCtrl.renderRooms(req, res, next));
router.post('/room', (req, res, next) => roomCtrl.createRoom(req, res, next));
router.get('/room/:id', (req, res, next) => roomCtrl.renderRoom(req, res, next));
router.delete('/room/:id', (req, res, next) => roomCtrl.deleteRoom(req, res, next));
router.get('/room/:id/chat', (req, res, next) => chatCtrl.renderChat(req, res, next));
router.post('/room/:id/chat', (req, res, next) => chatCtrl.createChat(req, res, next));
router.post('/user', (req, res, next) => userCtrl.signupUser(req, res, next));
router.post('/login', (req, res, next) => userCtrl.loginUser(req, res, next));
router.post('/logout', (req, res, next) => userCtrl.logoutUser(req, res, next));
module.exports = router;
