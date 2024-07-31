const Review=require("D:/STUDY/NODE JS/natours/models/review_model.js");
const catch_async = require("../utils/catch_async");
const handler=require("./handler_factory");

exports.get_ids=(req,res,next) => {

    if (!req.body.user) req.body.user=req.user.id;``
    if (!req.body.tour) req.body.tour=req.params.tour_id;

    next();
};

exports.get_all_reviews=handler.get_all(Review);
exports.get_review_by_id=handler.get_one(Review);
exports.create_review=handler.create_one(Review);
exports.delete_review=handler.delete_one(Review);
exports.update_review=handler.update_one(Review);