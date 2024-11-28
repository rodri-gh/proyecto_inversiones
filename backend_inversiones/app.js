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
import categoryPostsRouter from './routes/categoryPosts.js';
import postRouter from './routes/posts.js';
import faqRouter from './routes/faq.js';
import analysisReportRouter from './routes/analysisReport.js';
import financialProjectionsRouter from './routes/financialProjections.js';
import financialSettingsRouter from './routes/financialSettings.js';
import financialTransactionsRouter from './routes/financialTransactions.js';
import mineralPriceHistoryRouter from './routes/mineralPriceHistory.js';
import projectChangesRouter from './routes/projectChanges.js';
import projectPerformanceRouter from './routes/projectPerformance.js';
import userActivitylogRouter from './routes/userActivitylog.js';
import siteSettingRouter from './routes/siteSettings.js';
import reportClient from './routes/reportClient.js';
import apiMineralPrices from './routes/apiMineralPrices.js';
import reportAdmin from './routes/reportAdmin.js';
import projectPayment from './routes/projectPayments.js'

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
app.use('/mineral', mineralsRouter);
app.use('/projectTimeline', projectTimelineRouter);
app.use('/project', projectsRouter);
app.use('/contract', contractsRouter);
app.use('/operating-expenses', operatingexpensesRouter);
app.use('/investment', investmentsRouter);
app.use('/projectMinerals', project_mineralsRouter);
app.use('/withdrawal-request', withdrawal_requestsRouter);
app.use('/contact', contactsRouter);
app.use('/category-post', categoryPostsRouter);
app.use('/post', postRouter);
app.use('/faq', faqRouter);
app.use('/analysisReport', analysisReportRouter);
app.use('/financialProjections', financialProjectionsRouter);
app.use('/financialSettings', financialSettingsRouter);
app.use('/financialTransactions', financialTransactionsRouter);
app.use('/mineralPriceHistory', mineralPriceHistoryRouter);
app.use('/projectChanges', projectChangesRouter);
app.use('/projectPerformance', projectPerformanceRouter);
app.use('/userActivitylog', userActivitylogRouter);
app.use('/site-setting', siteSettingRouter);
app.use('/report-client', reportClient);
app.use('/apiMineralPrices', apiMineralPrices);
app.use('/report-admin', reportAdmin);
app.use('/projectPayment', projectPayment);

export default app;
