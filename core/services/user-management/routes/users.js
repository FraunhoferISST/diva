const express = require("express");

const usersController = require("../controllers/UsersController");

const router = express.Router();

router.post("/", usersController.createUser);
router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUser);
router.put("/:id", usersController.updateUser);
router.patch("/:id", usersController.patchUser);
router.post("/:id", usersController.patchUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;
