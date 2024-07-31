const mongoose=require("mongoose");

const booking_schema=new mongoose.Schema({

    tour:{
        type:mongoose.Schema.ObjectId,
        required:[true,"Booking must hace tour name"],
        ref:"Tour"
    },
    user:{
        type:mongoose.Schema.ObjectId,
        required:[true,"Booking must hace user name"],
        ref:"User"
    },
    price:{
        type:Number,
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    paid:{
        type:Boolean,
        default:true
    }
});

booking_schema.pre(/^find/,function(next){

    this.populate("user").populate({
        path:"tour",
        seelct:"name"
    })

    next();
});

const booking=mongoose.model('Booking',booking_schema);

module.exports=booking;