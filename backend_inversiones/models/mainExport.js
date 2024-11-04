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
import Movement from './movementModel.js';
import WithdrawalRequest from './withdrawalRequestModel.js';


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

Investment.hasMany(Contract, { foreignKey: 'investmentId' });
Contract.belongsTo(Investment, { foreignKey: 'investmentId' });

Project.hasMany(OperatingExpense, { foreignKey: 'projectId' });
OperatingExpense.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(ProjectMineral, { foreignKey: 'projectId' });
ProjectMineral.belongsTo(Project, { foreignKey: 'projectId' });

Mineral.hasMany(ProjectMineral, { foreignKey: 'mineralId' });
ProjectMineral.belongsTo(Mineral, { foreignKey: 'mineralId' });

Project.hasMany(ProjectTimeline, { foreignKey: 'projectId' });
ProjectTimeline.belongsTo(Project, { foreignKey: 'projectId' });

User.hasMany(WithdrawalRequest, { foreignKey: 'user_id', as: 'withdrawalRequests' });
WithdrawalRequest.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Investment.hasMany(WithdrawalRequest, { foreignKey: 'investment_id', as: 'withdrawalRequests' });
WithdrawalRequest.belongsTo(Investment, { foreignKey: 'investment_id', as: 'investment' });

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
    Movement,
    WithdrawalRequest
};
