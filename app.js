const express=require("express");
const fs=require("fs");
const morgan=require("morgan");
const rate_limiter=require("express-rate-limit");
const helmet=require("helmet");
const mongo_sanitize=require("express-mongo-sanitize");
const xss=require("xss-clean");
const hpp=require("hpp");
const path=require("path");
const pug=require("pug");
const cookie_parser=require("cookie-parser");
const compression=require("compression");

const tour_router=require("D:/STUDY/NODE JS/natours/routers/tour_router");
const user_router=require("D:/STUDY/NODE JS/natours/routers/user_router");
const view_router=require("D:/STUDY/NODE JS/natours/routers/view_router");
const review_router=require("D:/STUDY/NODE JS/natours/routers/review_router");
const booking_router=require("D:/STUDY/NODE JS/natours/routers/booking_router");
const app_error=require("D:/STUDY/NODE JS/natours/controllers/error_controller.js");
const global_error=require("D:/STUDY/NODE JS/natours/utils/global_error.js");

const { whitelist } = require("validator");

const app=express();

app.set("view engine","pug");
app.set("views",path.join(__dirname,"views"));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://api.mapbox.com',"https://fonts.googleapis.com/"],
      styleSrc: ["'self'", 'https://api.mapbox.com',"https://fonts.googleapis.com/"],
      imgSrc: ["'self'", 'data:', 'https://api.mapbox.com'],
      connectSrc: ["'self'", 'https://api.mapbox.com',"https://fonts.googleapis.com/"],
      // Add other directives as needed
    },
  })
);

app.use(mongo_sanitize());

app.use(xss());

app.use(hpp({

    whitelist:[
        "duration",
        "ratingsQuantity",
        "ratingsAverage",
        "maxGroupSize",
        "difficulty",
        "price"
    ]
}))

app.use(express.json());

if (process.env.NODE_ENV==="development")
{
    app.use(morgan("dev"));
}

const limiter=rate_limiter({
    max:100,
    windowMs:60*60*1000,
    message:"Too many requests from same IP.Try again after 1 hour."
})

app.use("/api",limiter);


app.use(express.static(path.join(__dirname,"public")));
app.use(cookie_parser());

// app.use((req,res,next) => {
//     console.log("middleware");
//     next();
// })

// app.get('/',(req,res) => {

//     res
//     .status(200)
//     .json({
//         message:"hello",
//         app:"natours"
//     });
// });

// app.post('/',(req,res) => {
//     res.send("working");
// })

// app.get("/api/v1/tours",get_all_tours);

// app.get("/api/v1/tours/:id",get_tours_by_id)

// app.patch("/api/v1/tours/:id",update_tour);

// app.delete("/api/v1/tours/:id",delete_tour);

// app.post("/api/v1/tours",add_tour);
app.use(compression());

app.use("/",view_router);
app.use("/api/v1/bookings",booking_router);
app.use("/api/v1/tours",tour_router);
app.use("/api/v1/users",user_router); 
app.use("/api/v1/reviews",review_router); 
app.all("*",(req,res,next) => {

    next(new app_error(`Entered url:${req.originalUrl} is wrong`,404));
})

app.use(global_error);

module.exports=app;