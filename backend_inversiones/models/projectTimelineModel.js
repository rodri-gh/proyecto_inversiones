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
            allowNull: false
        },
        priceMineral1: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'price_mineral1'
        },
        priceMineral2: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'price_mineral2'
        },
        deleted: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
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