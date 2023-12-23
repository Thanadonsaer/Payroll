var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var secret = 'jwt-Payroll-token';
var cookieParser = require('cookie-parser')

var app = express()
app.use(cookieParser());

/* GET home page. */
router.get('/', (req, res, next)=> {
  var token = req.cookies["jwt_token"]; 
  var isLogin = '';
  if(token){
    var decoded = jwt.verify(token, secret);
    isLogin = decoded.username
  }
  req.flash('isLogin', isLogin);
  res.render('index');
});


router.get('/login',(req,res,next)=>{
  res.render('login');
})

module.exports = router;
