const { Router } = require("express");
const userRouter = new Router();

userRouter.get("/");
userRouter.get("/:id");
userRouter.post("/test");
userRouter.post("/add-user");
userRouter.put("/variant");
