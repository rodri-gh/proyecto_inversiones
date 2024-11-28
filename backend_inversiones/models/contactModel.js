import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";


class Contact extends Model { }
Contact.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        phone: {
            type: DataTypes.STRING,
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        answer: {
            type: DataTypes.STRING,
        },
        deleted: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 0
        },
        createdDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedDate: {
            type: DataTypes.DATE,
        }
    },
    {
        sequelize,
        modelName: 'contact',
        tableName: 'contacts',
        timestamps: false
    }
);

export default Contact;
