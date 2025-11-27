const express = require("express");

const connectDB = require("./config/database");

const app = express();

const User = require("./models/user");

const { validateSignUpData } = require("./utils/validation");

const bcrypt = require("bcrypt");

const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");

const { userAuth } = require("./middlewares/auth");





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

app.post("/login", async (req, res, next) => {


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

            const token = await jwt.sign({ _id: user._id },"DEV@TINDER$790",{expiresIn:"1d",});
            console.log(token);

            //Add the token to cookie and send the response back to the user

            res.cookie("token", token,{expires:new Date(Date.now()+8+3600000)});

            res.send("Login Successfully");
        }
        else {

            throw new Error("Invalid credentials")
        }

    } catch (err) {
        

        res.status(400).send("Error:" + err.message)

    }
})


app.get("/profile", userAuth, async (req, res) => {


    try {



        const user = req.user;
        res.send(user);


    }
    catch (err) {

        res.status(400).send("Error:" + err.message)
    }
});


app.post("/sendConnectionRequest",userAuth,async(req,res)=>{

const user = req.user;
    //sending a connection request

    console.log("sending a connection request");

    res.send(user.firstName + "  sent the connection request")
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



