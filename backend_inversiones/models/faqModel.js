import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";


class Faq extends Model { }
Faq.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        ask: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        //TODO: to review default value '1'
        status: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        },
        created_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_date: {
            type: DataTypes.DATE,
        }
    },
    {
        sequelize,
        modelName: 'faq',
        tableName: 'faqs',
        timestamps: false
    }
);

export default Faq;