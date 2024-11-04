import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

class ProjectMineral extends Model {}
ProjectMineral.init(
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
        mineralId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        deleted: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 1
        }
    },
    {
        sequelize,
        modelName: 'projectMineral',
        tableName: 'project_minerals',
        timestamps: false
    }
);

export default ProjectMineral;