import User from './userModel.js';
import Project from './projectModel.js';
import Account from './accountModel.js';
import Investment from './investmentModel.js';
import Contract from './contractModel.js';
import Mineral from './mineralModel.js';
import OperatingExpense from './operatingExpenseModel.js';
import ProjectMineral from './projectMineralModel.js';
import ProjectTimeline from './projectTimelineModel.js';
import CategoryPost from './categoryPostModel.js';
import Contact from './contactModel.js';
import Faq from './faqModel.js';
import WithdrawalRequest from './withdrawalRequestModel.js';
import UserActivitylog from './userActivitylogModel.js';
import FinancialTransactions from './financialTransactionsModel.js'
import MineralPriceHistory from './mineralPriceHistoryModel.js';
import FinancialSettings from './financialSettingsModel.js';
import ProjectPerformance from './projectPerformanceModel.js';
import ProjectChanges from './projectChangesModel.js';
import FinancialProjections from './financialProjectionsModel.js';
import ProjectPayment from './projectPaymentsModel.js';
import SiteSetting from './siteSettingModel.js';


User.hasOne(Account, { foreignKey: 'userId' });
Account.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Investment, { foreignKey: 'userId' });
Investment.belongsTo(User, { foreignKey: 'userId' });

Project.hasMany(Investment, { foreignKey: 'projectId' });
Investment.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(Contract, { foreignKey: 'projectId' });
Contract.belongsTo(Project, { foreignKey: 'projectId' });

User.hasMany(Contract, { foreignKey: 'userId' });
Contract.belongsTo(User, { foreignKey: 'userId' });

Contract.hasOne(Investment, { foreignKey: 'contractId' });
Investment.belongsTo(Contract, { foreignKey: 'contractId' });


Project.hasMany(OperatingExpense, { foreignKey: 'projectId' });
OperatingExpense.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(ProjectMineral, { foreignKey: 'projectId' });
ProjectMineral.belongsTo(Project, { foreignKey: 'projectId' });

Mineral.hasMany(ProjectMineral, { foreignKey: 'mineralId' });
ProjectMineral.belongsTo(Mineral, { foreignKey: 'mineralId' });

User.hasMany(ProjectMineral, { foreignKey: 'userId' });
ProjectMineral.belongsTo(User, { foreignKey: 'userId' });

Project.hasMany(ProjectTimeline, { foreignKey: 'projectId' });
ProjectTimeline.belongsTo(Project, { foreignKey: 'projectId' });

User.hasMany(WithdrawalRequest, { foreignKey: 'user_id', as: 'withdrawalRequests' });
WithdrawalRequest.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Investment.hasMany(WithdrawalRequest, { foreignKey: 'investment_id', as: 'withdrawalRequests' });
WithdrawalRequest.belongsTo(Investment, { foreignKey: 'investment_id', as: 'investment' });

User.hasMany(FinancialTransactions, { foreignKey: 'userId' });
FinancialTransactions.belongsTo(User, { foreignKey: 'userId' });

Project.hasMany(FinancialTransactions, { foreignKey: 'projectId' });
FinancialTransactions.belongsTo(Project, { foreignKey: 'projectId' });

Mineral.hasMany(MineralPriceHistory, { foreignKey: 'mineralId' });
MineralPriceHistory.belongsTo(Mineral, { foreignKey: 'mineralId' });

User.hasMany(UserActivitylog, { foreignKey: 'userId' });
UserActivitylog.belongsTo(User, { foreignKey: 'userId' });

Project.hasMany(ProjectPerformance, { foreignKey: 'projectId' });
ProjectPerformance.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(ProjectChanges, { foreignKey: 'projectId' });
ProjectChanges.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(FinancialProjections, { foreignKey: 'projectId' });
FinancialProjections.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(ProjectPayment, { foreignKey: 'projectId' });
ProjectPayment.belongsTo(Project, { foreignKey: 'projectId' });

User.hasMany(ProjectPayment, { foreignKey: 'userId' });
ProjectPayment.belongsTo(User, { foreignKey: 'userId' });



export {
  User,
  Project,
  Account,
  Investment,
  Contract,
  Mineral,
  OperatingExpense,
  ProjectMineral,
  ProjectTimeline,
  CategoryPost,
  Contact,
  Faq,
  WithdrawalRequest,
  FinancialTransactions,
  MineralPriceHistory,
  FinancialSettings,
  UserActivitylog,
  ProjectPerformance,
  ProjectChanges,
  FinancialProjections,
  ProjectPayment,
  SiteSetting
};
