const express = require("express");

const connectDB = require("./config/database");

const app = express();

const User = require("./models/user")


app.use(express.json());

app.post("/signup", async (req, res) => {

    console.log(req.body)

    const user = new User(req.body);




    try {
        await user.save();

        //after saving we need to send respons eback

        res.send("User added successfully")


    } catch (err) {


        res.statusCode(400).send("Error saving the user:" + err.message);

    }

});



//Get user by eamil


app.get("/user", async (req, res) => {

    const userEmail = req.body.eamilId;



    try {

        const user = await User.find({ emailId: userEmail });

        res.send(user);
    }
    catch (err) {

        res.status(400).send("something went wrong")
    }

});

//Feed API-GET/fedd-get all the users from the database

app.get("/feed", (req, res) => {



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



