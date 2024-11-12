import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

class UserActivitylog extends Model {}
UserActivitylog.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        action: {
            type: DataTypes.ENUM('investment', 'withdrawal', 'profile_update', 'deposit', 'logout', 'password_change'),
            allowNull: false,
            defaultValue: 'active'
        },
        dateTime: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        deleted: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize,
        modelName: 'userActivitylog',
        tableName: 'user_activity_log',
        timestamps: false
    }
);

export default UserActivitylog;