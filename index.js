const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/test', {useNewUrlParser: true}).then(()=>{
    app.use(express.urlencoded({extended: true}))
    app.use(express.json());
    app.use("/api", routes);
 
});
  

  module.exports = app
