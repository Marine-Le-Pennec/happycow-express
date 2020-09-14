// Express
const express = require("express");
const app = express();
// FORMIDABLE
const formidable = require("express-formidable");
app.use(formidable());
// DOTENV
require("dotenv").config();
// CORS
const cors = require("cors");
app.use(cors());
// Mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Appel du modele et de la route User et users
require("./Models/User");
const user = require("./routes/user");
app.use(user);

app.listen(process.env.PORT, () => console.log("Server started"));
