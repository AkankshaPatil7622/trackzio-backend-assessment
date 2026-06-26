const express = require("express");
const config = require('./config/env.config');

const connectDB = require('./config/db');
const errorHandler =  require('./middlewares/errorHandler');
const cartRoute = require('./routes/cartRoutes');


const app = express();
app.use(express.json());
app.use("/api/cart", cartRoute);




app.use(errorHandler);
app.listen(config.port, (req, res) => {
  console.log("server is running on port ", config.port);
  connectDB();
});
