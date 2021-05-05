const router = require('express').Router();
const Order = require('../../db/models/Order');
const User = require('../../db/models/User');
const Product = require('../../db/models/Product');
const Order_Product = require('../../db/models/Order_Product');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const stripePublic = process.env.STRIPE_PUBLIC_KEY;
const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(stripeSecret);
//get routes
router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.findAll();
    res.status(200).send(orders);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    res.status(200).send(order);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/products', async (req, res, next) => {
  try {
    //const order = await Order.findByPk(req.params.id);
    const products = await Order.getProducts(req.params.id);
    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
});

router.get('/user/cart', async (req, res, next) => {
  try {
    const currentUser = await User.byToken(req.headers.authorization);
    const currentCart = await Order.findOne({
      where: {
        userId: currentUser.id,
        status: 'in progress',
      },
      include: Product,
    });
    res.send(currentCart).status(200);
  } catch (error) {
    next(error);
  }
});

router.get('/user/:userId/orders', async (req, res, next) => {
  try {
    const pastOrders = await Order.findAll({
      where: {
        userId: req.params.userId,
        status: ['created', 'processing', 'canceled', 'completed'],
      },
    });
    res.send(pastOrders).status(200);
  } catch (error) {
    next(error);
  }
});

//stripe routes

// router.post("/checkout", async (req, res, next) => {
//   try {
//     const { token } = req.body;
//     const customer = await stripe.customers.create({ email: token.email, source: token.id });
//     const idempotency_key = uuid()
//     const charge = await stripe.charges.create({})
//   } catch (error) {
//     next(error);
//   }
// });
// router.get("/:id/stripe", async (req, res, next) => {
//   try {
//     const theOrder = await Order.findByPk(req.params.id)

//   } catch (error) {
//     next(error)
//   }
// })

//post routes

router.post('/cart/create', async (req, res, next) => {
  try {
    const { productId } = req.body.data;
    //const { userId } = req.params;
    const user = await User.byToken(req.body.headers.authorization);
    const now = new Date();
    const theProduct = await Product.findByPk(productId);
    const makeAnOrder = await Order.create({
      userId: user.id,
      status: 'in progress',
      total: theProduct.price,
      ordered_date: now,
      isCreated: false,
      shipping_address: 'PLACEHOLDER',
    });
    await Order_Product.create({
      orderId: makeAnOrder.dataValues.id,
      //userId: user.id,
      productId,
      product_quantity: 1,
    });
    const theOrder = await Order.findOne({
      where: {
        id: makeAnOrder.dataValues.id,
      },
      include: Product,
    });
    res.send({ order: theOrder }).status(204);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newOrderData = req.body;
    const newOrder = await Order.create(newOrderData);
    res.status(201).send(newOrder);
  } catch (error) {
    next(error);
  }
});

//put routes

router.put('/:id', async (req, res, next) => {
  try {
    const updateData = req.body;
    const { id } = req.params;
    const orderToBeUpdated = await Order.findByPk(id);
    const editedOrder = await orderToBeUpdated.update(updateData);
    res.send(editedOrder.dataValues).status(204);
  } catch (error) {
    next(error);
  }
});

router.put('/cart/add', async (req, res, next) => {
  try {
    let updatedOrder;
    const { productExists, productId, cartId } = req.body.data;
    const theProduct = await Product.findByPk(productId);
    if (productExists) {
      const updatedProductInCart = await Order_Product.findOne({
        where: {
          productId,
        },
      });
      const newAmount = updatedProductInCart.product_quantity + 1;
      await updatedProductInCart.update({
        product_quantity: newAmount,
      });
      const theOrder = await Order.findByPk(cartId);
      const newTotal = theOrder.total + theProduct.price;
      updatedOrder = await theOrder.update({ total: newTotal });
    } else {
      const newProductInCart = await Order_Product.create({
        orderId: req.body.data.cartId,
        productId: req.body.data.productId,
        product_quantity: 1,
      });
    }
    const anOrder = await Order.findOne({
      where: {
        id: cartId,
      },
    });
    const newTotal = Number(anOrder.total) + Number(theProduct.price);
    console.log(newTotal);
    updatedOrder = await anOrder.update({ total: newTotal });
    res.send(updatedOrder).status(204);
  } catch (error) {
    console.log(error);
  }
});

//delete routes
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const orderToBeDeleted = await Order.findByPk(id);
    await orderToBeDeleted.destroy();
    res.send(orderToBeDeleted).status(204);
  } catch (error) {
    next(error);
  }
});

// route for deleting entire product from a cart
router.delete('/cart/product/delete', async (req, res, next) => {
  try {
    const { productId, orderId } = req.body;
    const productToBeDeleted = await Order_Product.findOne({
      where: {
        productId,
        orderId,
      },
    });
    const orderToBeUpdated = await Order.findOne({
      where: {
        id: orderId,
      },
    });
    const product = await Product.findOne({
      where: {
        id: productId,
      },
    });
    const newTotal =
      orderToBeUpdated.dataValues.total - product.dataValues.price;
    await orderToBeUpdated.update({ total: newTotal });
    await productToBeDeleted.destroy();
    res.send(productToBeDeleted).status(204);
  } catch (error) {
    next(error);
  }
});

router.put('/cart/product/deleteSingleItem', async (req, res, next) => {
  try {
    console.log(req.body);
    const { productId, orderId } = req.body;
    const productToBeUpdated = await Order_Product.findOne({
      where: {
        productId,
        orderId,
      },
    });
    const newAmount = productToBeUpdated.product_quantity - 1;
    await productToBeUpdated.update({ product_quantity: newAmount });
    res.send(productToBeUpdated).status(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
