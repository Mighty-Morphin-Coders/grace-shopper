const Sequelize = require("sequelize");
const config = {
  logging: false,
};
const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost/grace_shopper_test",
  config
);

const Category = db.define("category", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

const Order_Product = db.define("order_product", {
  product_quantity: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

const Order = db.define("order", {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
  },
  total: {
    type: Sequelize.DECIMAL(2),
  },
  ordered_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  delivered_date: {
    type: Sequelize.DATE,
  },
  tax: {
    type: Sequelize.VIRTUAL,
    get() {
      const tax = this.total * 0.08;
      return tax;
    },
  },
  status: {
    type: Sequelize.ENUM([
      "in progress",
      "created",
      "processing",
      "canceled",
      "completed",
    ]),
    defaultValue: "in progress",
  },
  isCreated: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  tracking_number: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  shipping_address: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

const Payment_Method = db.define("payment_method", {
  isPrimary: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  institution: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  number: {
    type: Sequelize.INTEGER(16),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  month_expiry: {
    type: Sequelize.INTEGER(2),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  year_expiry: {
    type: Sequelize.INTEGER(2),
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  billing_address: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

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
    type: Sequelize.STRING,
    defaultValue:
      "https://hgtvhome.sndimg.com/content/dam/images/grdn/fullset/2014/6/25/0/CI_04-fbfd01d70004.jpg.rend.hgtvcom.966.725.suffix/1452664590074.jpeg",
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

const Review = db.define("review", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  rating: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
      min: 1,
      max: 5,
    },
  },
});

const User = db.define("user", {
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
    validate: {
      notEmpty: true,
    },
  },
  role: {
    type: Sequelize.ENUM(["AUTHENTICATED", "GUEST"]),
    allowNull: false,
    defaultValue: "GUEST",
    validate: {
      notEmpty: true,
    },
  },
  first: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  last: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  fullName: {
    type: Sequelize.VIRTUAL,
    defaultValue: "guest",
    get() {
      return `${this.first} ${this.last}`;
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "guest_pw",
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "guestEmail@gmail.com",
    validate: {
      notEmpty: true,
      isEmail: true,
    },
  },
});

//state your model associations (hasOne etc)
User.hasMany(Order);
Order.belongsTo(User);
Order.hasMany(Product);
Product.belongsToMany(Order, { through: Order_Product });
User.hasMany(Payment_Method);
Payment_Method.belongsTo(User);
User.hasMany(Review);
Review.belongsTo(User);
Product.hasMany(Review);
Review.belongsTo(Product);
Category.hasMany(Product);
Product.belongsToMany(Category, { through: "Category_Product" });

const seedTest = async () => {
  try {
    //user data
    const arjan = await User.create({
      isAdmin: true,
      role: "AUTHENTICATED",
      first: "Arjan",
      last: "Mitra",
      email: "arjanmitra@hotmail.com",
    });
    const felicia = await User.create({
      isAdmin: true,
      role: "AUTHENTICATED",
      first: "Felicia",
      last: "Heiney",
      email: "felicia@email.com",
    });
    const inderprit = await User.create({
      isAdmin: true,
      role: "AUTHENTICATED",
      first: "Inderprit",
      last: "Singh",
      email: "inderprit@email.com",
    });
    const linda = await User.create({
      isAdmin: true,
      role: "AUTHENTICATED",
      first: "Linda",
      last: "Nzeukang",
      email: "linda@email.com",
    });

    const productOne = await Product.create({
      name: "cotton candy",
      description: "this is cotton candy",
      price: 2.82,
      size: "small",
      inventory: 20,
      status: "active",
    });

    const productTwo = await Product.create({
      name: "Huggies",
      description: "this diaper absorbs everything!!",
      price: 12.99,
      size: "medium",
      inventory: 20,
      status: "active",
    });

    const productThree = await Product.create({
      name: "masks",
      description: "great for robbing people",
      price: 4.99,
      size: "large",
      inventory: 48,
      status: "active",
    });

    const productArr = [productOne, productTwo, productThree];
    const usersArr = [arjan, felicia, inderprit, linda];
    return { productArr, usersArr };
  } catch (error) {
    console.log(error);
  }
};

const initTest = async () => {
  try {
    await db.sync({ force: true });
    const seedData = await seedTest();
    console.log("connected");
    return seedData;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { initTest, Product, User };
