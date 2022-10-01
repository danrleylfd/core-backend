const { Router } = require("express");
const routes = Router();

const authMiddleware = require("../middlewares/auth");
const readMany = require("../views/sample/readMany");

routes.use(authMiddleware);

routes.get("/", readMany);

module.exports = app => app.use("/samples", routes);
