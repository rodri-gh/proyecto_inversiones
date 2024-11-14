import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";


class WithdrawalRequest extends Model { }

WithdrawalRequest.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  requestAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  commissionApply: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  receiveAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  requestDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  approvalDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  photoDocument: {
    type: DataTypes.STRING,
    allowNull: true
  },
  selfiePhoto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'withdrawalRequest',
  tableName: 'withdrawal_requests',
  timestamps: false
});

export default WithdrawalRequest;
