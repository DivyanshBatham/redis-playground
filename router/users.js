const express = require("express");
const axios = require("axios");

const redis = require("redis");
const client = redis.createClient(6379);

const Router = express.Router();

const cache = {};

function cacheMiddleware(req, res, next) {
  const { username } = req.params;

  if (cache[username]) {
    console.log("Served from Cache");
    res.status(200).json(cache[username]);
  } else {
    next();
  }
}

function redisMiddleware(req, res, next) {
  const { username } = req.params;

  client.get(username, (err, data) => {
    if (err) throw err;

    if (data !== null) {
      console.log("Served from Redis");
      res.status(200).json(JSON.parse(data));
    } else {
      next();
    }
  });
}

Router.get("/:username", redisMiddleware, (req, res, next) => {
  console.log("Served from Endpoint");
  const { username } = req.params;

  axios
    .get(`https://api.github.com/users/${req.params.username}`)
    .then((response) => {
      if (response.status === 200) {
        const data = response.data;
        // console.log(data);

        res.status(200).json(data);

        // Adding Data to cache:
        // cache[data.login] = data;

        // Adding Data to redis:
        client.setex(username, 10, JSON.stringify(data));
      } else {
        console.error("Some Error Occured");
        res.status(500).send("Internal Server Error");
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

module.exports = Router;
