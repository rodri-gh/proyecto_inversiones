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
// aqui el enrutador de contactos 
var contactsRouter = require('./routes/contacts');

var categoryPostsRouter = require('./routes/categoryPosts');
var postRouter = require('./routes/posts');


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
app.use('/contacts', contactsRouter);
app.use('/categoryPosts', categoryPostsRouter);
app.use('/posts', postRouter);


module.exports = app;
