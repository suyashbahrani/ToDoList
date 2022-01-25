const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.send("Hello");
});


app.listen(3001, function() {
    console.log("Server running on 3001");
});