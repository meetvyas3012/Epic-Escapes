class App_error extends Error
{
    constructor(message,status_code)
    {
        super(message);

        this.statusCode=status_code;
        this.status=`${status_code}`.startsWith("4") ? "fail" : "error";
        this.isOperational=true;

        Error.captureStackTrace(this,this.constructor);
    }
}

module.exports=App_error;