import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

class ProjectChanges extends Model {}
ProjectChanges.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        projectId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        changeDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        fieldChanged: {
            type: DataTypes.STRING,
            allowNull: false
        },
        oldValue: {
            type: DataTypes.STRING,
            allowNull: false
        },
        newValue: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deleted: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize,
        modelName: 'projectChanges',
        tableName: 'project_changes',
        timestamps: false
    }
);

export default ProjectChanges;