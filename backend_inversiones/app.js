import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import mineralsRouter from './routes/minerals.js';
import projectTimelineRouter from './routes/projectTimeline.js';
import projectsRouter from './routes/projects.js';
import contractsRouter from './routes/contracts.js';
import operatingexpensesRouter from './routes/operatingExpenses.js';
import investmentsRouter from './routes/investments.js';
import project_mineralsRouter from './routes/projectMinerals.js';
import withdrawal_requestsRouter from './routes/withdrawal_requests.js';
import contactsRouter from './routes/contacts.js';
import movementsRouter from './routes/movements.js';
import categoryPostsRouter from './routes/categoryPosts.js';
import postRouter from './routes/posts.js';
import faqRouter from './routes/faq.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use('/auth', authRouter)
app.use('/user', usersRouter);
app.use('/minerals', mineralsRouter);
app.use('/projectTimeline', projectTimelineRouter);
app.use('/project', projectsRouter);
app.use('/contract', contractsRouter);
app.use('/operating_expenses', operatingexpensesRouter);
app.use('/investment', investmentsRouter);
app.use('/project_minerals', project_mineralsRouter);
app.use('/withdrawal_request', withdrawal_requestsRouter);
app.use('/contact', contactsRouter);
app.use('/movement', movementsRouter);
app.use('/category_post', categoryPostsRouter);
app.use('/post', postRouter);
app.use('/faq', faqRouter);
app.use('/movement', movementsRouter);
app.use('/analysis_report', analysisReportRouter);

export default app;
