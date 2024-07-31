const User = require("../models/user_model");
const catch_async = require("../utils/catch_async");
const jwt=require("jsonwebtoken");
const App_error = require("./error_controller");
const {promisify}=require("util");
const Email= require("../utils/email");
const crypto=require("crypto");

const sign_token=id => {

    return jwt.sign(
        { id: id },
        process.env.JWT_SECRET_CODE,
        { expiresIn: "90d"}
    );
};

const create_send_token=(user,res,status_code) => {

    const token=sign_token(user._id);

    const cookie_options={
        expires:new Date(Date.now()+90*24*60*60*1000),
        httpOnly:true
    };

    if (process.env.NODE_ENV==="production") cookie_options.secure=true;

    res.cookie("jwt",token,cookie_options);
    
    user.password=undefined;

    res.status(status_code).json({
        status:"success",
        token
    })
};

exports.signup=catch_async(async (req,res,next) => {

    const new_user=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.confirmPassword,
        roles:req.body.roles
    });

    const url=`${req.protocol}://${req.get("host")}/me`;

    await new Email(new_user,url).send_welcome();

    create_send_token(new_user,res,201);
});

exports.login=catch_async( async (req,res,next) => {

    const { email,password } = req.body;

    if (!email || !password)
    {
        return next(new App_error("Please provide email and password",400));
    }

    const user=await User.findOne({email:email}).select("+password");

    if (!user || !await user.check_password(password,user.password))
    {
        return next(new App_error("Entered email or password is incorrect",401));
    }

    create_send_token(user,res,200);
});

exports.protect=catch_async(async (req,res,next) => {

    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))
    {
        token=req.headers.authorization.split(" ")[1];
    }
    else if(req.cookies.jwt)
    {
        token=req.cookies.jwt;
    }

    if (!token)
    {
        return next(new App_error("Login to access",401))
    }

    const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET_CODE);
    
    const current_user=await User.findById(decoded.id);

    if (!current_user)
    {
        return next(new App_error("User logged out.Login again",401));
    }
    
    if (current_user.check_password_change(decoded.iat))
    {
        return next(new App_error("User recently changed password.Please log in again",401));
    }

    req.user=current_user;

    next();
});

exports.is_logged_in=async (req,res,next) => {

    try{
        if(req.cookies.jwt)
            {
                const decoded=await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET_CODE);
                
                const current_user=await User.findById(decoded.id);
        
                if (!current_user)
                {
                    return next();
                }
                
                if (current_user.check_password_change(decoded.iat))
                {
                    return next();
                }
        
                res.locals.user=current_user;
        
                return next();
            }
    }catch(err){
        
        return next();
    }
    next();
};

exports.restricted_to=(... roles) =>{

    return (req,res,next) => {

        if (!roles.includes(req.user.roles))
        {
            return next(new App_error("You are not authorised to peform this action",403));
        }

        next();
    }
}

exports.forgot_password=catch_async(async (req,res,next) => {

    const user=await User.findOne( { email:req.body.email } );

    if (!user)
    {
        return next(new App_error("There is no username with that email address",404));
    }    

    const reset_token=user.forgot_password_token();

    await user.save({ validateBeforeSave:false });

    const reset_url=`${req.protocol}://${req.get("host")}/api/v1/users/reset-password/${reset_token}`;

    const message=`This is your password reset email.Submit a patch request to ${reset_url}`;

    try{
        
        new Email(user,reset_url).password_reset();

        res.status(200).json({
            status:"success",
            message:"Token sent to mail"
        });
    }catch(err){

        user.passwordResetToken=undefined;
        user.resetPasswordExpiresIn=undefined;

        console.log(err);
        return next(new App_error("Email not sent due to error",500));
    }

});

exports.reset_password=catch_async(async (req,res,next) => {

    const hashed_token=crypto.createHash('sha256').update(req.params.token).digest("hex");

    const user=await User.findOne({
        passwordResetToken:hashed_token,
        resetPasswordExpiresIn: { $gt:Date.now() }
    });

    if (!user)
    {
        return next(new App_error("Password reset token is expired or user does not exist",400));
    }

    user.password=req.body.password;
    user.confirmPassword=req.body.confirmPassword;
    user.passwordResetToken=undefined;
    user.resetPasswordExpiresIn=undefined;

    await user.save();

    create_send_token(user,res,200);
});

exports.update_password=catch_async(async (req,res,next) =>{

    const user=await User.findById(req.user.id).select("+password");

    if (!await user.check_password(req.body.current_password,user.password))
    {
        return next(new App_error("Entered password is incorrect",401));
    }

    user.password=req.body.new_password;
    user.confirmPassword=req.body.confirm_password;

    await user.save();

    create_send_token(user,res,200);
    
});

exports.logout=(req,res) => {

    res.cookie("jwt","loggedout",{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true
    });

    res.status(200).json({
        status:"success"
    })
}