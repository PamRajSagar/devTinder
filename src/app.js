const express = require("express");

const app = express();

//request handler function for "/test"
app.use("/test",(req,res)=>{

    res.send("hello from the server-test")
});


//request handler function for "/hello"

app.use("/hello",(req,res)=>{

    res.send("hello from the server is -hello")
});



//request handler function for "/"
app.use("/",(req,res)=>{

    res.send("hello from the server is -slash")
});


//our server is listening on port 3000

app.listen(3000,()=>{

    console.log("server is successfully listeningh on port 3000");
});

//our server is listening on port 7777
app.listen(7777,()=>{

    console.log("server is successfully listeningh on port 7777");
});