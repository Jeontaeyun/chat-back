const express = require('express');

const roomCtrl = require('./room.ctrl');
const router = express.Router();

router.get('/', (req, res, next) => {});
router.get('/room', (req, res, next) => {});
router.post('/room', (req, res, next) => {});
router.get('/room/:id', (req, res, next) => {});
router.delete('/room/:id', (req, res, next) => {});
router.get('/room/:id/chat', (req, res, next) => {});
router.post('/room/:id/chat', (req, res, next) => {});
module.exports = router;
