require("dotenv").config({ path: __dirname + "/../.env" });
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({ origin: "http://localhost:3333" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./app/controllers/index")(app);

app.listen(process.env.PORT);
