const mongoose=require("mongoose");
const Tour=require("./tour_models");

const review_schema=new mongoose.Schema(
    {
        review:{
            type:String,
            required:[true,"Review can be empty"]
        },
        rating:{
            type:Number,
            min:1,
            max:5
        },
        createdAt:{
            type:Date,
            default:Date.now()
        },
        tour:{
            type:mongoose.Schema.ObjectId,
            ref:"Tour",
            required:[true,"Review must belong to a tour."]
        },
        user:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
            required:[true,"Review must belong to a user."]
        }
    },
    {
        toJSON:{ virtuals:true },
        toObject:{ virtuals:true }
    }
);

review_schema.pre(/^find/,function(next){
    
    this.populate({
        path:"tour",
        select:"name"
    }).populate({
        path:"user",
        select:"name photo"
    });

    next();
})

review_schema.statics.calcualte_avg_rating=async function(tour_id){

    const stats=await this.aggregate([

        {
            $match:{tour:tour_id}
        },
        {
            $group:{
                _id:"$tour",
                n_rating:{ $sum:1 },
                avg_rating:{ $avg:"$rating" }
            }
        }
    ]);

    if (stats.length>0)
    {
        await Tour.findByIdAndUpdate(tour_id,{

            ratingsQuantity:stats[0].n_rating,
            ratingsAverage:stats[0].avg_rating
        })
    }
    else
    {
        await Tour.findByIdAndUpdate(tour_id,{

            ratingsQuantity:0,
            ratingsAverage:0
        })
    }
}

review_schema.post("save",function(){

    this.constructor.calcualte_avg_rating(this.tour);
})

review_schema.pre(/^findOneAnd/,async function(next){

    this.r=await this.model.findOne(this.getQuery());
    next();
})

review_schema.post(/^findOneAnd/,async function(){

    await this.r.constructor.calcualte_avg_rating(this.r.tour);
})

review_schema.index({ tour:1,user:1 },{ unique:true });

const Review=mongoose.model("Review",review_schema);

module.exports=Review;