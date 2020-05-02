const express = require("express");
const axios = require("axios");

const indexRouter = express.Router();

indexRouter.get("/", (req, res, next) => {
  res.send("hello");

  //   GET /users/:username/repos
});

module.exports = indexRouter;
