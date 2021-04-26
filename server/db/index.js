const { db } = require("./db");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Order_Product = require("./models/Order_Product");
const Payment_Method = require("./models/Payment_Method");
//const seed = require('./seed');

const init = async () => {
  try {
    await db.sync({ force: true });
    //await seed();
    console.log("connected");
  } catch (error) {
    console.log(error);
  }
};

//state your model associations (hasOne etc)
User.hasMany(Order);
Order.belongsTo(User);
Order.hasMany(Product);
Product.belongsToMany(Order, { through: Order_Product });
User.hasMany(Payment_Method);
Payment_Method.belongsTo(User);

//export your db and Models (so they all can be imported from a single central location)

module.exports = { init };
