const express = require("express");
const { verify, login } = require("../utils/passport");

const usersController = require("../controllers/UsersController");

const router = express.Router();

router.post("/", usersController.createUser);
router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUser);
router.post("/login", login);
// router.put("/:id", usersController.updateUser);
router.patch("/:id", usersController.patchUser);
router.post("/verify", verify);
router.post("/register", usersController.registerUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;
