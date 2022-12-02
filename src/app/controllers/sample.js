const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");

const routes = Router();
routes.use(authMiddleware);

const createOne = require("../views/sample/createOne");
const readMany = require("../views/sample/readMany");
const readOne = require("../views/sample/readOne");
const updateOne = require("../views/sample/updateOne");
const deleteOne = require("../views/sample/deleteOne");

routes.post("/", createOne);

routes.get("/", readMany);

routes.get("/:id", readOne);

routes.put("/:oldName", updateOne);

routes.delete("/:name", deleteOne);

module.exports = app => app.use("/samples", routes);
