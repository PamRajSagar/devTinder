const express = require("express");
const authRouter = express.Router();


const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");



//signup api

authRouter.post("/signup", async (req, res) => {

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


//login api

authRouter.post("/login", async (req, res, next) => {


    try {

        const { emailId, password } = req.body;

        const user = await User.findOne({ emailId: emailId });

        if (!user) {

            throw new Error("Invalid credentials");
        }

        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {



            const token = await user.getJWT();



            res.cookie("token", token, { expires: new Date(Date.now() + 8 + 3600000) });

            res.send("Login Successfully");
        }
        else {

            throw new Error("Invalid credentials")
        }

    } catch (err) {


        res.status(400).send("Error:" + err.message)

    }
});




module.exports = authRouter;