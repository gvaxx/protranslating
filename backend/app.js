const app = require("express")();
const express = require("express");
const expressJSDocSwagger = require("express-jsdoc-swagger");
const mongoose = require("mongoose");
const routes = require("./components/routes/index");
require("dotenv").config();
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 7000;
const cors = require("cors");
//Extended

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for test",
    version: "1.0.0",
  },
  servers: [{ url: `http://${host}:${port}` }],
  baseDir: __dirname,
  filesPattern: "./**/*.js",
  swaggerUIPath: "/api-docs",
};

expressJSDocSwagger(app)(swaggerDefinition);

const dbURI = process.env.DB_URI;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((result) => console.log("Mongoose database connected"))
  .catch((error) => console.log(error));

// app.use(bodyParser);
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
app.use(cors());
app.use("/", routes);

app.listen(port, host, function() {
  console.log(`Server listens http://${host}:${port}`);
});
