import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";


class CategoryPost extends Model { }
CategoryPost.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: 'category_post',
        tableName: 'category_posts',
        timestamps: false
    }
);

export default CategoryPost;