const mongoose=require("mongoose");
const fs=require("fs");
const dotenv=require("dotenv");
const tour=require("D:/STUDY/NODE JS/natours/models/tour_models.js");
const review=require("D:/STUDY/NODE JS/natours/models/review_model.js");
const user=require("D:/STUDY/NODE JS/natours/models/user_model.js");

dotenv.config({path:"D:/STUDY/NODE JS/natours/config.env"});

mongoose.connect(process.env.URL,{}).then(con =>{
    console.log("Connected!!");
});

const tours=JSON.parse(fs.readFileSync("D:/STUDY/NODE JS/natours/dev-data/data/tours.json"));
const reviews=JSON.parse(fs.readFileSync("D:/STUDY/NODE JS/natours/dev-data/data/reviews.json"));
const users=JSON.parse(fs.readFileSync("D:/STUDY/NODE JS/natours/dev-data/data/users.json"));

const import_data=async () =>{

    try{
        await tour.create(tours,{validateBeforeSave:false});
        await review.create(reviews);
        await user.create(users,{validateBeforeSave:false});
        console.log("successfully imported");
    }catch(err){
        console.log(err);
    }
}

const delete_data=async () =>{

    try{
        await tour.deleteMany();
        await user.deleteMany();
        await review.deleteMany();
        console.log("successfully deleted");
    }catch(err){
        console.log(err);
    }
}

if (process.argv[2]==="--import")
    {
        import_data();
    }
else if (process.argv[2]==="--delete")
    {
        delete_data();
    }    

console.log(process.argv);