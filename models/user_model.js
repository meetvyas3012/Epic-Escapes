const { default: mongoose } = require("mongoose");
const validator = require("validator");
const bcrypt=require("bcrypt");
const crypto=require("crypto");

const user_schema=new mongoose.Schema({

    name:
    {
        type:String,
        required:[true,"Name required"],
        trim:true
    },
    email:
    {
        type:String,
        trim:true,
        required:[true,"email missing"],
        validate:[validator.isEmail,"enter correct email"],
        unique:true,
        lowercase:true
    },
    photo:
    {
        type:String,
        trim:true,
        default:"default.jpg"
    },
    password:
    {
        type:String,
        trim:true,
        required:[true,"password missing"],
        validate:[validator.isStrongPassword,"enter strong password"],
        select:false
    },
    confirmPassword:
    {
        type:String,
        trim:true,
        required:[true,"confirm password missing"],
        validate:{
            validator:function(val){
                return val==this.password;
            },
            message:"Confirm password should be same as password"
        }
    },
    roles:
    {
        type:String,
        enum:["user","guide","lead-guide","admin"],
        default:"user"
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    resetPasswordExpiresIn:Date,
    active:{
        type:Boolean,
        default:true,
        select:false,
    }
});

user_schema.pre("save",async function(next){

    if (!this.isModified("password")) return next();

    this.password=await bcrypt.hash(this.password,12);
    this.confirmPassword=undefined;

    next();
});

user_schema.methods.check_password=async function(entered_pass,saved_pass){
    
    return await bcrypt.compare(entered_pass,saved_pass);
}

user_schema.methods.check_password_change=function(jwt_time_stamp){

    if (this.passwordChangedAt)
    {
        const change_time=parseInt(this.passwordChangedAt.getTime()/1000,10);

        return jwt_time_stamp<change_time;
    }

    return false;
}

user_schema.methods.forgot_password_token=function(){

    const reset_token=crypto.randomBytes(32).toString("hex");

    this.passwordResetToken=crypto
        .createHash("sha256")
        .update(reset_token)
        .digest("hex");

    this.resetPasswordExpiresIn=Date.now()+10*60*1000;
    
    return reset_token;
};

user_schema.pre("save",function(next){

    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt=Date.now()-1000;

    next();
});

user_schema.pre(/^find/,function(next){

    this.find({ active:{$ne:false} });

    next();
});

const User=mongoose.model("User",user_schema);

module.exports=User;