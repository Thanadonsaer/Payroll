var express = require('express');
var authController = require('../controllers/auth')
var router = express.Router();


// connect sql database
let dbCon = require('../lib/db');
const { Types } = require('mysql');


router.post('/register',authController.register)
router.post('/login',authController.login)

module.exports = router;
