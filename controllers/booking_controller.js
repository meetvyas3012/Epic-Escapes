const App_error = require("./error_controller");
const catch_async=require("D:/STUDY/NODE JS/natours/utils/catch_async.js");
const Api_features=require("D:/STUDY/NODE JS/natours/utils/api_features.js");
const Tour = require("D:/STUDY/NODE JS/natours/models/tour_models.js");
const Booking = require("D:/STUDY/NODE JS/natours/models/booking_model.js");
const handler=require("./handler_factory");
const stripe=require("stripe")(process.env.STRIPE_SECRET_KEY)

exports.get_checkout_session=catch_async(async(req,res,next) => {

    const tour=await Tour.findById(req.params.tour_id);

    const session=await stripe.checkout.sessions.create(
        {
            payment_method_types:["card"],
            mode:"payment",
            success_url:`${req.protocol}://${req.get("host")}?tour=${req.params.tour_id}&user=${req.user.id}&price=${tour.price}`,
            cancel_url:`${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
            customer_email:req.user.email,
            client_reference_id:req.params.tour_id,
            line_items:[{
                price_data:{
                    currency:"usd",
                    product_data:{
                        name:tour.name,
                        description:tour.summary,
                        images:[`http://127.0.0.1:3000/img/tours/${tour.imageCover}`]
                    },
                    unit_amount:tour.price*100,
                },
                quantity:1,
            }]
            
        }
    );

    res.status(200).json({
        status:"success",
        session
    })

});

exports.create_bookings_checkout=catch_async(async (req,res,next) => {


    const {tour,user,price}=req.query;

    if (!tour && !user && !price) return next();

    await Booking.create({user,price,tour});

    res.redirect(req.originalUrl.split("?")[0]);

});

exports.get_my_tours=catch_async(async(req,res,next) =>{

    const bookings=await Booking.find({ user:req.user.id });

    const tour_ids=bookings.map(el => el.tour);
    const tours=await Tour.find({ _id: { $in:tour_ids } });

    res.status(200).render("overview",{
        title:"My Tours",
        tours
    })
});

exports.get_all_bookings=handler.get_all(Booking);
exports.get_booking_by_id=handler.get_one(Booking);
exports.create_booking=handler.create_one(Booking);
exports.delete_booking=handler.delete_one(Booking);
exports.update_booking=handler.update_one(Booking);