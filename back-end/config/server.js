const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const serveIndex = require("serve-index");
const serveStatic = require("serve-static");





const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use('/ftp', express.static('public'), serveIndex('public', {'icons': true}))


var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));


// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// // database
// const db = require("./app/models");
// const Role = db.role;

// db.sequelize.sync();
// // force: true will drop the table if it already exists
// // db.sequelize.sync({force: true}).then(() => {
// //   console.log('Drop and Resync Database with { force: true }');
// //   initial();
// // });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
