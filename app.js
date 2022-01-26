const express = require("express");
const bodyParser = require("body-parser");

const app = express();

var items = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extend: true}));

app.get("/", function(req, res) {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    var day = today.toLocaleDateString("en-US", options);
    res.render("list", {kindOfDay: day, newListItems: items})
});

app.post("/", function(req, res) {
    var item = req.body.newItem;
    items.push(item);
    res.redirect("/");
    //console.log(item)
});

app.listen(3001, function() {
    console.log("Server running on 3001");
});