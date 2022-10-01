const { Router } = require("express");
const routes = Router();

const authMiddleware = require("../middlewares/auth");
const createOne = require("../views/sample/createOne");
const readMany = require("../views/sample/readMany");
const readOne = require("../views/sample/readOne");

routes.use(authMiddleware);

routes.post("/", createOne);

routes.get("/", readMany);

routes.get("/:id", readOne);

module.exports = app => app.use("/samples", routes);
