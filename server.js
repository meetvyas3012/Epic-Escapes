const mongoose=require("mongoose");
const dotenv=require("dotenv");

dotenv.config({path:"D:/STUDY/NODE JS/natours/config.env"});

const app=require("./app");

mongoose.connect(process.env.URL,{}).then(con =>{
    console.log("Connected!!");
});

const server=app.listen(3000,() => {
    console.log("listening....");
});

process.on("uncaughtException",err => {

    console.log("UNCAUGHT EXCEPTION ... SHUTTING DOWN...");
    console.log(err.name,err.message);
   
    server.close(() =>{
        process.exit(1);
    })
});

process.on("unhandledRejection",err => {

    console.log("UNHANDLED REJECTION ... SHUTTING DOWN...");
    console.log(err.name,err.message);

    server.close(() =>{
        process.exit(1);
    })
});