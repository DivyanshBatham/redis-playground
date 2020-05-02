const express = require("express");

const indexRouter = require("./router/index");
const usersRouter = require("./router/users");

const app = express();

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.listen(1337, () => console.log("Listening to port 1337"));
