
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

let flash = require('express-flash');
let session = require('express-session');
let mysql = require('mysql');
let connection = require('./lib/db')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employeeRouter = require('./routes/employee');
var authRouter = require('./routes/auth');


var app = express();
app.use("/css",express.static("./node_modules/bootstrap/dist/css/"));
app.use("/js",express.static("./node_modules/bootstrap/dist/js/"));
app.use("/sweetalert2/dist",express.static("./node_modules/sweetalert2/dist/"));
app.use("/jquery/dist/",express.static("./node_modules/jquery/dist/"));
app.use("/datatables.net-dt/css/",express.static("./node_modules/datatables.net-dt/css/"));
app.use("/datatables.net/js/",express.static("./node_modules/datatables.net/js/"));
app.use("/datatables.net-responsive-dt/css/",express.static("./node_modules/datatables.net-responsive-dt/css/"));
app.use("/datatables.net-responsive/js/",express.static("./node_modules/datatables.net-responsive/js/"));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(session({
  cookie:{maxAge:60000},
  store:new session.MemoryStore,
  saveUninitialized:true,
  resave:'true',
  secret:'secret'
}))
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/employee', employeeRouter);
app.use('/auth', authRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// login goes here

module.exports = app;
