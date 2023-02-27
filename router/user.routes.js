const { Router } = require("express");
const userRouter = new Router();
const {
  getAllUsers,
  getUserByUuidController,
  addUser,
  insertExperiment,
  getUserExperiment,
} = require("../controller/user.controller");

// Get user by uuid
userRouter.get("/:uuid", getUserByUuidController);

// Get experiment by experiment id
userRouter.get("/experiment/:experimentId", getUserExperiment);

// Create new user
userRouter.post("/", addUser);

// Add experiment to user
userRouter.put("/:uuid", insertExperiment);

userRouter.get("/", getAllUsers)

module.exports = { userRouter };
