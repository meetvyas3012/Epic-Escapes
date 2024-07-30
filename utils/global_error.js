const App_error = require("../controllers/error_controller")

const handle_cast_err_db=err => {
    
    return new App_error(`Invalid ${err.path}:${err.value}`,400)
}

const handle_duplicate_fields_db=err => {

    const val=err.message.match(/(["'])(?:(?=(\\?))\2.)*?\1/);

    return new App_error(`Duplicate feild value:${val}.Please use another value`,400);
}

const  handle_jwt_err = err =>
    new App_error(`Invalid token.Login again`,400);

const  handle_jwt_expire_err = err =>
    new App_error(`Token expired.Login again`,400);

const handle_validation_err_db=err => {
    
    console.log(err.errors);
    const errors=Object.values(err.errors).map(el => el.message);
    console.log(errors);
    const message=`Invalid input data : ${errors.join("\n")}`;

    return new App_error(message,400);
}

const dev_error=(err,res) => {

    
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack
    });

    
  
}

const prod_error=(err,res) => {

    
    if (err.isOperational)
        {
            return res.status(err.statusCode).render("error",{
                title:"Something went wrong",
                message:err.message,
            })
        }
    console.error("ERROR:",err);

    res.status(500).json({
        title:"Something went wrong",
        message:"Please try again later"
    })
    
}


module.exports=(err,req,res,next) => {

    err.statusCode=err.statusCode || 500;
    err.status=err.status || "error";

    console.log(process.env.NODE_ENV);

    if (process.env.NODE_ENV==="development")
    {
        dev_error(err,res);
    }
    else
    {
        let error={...err};
        error.message=err.message;

        if (error.name==="CastError") error=handle_cast_err_db(err);
        if (error.code===11000) error=handle_duplicate_fields_db(err);
        if (error.name==="ValidationError") error=handle_validation_err_db(err);
        if (error.name==="JsonWebTokenError") error=handle_jwt_err();
        if (error.name==="TokenExpiredError") error=handle_jwt_expire_err();

        prod_error(error,res);
    }

    next();
}