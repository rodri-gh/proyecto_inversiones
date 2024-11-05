import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import User from "./userModel.js";


class Account extends Model { }
Account.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'account',
        tableName: 'account',
        timestamps: false
    }
);

export default Account;
