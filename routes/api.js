var express = require('express');
var router = express.Router();
var User = require("../models/User");

router.use('/user', require('./controllers/user'));
router.use('/email', require('./controllers/email'));
router.use('/twitch', require('./twitch/twitch'));

module.exports = router;