const App_error = require("./error_controller");
const catch_async=require("D:/STUDY/NODE JS/natours/utils/catch_async.js");
const Api_features=require("D:/STUDY/NODE JS/natours/utils/api_features.js");

exports.delete_one= Model => 
    
    catch_async(async (req,res,next) => {

    const doc=await Model.findByIdAndDelete(req.params.id);

    if (!doc)
    {
        return next(new App_error(`No document found by ${req.params.id} id`),404);
    }

    res.status(204).json({
        status:"success",
        data:null
    });
});    

exports.update_one=Model => 
    catch_async(async (req,res,next) => {

    const doc=await Model.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });

    if (!doc)
    {
        return next(new App_error(`No doc found by ${req.params.id} id`),404);
    }

    res.status(200).json({
        status:"success",
        data:{
           data: doc
        }
    });
   
});

exports.create_one=Model => 
    catch_async(async (req,res,next) => {

        const doc=await Model.create(req.body);
    
        res.status(201).json({
            status:"success",
            data:{
                tour:doc
            }
        });
      
    });

exports.get_one=(Model,pop_options) => 
    catch_async(async (req,res,next) => {

        if (req.params.id==="me") req.params.id=req.user.id;
        
        let query=Model.findById(req.params.id);

        if (pop_options)
        {
            query=query.populate(pop_options);
        }

        const doc=await query;

        if (!doc)
        {
            return next(new App_error(`No doc found by ${req.params.id} id`),404);
        }
    
        res.status(200).json({
            status:"success",
            results:doc.length,
            data:{
                doc
            }
        });
    });    

exports.get_all=Model =>
    catch_async(async (req,res,next) => {

        let filter={};
        if (req.params.tour_id) filter={tour:req.params.tour_id}; 
    
        const features=new Api_features(Model.find(),req.query)
        .filter()
        .sort()
        .limit_fields()
        .paginate();

        const doc=await features.query;

        res.status(200).json({
            status:"success",
            results:doc.length,
            data:{
                doc
            }
        });
    });  