const Api_features = require("../utils/api_features");
const catch_async = require("../utils/catch_async");
const Tour = require("D:/STUDY/NODE JS/natours/models/tour_models.js");
const App_error = require("./error_controller");

exports.base=(req,res) => {

    res.status(200).render("base",{

        tour:"Forest Hicker",
        user:'Jonas'
    });
}

exports.overview=catch_async(async (req,res) => {

    const tours=await Tour.find();

    res.status(200).render("overview",{

        title:'All Tours',
        tours
    });
});

exports.tours=catch_async(async (req,res,next) => {

    const tour=await Tour.findOne({ slug:req.params.slug }).populate({
        path:"review",
        fields:"review rating"
    });

    if (!tour) {
        return next(new App_error('There is no tour with that name.', 404));
      }
    res.status(200).render("tour",{

        title:`${tour.name}`,
        tour
    });
});

exports.login=(req,res,next) =>{

    res.status(200).render("login",{

        title:"Login",
    })
}

exports.me=(req,res,next) => {

    res.status(200).render("account",{
        title:"Account"
    })
}
