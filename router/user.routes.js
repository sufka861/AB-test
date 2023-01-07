const { Router } = require("express");
const userRouter = new Router();
const {
  getAllUsers,
  checkAttributes,
  getUserByUuid,
  setCookie,
  getCookie,
  addUser,
  insertExperiment,
  getUserExperiment,
} = require("../controller/user.controller");

// Get user by uuid
userRouter.get("/:uuid", getUserByUuid);

// Get experiment by experiment id
userRouter.get("/experiment/:experimentId", getUserExperiment);

// Set a cookie
userRouter.get("/set-cookie", setCookie);

// Get cookie values
userRouter.get("/cookie", getCookie);

// Create new user
userRouter.post("/", addUser);

// Add experiment to user
userRouter.put("/:uuid", insertExperiment);

userRouter.get("/", getAllUsers)

module.exports = { userRouter };
