import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";


class WithdrawalRequest extends Model {}

WithdrawalRequest.init({
    withdrawal_request_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'withdrawal_requests_id'
    },
    request_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    commission_apply: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    receive_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    request_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    approval_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    photo_document: {
        type: DataTypes.STRING,
        allowNull: true
    },
    selfie_photo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false
    },
    deleted: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'withdrawalRequest',
    tableName: 'withdrawal_requests',
    timestamps: false
});

export default WithdrawalRequest;
