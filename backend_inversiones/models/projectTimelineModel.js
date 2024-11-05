import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

class ProjectTimeline extends Model {}
ProjectTimeline.init(
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
        phase: {
            type: DataTypes.STRING,
            allowNull: false
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        deleted: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        sequelize,
        modelName: 'projectTimeline',
        tableName: 'project_timelines',
        timestamps: false
    }
);

export default ProjectTimeline;