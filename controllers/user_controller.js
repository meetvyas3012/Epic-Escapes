const User = require("../models/user_model");
const Api_features = require("../utils/api_features");
const catch_async = require("../utils/catch_async");
const handler=require("./handler_factory");
const multer=require("multer");
const App_error = require("../controllers/error_controller");
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

exports.resize_user_photo=catch_async(async (req,res,next) => {

    if (!req.file) next();

    req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500,500)
        .toFormat("jpeg")
        .jpeg({quality:90})
        .toFile(`public/img/users/${req.file.filename}`);

    next(); 
});

exports.upload_user_photo=upload.single("photo");

const filtered_body=(obj, ... allowed_fields) => {

    const new_obj={};

    Object.keys(obj).forEach(el => {

        if (allowed_fields.includes(el)) new_obj[el]=obj[el];
    });

    return new_obj;
};

exports.get_me=(req,res,next) => {

    req.params.id = req.user.id;
    next();
}

exports.update_user_data=catch_async(async (req,res,next) => {

    if (req.body.password || req.body.confirm_password)
    {
        return next(new App_error("Use different route for updating password",400));
    }

    const body=filtered_body(req.body,"name","email");

    if (req.file) body.photo=req.file.filename;

    const updated_user=await User.findByIdAndUpdate(req.user.id,body,{
        new:true,
        runValidators:true
    });

    res.status(200).json({
        status:"success",
        data:{
            user:updated_user
        }
    });
});

exports.delete_user=handler.delete_one(User);
exports.get_all_users=handler.get_all(User);
exports.get_users_by_id=handler.get_one(User);