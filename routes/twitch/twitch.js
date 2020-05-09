var express = require('express');
var router = express.Router();

router.use('/clips/', require('./clips'));

module.exports = router;