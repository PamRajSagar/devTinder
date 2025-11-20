const express = require("express");

const connectDB = require("./config/database");

const app = express();

const User = require("./models/user");

const { validateSignUpData } = require("./utils/validation");

const bcrypt = require("bcrypt");

const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");



app.use(express.json());

app.use(cookieParser());



//posting date to database

app.post("/signup", async (req, res) => {

    //validation of data
    validateSignUpData(req);

    //Encrypt the password

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    //creating a new instance of the user model
    const user = new User({
        firstName, lastName, emailId, password: passwordHash
    });


    try {
        await user.save();

        //after saving we need to send respons eback

        res.send("User added successfully")


    } catch (err) {


        res.statusCode(400).send("Error :" + err.message);

    }

});

//getting data form databse
//Get user by eamil

//login api usimg email and password

app.post("/login", async (req, res) => {


    try {

        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });

        if (!user) {

            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {

            //create a JWT token .
            //Add the token to cookie and send the response back to the user

            const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$790");
            console.log(token);

            //Add the token to cookie and send the response back to the user

            res.cookie("token", token)

            res.send("Login Successfully");
        }
        else {

            throw new Error("Invalid credentials")
        }

    } catch (err) {

        res.status(400).send("Error:" + err.message)

    }
})


app.get("/profile", async (req, res) => {


    try {
        const cookies = req.cookies;

        const { token } = cookies;

        //if we didnot get an token

        if (!token) {

            throw new Err
            or("invalid token");
        }

        //validate my token

        const decodedMessage = await jwt.verify(token, "DEV@TINDER$790");

        console.log(decodedMessage);

        const { _id } = decodedMessage;
        console.log("logged in user is:" + _id);


        const user = await User.findById(_id);


        if (!user) {

            throw new Error("user doesnot exit")
        }
        res.send(user);

        console.log(cookies);

        res.send("Reading cookies")
    }
    catch (err) {

        res.status(400).send("Error:" + err.message)
    }
})





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

        res.status(400).send("Error:" + err.message)
    }

});




//Feed API-GET/feed-get all the users from the database

app.get("/feed", async (req, res) => {

    try {

        const users = await User.find({});
        res.send(users);

    } catch (error) {


        res.status(400).send("Error:" + err.message)

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

        res.status(400).send("Error:" + err.message)



    }
});


//this api update the data of user in dattabase

app.patch("/user/:userId", async (req, res) => {

    const userId = req.params?.userId;

    const data = req.body;



    try {


        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];


        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));


        if (!isUpdateAllowed) {

            throw new Error("update not allowed");
        }

        if (data?.skills.length > 10) {

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



