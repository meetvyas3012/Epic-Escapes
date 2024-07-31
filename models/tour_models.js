const mongoose=require("mongoose");
const slugify = require("slugify");
const validator=require("validator");
const User = require("./user_model");

const tour_schema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,"name missing"],
        unique:true,
        trim:true
    },
    secretTour:Boolean,
    duration:{
        type:Number,
        required:[true,"duration missing"]
    },
    maxGroupSize:{
        type:Number,
        required:[true,"must have a group size"]
    },
    difficulty:{
        type:String,
        required:[true,"must have difficulty"],
        enum:{
            values:["easy","medium","difficult"],
            message:"Difficulty must be either easy,medium or difficult"
        }
    },
    ratingsAverage:{
        type:Number,
        default:4.5
    },
    ratingsQuantity:{
        type:Number,
        default:0,
        validate:{
            validator:function(val){
                return val>=0;
            },
            message:"Quantity should be a positive number"
        }
    },
    price:{
        type:Number,
        required:[true,"price missing"]
    },
    slug:String,
    price_discount:Number,
    summary:{
        type:String,
        trim:true,
        required:[true,"summary required"]
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        required:[true,"image required"]
    },
    images:[String],
    created_at:{
        type:Date,
        default:Date.now(),
        select:false
    },
    startDates:[Date],
    startLocation:{
        type:{
            type:String,
            default:"Point",
            enum:["Point"]
        },
        coordinates:[Number],
        address:String,
        description:String
    },
    locations:[
        {
            type:{
                type:String,
                default:"Point",
                enum:["Point"]
            },
            coordinates:[Number],
            address:String,
            description:String,
            day:Number
        }
    ],
    guides:[{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    }],
    reviews:[
        {
            type:String,
            ref:"Review"
        }
    ]
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
}
);

tour_schema.index({ price:1,ratingsAverage:-1 });
tour_schema.index({ slug:1 });
tour_schema.index({ startLocation:"2dsphere" });

tour_schema.virtual("durationWeeks").get(function(){
    return this.duration/7;
});

tour_schema.pre("save",function(next){
     
    this.slug=slugify(this.name,{ lower:true });
    next();
});

// tour_schema.pre("save",function(next){
//     console.log("will save the document");
//     next();
// });

// tour_schema.post("save",function(doc,next){
//     console.log(doc);
//     next();
// });

tour_schema.pre(/^find/,function(next){

    this.find({ secretTour: { $ne:true } });

    this.start=Date.now();
    next();
});

// tour_schema.post(/^find/,function(docs,next){
    
//     console.log(docs);
//     console.log(`Query took ${Date.now()-this.start} ms`);
//     next();
// });

// tour_schema.pre("aggregate",function(next){

//     this.pipeline().unshift({ $match:{ secretTour: { $ne:true } } });

//     console.log(this.pipeline());
//     next();
// });

tour_schema.pre(/^find/,function(next){
    
    this.populate({
        path:"guides",
        select:"-__v -passwordChangedAt"
    });

    next();
});

// tour_schema.pre("save",async function(next){

//     const guides_promise=this.guides.map(async el => await User.findById(el));
//     this.guides=await Promise.all(guides_promise);

//     next();
// });

tour_schema.virtual("review",{
    ref:"Review",
    localField:"_id",
    foreignField:"tour",
});

const Tour=mongoose.model('Tour',tour_schema);

module.exports=Tour;