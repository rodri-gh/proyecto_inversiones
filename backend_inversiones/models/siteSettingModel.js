import { Model, DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

class SiteSetting extends Model { }

SiteSetting.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    appCommission: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    homeTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'home_title'
    },
    homeText: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'home_text'
    },
    aboutTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'about_title'
    },
    aboutText: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'about_text'
    },
    aboutImage: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'about_image'
    },
    facebook: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    instagram: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tiktok: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    x: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    whatsapp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessHours: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'business_hours'
    },
    dataPolicyLink: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'data_policy_link'
    },
    termsConditionsLink: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'terms_conditions_link'
    }
  },
  {
    sequelize,
    modelName: 'siteSetting',
    tableName: 'site_settings',
    timestamps: false
  }
);

export default SiteSetting;