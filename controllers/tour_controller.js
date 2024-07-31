const App_error = require("./error_controller");
const Tour = require("D:/STUDY/NODE JS/natours/models/tour_models.js");
const tour=require("D:/STUDY/NODE JS/natours/models/tour_models.js");
const Api_features=require("D:/STUDY/NODE JS/natours/utils/api_features.js");
const catch_async=require("D:/STUDY/NODE JS/natours/utils/catch_async.js");
const handler=require("./handler_factory");
const multer=require("multer");
const sharp=require("sharp");

// const multer_storage=multer.diskStorage({

//     destination:(req,file,cb) => {
//         cb(null,"public/img/users")
//     },
//     filename:(req,file,cb) => {
//         const ext=file.mimetype.split("/")[1];
//         cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
//     }
// });

const multer_storage=multer.memoryStorage();

const multer_filter=(req,file,cb) => {

    if (file.mimetype.startsWith("image"))
    {
        cb(null,true);
    }
    else
    {
        cb(new App_error("Upload only image files",400),false);
    }
}

const upload=multer({ 
    storage:multer_storage,
    fileFilter:multer_filter
});

exports.upload_tour_images=upload.fields([
    {name:"imageCover",maxCount:1},
    {name:"images",maxCount:3}
]);

exports.resize_tour_images=catch_async(async (req,res,next) => {

    if (!req.files.imageCover || !req.files.images) return next();

    req.body.imageCover=`tour-${req.params.id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
        .resize(2000,1333)
        .toFormat("jpeg")
        .jpeg({quality:90})
        .toFile(`public/img/tours/${req.body.imageCover}`);

    req.body.images=[];
   console.log(req.params.id);
    await Promise.all(
        req.files.images.map(async (file,i) => {

            const filename=`tour-${req.params.id}-${Date.now()}-${i+1}.jpeg`;

            await sharp(file.buffer)
            .resize(2000,1333)
            .toFormat("jpeg")
            .jpeg({quality:90})
            .toFile(`public/img/users/${filename}`);

            req.body.images.push(filename);
        })
        )
        
    next(); 
});

// exports.missing_value=(req,res,next) => {

//     if (!req.body.name || !req.body.difficulty)
//     {
//         return res.status(400).json({
//             status:"fail",
//             message:"missing value"
//         });
//     }
//     next();
// }

// exports.check_id=(req,res,next,val) => {

//     console.log(val);

//     const id=req.params.id*1;
//     next();
// }




exports.top_tours=(req,res,next) => {
    req.query.limit='5';
    req.query.sort='-ratingsAverage,price';
    req.query.fields="name,price,ratingsAverage,summary,difficulty";
    next();
}

exports.get_tour_stats=catch_async( async(req,res) => {

        const stats=await Tour.aggregate([
            {
                $match:{ratingsAverage: { $gte:4.5 } }
            },
            {
                $group:{
                    _id: { $toUpper:"$difficulty" },
                    numTours:{ $sum:1 },
                    numRatings: { $sum:"$ratingsQuantity" },
                    avgRating: { $avg:"$ratingsAverage" },
                    avgPrice: { $avg:"$price" },
                    minPrice: { $min:"$price" },
                    maxPrice: { $max:"$price" },
                }
            },
            {
                $sort:{ avgPrice:1 }
            },
            // {
            //     $match:{ _id: { $ne:"EASY" } }
            // }
        ]);

        res.status(200).json({
            status:"success",
            data:{
                stats
            }
        })
});

exports.get_monthly_plan=catch_async(async (req,res) => {

    const year=req.params.year*1;

    const plan=await Tour.aggregate([
        {
            $unwind:"$startDates"
        },
        {
            $match:
            {
                startDates:
                {
                    $gte:new Date(`${year}-01-01`),
                    $lte:new Date(`${year}-12-31`),
                }
            }
        },
        {
            $group:
            {
                _id:{ $month :"$startDates" },
                numTourStarts:{ $sum:1 },
                tours:{ $push:"$name" }
            }
        },
        {
            $addFields:{ month:"$_id" }
        },
        {
            $project:{ _id:0 }
        },
        {
            $limit:12
        }
    ]);

    res.status(200).json({
        status:"success",
        data:{
            plan
        }
    })
});

exports.get_tours_within=catch_async(async function(req,res,next){

    const { distance,lat_lng,unit }=req.params;
    const [lat,lng]=lat_lng.split(",");

    if (!lat || !lng) 
    {
        next(new App_error("Enter latitute and longitude",404));
    }

    const radius=(unit=="mi") ? distance/3963.2 : distance/6378.1;

    const tours=await Tour.find({

        startLocation:{ $geoWithin:{ $centerSphere:[[lng,lat],radius] } }
    });

    res.status(200).json({
        status:"success",
        data:{
            data:tours
        }
    })

});

exports.get_distance=catch_async(async function(req,res,next){

    const { lat_lng,unit }=req.params;
    const [ lat,lng]=lat_lng.split(",");

    if (!lat || !lng)
    {
        next(new App_error("Enter latitute and longitude",404));
    }

    const multiplier=unit==="mi" ? 0.000621371 : 0.001;

    const dist=await Tour.aggregate([
        {
            $geoNear:
            {
                near:
                {
                    type:"Point",
                    coordinates:[lng*1,lat*1]
                },
                distanceField:"distance",
                distanceMultiplier:multiplier
            },
        },
        {
            $project:
            {
                distance:1,
                name:1
            }
        }
    ]);

    res.status(200).json({
        status:"success",
        data:{
            dist
        }
    })
})

exports.get_all_tours=handler.get_all(Tour);
exports.get_tours_by_id=handler.get_one(Tour,{path:"review"})
exports.update_tour=handler.update_one(Tour);
exports.delete_tour=handler.delete_one(Tour);
exports.add_tour=handler.create_one(Tour);