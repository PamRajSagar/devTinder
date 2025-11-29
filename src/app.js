const express = require("express");

const connectDB = require("./config/database");

const app = express();

const cookieParser = require("cookie-parser");





app.use(express.json());

app.use(cookieParser());

//importing all routers

const authRouter =require("./routes/auth");

const profileRouter=require("./routes/profile");

const requestRouter = require("./routes/request")

//we are using all the routes


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

connectDB().then(() => {

    console.log("Database connection esatbalished");


    //our server is listening on port 7777
    app.listen(7777, () => {

        console.log("server is successfully listeningh on port 7777");
    });

}).catch(err => {

    console.log("Database cannot be connected")
});



