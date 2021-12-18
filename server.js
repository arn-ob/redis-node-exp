const express = require("express");
const Redis = require("ioredis");
const axios = require('axios');

const app = express();
const redis = new Redis(6379);

const cache = (req, res, next) => {
  const { id } = req.params;
  redis.get(id, (error, result) => {
    if (error) throw error;
    if (result !== null) {
      return res.json(JSON.parse(result));
    } else {
      return next();
    }
  });
};

app.get("/:id", cache, async (req, res) => {
  const { id } = req.params;
  const data = await (await axios.default.get(`https://jsonplaceholder.typicode.com/photos?albumId=${id}`)).data;
  redis.set(id, JSON.stringify(data), "ex", 15);
  return res.json(data);
});

app.listen(3001, () => console.log("Testing Redis"));