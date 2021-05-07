const router = require("express").Router();
const User = require("../../db/models/User");
const Order = require("../../db/models/Order");

async function requireToken(req, res, next) {
  try {
    const token = req.headers.authorization;
    const user = await User.byToken(token);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
//secured
router.get("/", requireToken, async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
});
//secured
router.get("/:id", requireToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

//post routes
//secured
router.post("/", requireToken, async (req, res, next) => {
  try {
    //change authorization key to something cryptic
    if (req.user.role === "GUEST") {
      const { first, last, email, password } = req.body;
      const newUser = await User.create({
        first,
        last,
        email,
        password,
        role: "AUTHENTICATED",
      });
      res.status(201).send(newUser);
    }
  } catch (error) {
    next(error);
  }
});

//put routes
router.put("/:id", requireToken, async (req, res, next) => {
  try {
    if (req.user.id === req.params.id || req.user.isAdmin === true) {
      const updateData = req.body;
      const { id } = req.params;
      const userToBeUpdated = await User.findByPk(id);
      const editedUser = await userToBeUpdated.update(updateData);
      res.send(editedUser.dataValues).status(204);
    }
  } catch (error) {
    next(error);
  }
});

//delete routes
router.delete("/:id", requireToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    // const { id } = req.user.id;
    const userToBeDeleted = await User.findByPk(id);

    await userToBeDeleted.destroy();
    res.send(userToBeDeleted).status(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
