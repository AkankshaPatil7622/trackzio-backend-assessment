const express = require("express");
const config = require('./config/env.config');

const connectDB = require('./config/db');

const app = express();
app.use(express.json());

app.listen(config.port, (req, res) => {
  console.log("server is running on port ", config.port);
  connectDB();
});
