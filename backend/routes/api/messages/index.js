const express = require('express');
const router = express.Router();
const Controllers = require('../../../controllers');


router.get('/:room', Controllers.message.getMessage);

module.exports = router;
