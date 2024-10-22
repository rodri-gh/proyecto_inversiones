var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var mineralsRouter = require('./routes/minerals');
var projectTimelineRouter = require('./routes/projectTimeline');
var projectsRouter = require('./routes/projects');
var contractsRouter = require('./routes/contracts');
var operatingexpensesRouter = require('./routes/operatingexpenses');
var investmentsRouter = require('./routes/investments');
var project_mineralsRouter = require('./routes/project_minerals');
var withdrawal_requestsRouter = require('./routes/withdrawal_requests');


var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', indexRouter);
app.use('/auth', authRouter)
app.use('/user', usersRouter);
app.use('/minerals', mineralsRouter);
app.use('/projectTimeline', projectTimelineRouter);
app.use('/projects', projectsRouter);
app.use('/contracts', contractsRouter);
app.use('/operatingexpenses', operatingexpensesRouter);
app.use('/investments', investmentsRouter);
app.use('/project_minerals', project_mineralsRouter);
app.use('/withdrawal_requests', withdrawal_requestsRouter);


module.exports = app;
