var createError = require('http-errors');
var express = require('express');
var path = require('path');
const fs= require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session= require('express-session')
const RedisStore= require('connect-redis')(session)


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blog');
var userRouter = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// 写日志
 if(process.env.NODE_ENV === 'production'){
   // 线上环境
   const fileName= path.join(__dirname, 'logs', 'access.log')
   const writeStream= fs.createWriteStream(fileName, {
        flags: 'a'
    })
   app.use(logger('combined', {
     stream: writeStream
   }))
 }else{
   // 默认输出到控制台
   app.use(logger('dev'));
 }
//  app.use(logger('dev'));
// 处理post的json请求
app.use(express.json());
// 处理post的urlencoded请求
app.use(express.urlencoded({ extended: false }));
// 处理cookie
app.use(cookieParser());
// 处理redis
const redisClient = require('./db/redis')
const sessionStore= new RedisStore({
  client: redisClient
})
// 处理session
app.use(session({
  secret: 'wjJIS_3994$',
  cookie: {
    path: '/',  // 默认
    httpOnly: true, // 默认
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore
}))
// app.use(express.static(path.join(__dirname, 'public')));


// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // 如果是开发环境，就打印错误，如果不是，就不打印
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
