const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    var today = new Date();
    var currentDay = today.getDay();
    var day = "";
    //0-6 sun-mon
    //render for ejs (name of file)
    //ejs have variable: value
    if (currentDay === 6 || currentDay === 0) {
        day = "Weekend";
    }
    else {
        day = "weekday";
    }
    res.render("list", {kindOfDay: day})
});


app.listen(3001, function() {
    console.log("Server running on 3001");
});