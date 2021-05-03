const router = require("express").Router();
const Review = require("../../db/models/Review");
const User = require("../../db/models/User");

//get routes
router.get("/", async (req, res, next) => {
  try {
    const reviews = await Review.findAll();
    res.status(200).send(reviews);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const review = await Review.findByPk(req.params.id);
    res.status(200).send(review);
  } catch (error) {
    next(error);
  }
});

//post routes
router.post("/", async (req, res, next) => {
  try {
    const { userId, productId, title, description, rating } = req.body;
    const theUser = await User.findByPk(userId);
    const newReview = await Review.create({
      userId,
      productId,
      title,
      description,
      rating,
    });
    console.log("new review on the backend is: ", newReview);
    res.send({ newReview, user: theUser }).status(201);
  } catch (error) {
    next(error);
  }
});

//put routes

router.put("/:id", async (req, res, next) => {
  try {
    const updateData = req.body;
    const { id } = req.params;

    const reviewToBeUpdated = await Review.findByPk(id);
    const editedReview = await reviewToBeUpdated.update(updateData);

    res.send(editedReview.dataValues).status(204);
  } catch (error) {
    next(error);
  }
});

//delete routes
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviewToBeDeleted = await Review.findByPk(id);
    await reviewToBeDeleted.destroy();
    res.send(reviewToBeDeleted).status(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
