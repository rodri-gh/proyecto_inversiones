import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";


class Contact extends Model { }
Contact.init(
    {
        contact_id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
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
        comments: {
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
        modelName: 'contact',
        tableName: 'contacts',
        timestamps: false
    }
);

export default Contact;
