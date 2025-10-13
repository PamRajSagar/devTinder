const express = require("express");

const connectDB = require("./config/database");

const app = express();

const User = require("./models/user")


app.use(express.json());



//posting date to database

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

//getting data form databse
//Get user by eamil




app.get("/user", async (req, res) => {

    const userEmail = req.body.emailId;



    try {

        const user = await User.find({ emailId: userEmail });
        if (user.length === 0) {

            res.status(404).send("User is not found");
        } else {
            res.send(user);

        }

    }
    catch (err) {

        res.status(400).send("something went wrong")
    }

});




//Feed API-GET/feed-get all the users from the database

app.get("/feed", async (req, res) => {

    try {

        const users = await User.find({});
        res.send(users);

    } catch (error) {


        res.status(400).send("something went wrong");

    }


});

//this api to delete user form database

app.delete("/user", async (req, res) => {

    const userId = req.body.userId;

    try {


        const user = await User.findByIdAndDelete(userId);

        res.send("user deleted successfully");
    }
    catch (err) {

        res.status(400).send("something went wrong");



    }
});


//this api update the data of user in dattabase

app.patch("/user/:userId", async (req, res) => {

    const userId = req.params?.userId;

    const data = req.body;



    try {


        const ALLOWED_UPDATES = [ "photoUrl", "about", "gender", "age", "skills"];


        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));


        if (!isUpdateAllowed) {

            throw new Error("update not allowed");
        }

        if(data?.skills.length>10){

            throw new Error("Skills cannot be more than 10")
        };

        const user = await User.findByIdAndUpdate({ _id: userId }, data, { returnDocument: "after", runValidators: true });

        console.log(user);

        res.send("User updated successfully");
    } catch (err) {
        res.status(400).send("UPDATE FAILED:" + err.message);
    }


})




connectDB().then(() => {

    console.log("Database connection esatbalished");


    //our server is listening on port 7777
    app.listen(7777, () => {

        console.log("server is successfully listeningh on port 7777");
    });

}).catch(err => {

    console.log("Database cannot be connected")
});



