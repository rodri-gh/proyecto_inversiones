import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

class MineralPriceHistory extends Model {}
MineralPriceHistory.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        mineralId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        datePrice: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        deleted: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize,
        modelName: 'mineralPriceHistory',
        tableName: 'mineral_price_history',
        timestamps: false
    }
);

export default MineralPriceHistory;