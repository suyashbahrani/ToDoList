const express = require("express");
const bodyParser = require("body-parser");
// const getDate = require("./date");

const _ = require("lodash");

const app = express();

// let items = [];
// let workitems = [];

const mongoose = require("mongoose");

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));


// mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});


// from atlas to connect to my application
mongoose.connect("mongodb+srv://admin-suyash:test123@cluster0.4drnk.mongodb.net/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({

    name: "Welcome to your todolist!" 
 });
    
const item2 = new Item({
    name: "Hit the button to aff a new item."
    });
    
const item3 = new Item({
    name: "<- Hit this to delete an item." 
});

const defaultItems = [item1, item2, item3];

// new schema for dynamic routing
const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {
    // let day = getDate();
    Item.find({}, function(err, foundItems){
        if (foundItems.length === 0){
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("You have successfully saved defaultItems on DB");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
        
    });
    
});

app.post("/", function(req, res) {
    let itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item ({
        name: itemName
    });

    if (listName === "Today"){
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }

    

    // redirect to "/" then find and update
    


    // // console.log(req.body.list)
    // if (req.body.list === "Work") {
    //     workitems.push(item);
    //     res.redirect("/work");
    // }
    // else {
    //     items.push(item);
    //     res.redirect("/");
    // }


    // items.push(item);
    // res.redirect("/");
    //console.log(item)
});

app.post("/delete", function(req, res){
    const listName = req.body.listName;
    const checkedItemId = req.body.checkboxname;

    if (listName === "Today"){
        Item.findByIdAndRemove(checkedItemId, function(err){
            if(!err){
                console.log("Succesfully deleted checked item");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        });
    }


    
});

// app.get("/work", function(req,res){
//     res.render("list", {listTitle: "Work", newListItems: workitems});
// });

// create dynamic route
// localhost:300/Home or localhost:3000/work

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if (!foundList){
                // create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                // show an existing lists
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items})
            }
        }
    });

    
    
});


// for local
// app.listen(3001, function() {
//     console.log("Server running on 3001");
// });

// for local and heroku
let port = process.env.PORT;
if(port == null || prot ==""){
    port = 3000;
}

app.listen(port, function(){
    console.log("Server has started on port 3000");
});