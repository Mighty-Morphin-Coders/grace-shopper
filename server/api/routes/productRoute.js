const router = require("express").Router();
const Product = require("../../db/models/Product");
const Review = require("../../db/models/Review");

//get routes
router.get("/", async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.status(200).send(products);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/reviews", async (req, res, next) => {
  try {
    const product = await Product.findAll({
      where: {
        id: req.params.id,
      },
      includes: [Review],
    });
    res.status(200).send(product);
  } catch (error) {
    next(error);
  }
});

//post routes
router.post("/", async (req, res, next) => {
  try {
    const newProductData = req.body;
    const newProduct = await Product.create(newProductData);
    res.status(201).send(newProduct);
  } catch (error) {
    next(error);
  }
});

//put routes

router.put("/:id", async (req, res, next) => {
  try {
    const updateData = req.body;
    const { id } = req.params;

    const productToBeUpdated = await Product.findByPk(id);
    const editedProduct = await productToBeUpdated.update(updateData);

    res.send(editedProduct.dataValues).status(204);
  } catch (error) {
    next(error);
  }
});

//delete routes
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const productToBeDeleted = await Product.findByPk(id);
    await productToBeDeleted.destroy();
    res.send(productToBeDeleted).status(204);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
