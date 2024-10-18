var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const mineralsRouter = require('./routes/minerals');
const projectTimelineRouter = require('./routes/projectTimeline');
var projectsRouter = require('./routes/projects');
var contractsRouter = require('./routes/contracts');

var investmentsRouter = require('./routes/investments');



var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/minerals', mineralsRouter);
app.use('/projectTimeline', projectTimelineRouter);
app.use('/projects', projectsRouter);
app.use('/contracts', contractsRouter);

app.use('/investments', investmentsRouter);




module.exports = app;



