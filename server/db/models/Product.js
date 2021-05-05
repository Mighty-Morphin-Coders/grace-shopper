const Sequelize = require("sequelize");

const { db } = require("../db");

const Product = db.define("product", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: Sequelize.TEXT,
    defaultValue: "This LUSH plant will brighten any room :)",
  },
  price: {
    type: Sequelize.DECIMAL,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  size: {
    type: Sequelize.ENUM(["small", "medium", "large"]),
    defaultValue: "medium",
  },
  image: {
    type: Sequelize.TEXT,
    defaultValue: "https://imgur.com/Sk9L2ah.png",
  },
  inventory: {
    type: Sequelize.INTEGER,
    defaultValue: 50,
  },
  status: {
    type: Sequelize.ENUM(["active", "not active"]),
    defaultValue: "active",
  },
  averageRating: {
    type: Sequelize.DECIMAL(1),
  },
});

module.exports = Product;
