var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var movementsRouter = require('./routes/movements');

var settingsRouter = require('./routes/settings');
var investmentsRouter = require('./routes/investments');
var linksRouter = require('./routes/links');


var informationRouter = require('./routes/information');
var withdrawalRequestsRouter = require('./routes/withdrawalRequests');


var contactRouter = require('./routes/contact');
var postsRouter = require('./routes/posts');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/movements', movementsRouter);


app.use('/settings', settingsRouter);
app.use('/investments', investmentsRouter);
app.use('/links', linksRouter);
app.use('/contact', contactRouter);
app.use('/posts', postsRouter);


app.use('/information', informationRouter);
app.use('/withdrawalRequests', withdrawalRequestsRouter);


app.use('/posts', postsRouter); 
app.use('/contact', contactRouter);



module.exports = app;
