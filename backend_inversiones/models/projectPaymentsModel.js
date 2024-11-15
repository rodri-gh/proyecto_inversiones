import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

class ProjectPayment extends Model {}
ProjectPayment.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        projectId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        amountInvested: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        amountEarned: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending', 
            allowNull: false
        },
        payoutDate: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        deleted: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize,
        modelName: 'projectPayment',
        tableName: 'project_payments',
        timestamps: false
    }
);

export default ProjectPayment;