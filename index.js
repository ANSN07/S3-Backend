const express = require("express");
const routes = require("./routes");
require("dotenv").config();

const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/s3/file", routes);
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
