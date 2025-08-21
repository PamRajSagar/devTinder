const express = require("express");

const connectDB = require("./config/database");

const app = express();

const User = require("./models/user")


app.use(express.json());

app.post("/signup", async (req, res) => {

    console.log(req.body)

 

    try {
        await user.save();

        //after saving we need to send respons eback

        res.send("User added successfully")


    } catch (err) {


        res.statusCode(400).send("Error saving the usder:" + err.message);

    }

});


connectDB().then(() => {

    console.log("Database connection esatbalished");


    //our server is listening on port 7777
    app.listen(7777, () => {

        console.log("server is successfully listeningh on port 7777");
    });

}).catch(err => {

    console.log("Database cannot be connected")
});



