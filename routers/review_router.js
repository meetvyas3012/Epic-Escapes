const express=require("express");
const review_controller=require("D:/STUDY/NODE JS/natours/controllers/review_controller");
const auth_controller=require("D:/STUDY/NODE JS/natours/controllers/auth_controller");

const router=express.Router({ mergeParams:true });

router.use(auth_controller.protect);

router.route("/")
    .post(
        auth_controller.restricted_to("user"),
        review_controller.get_ids,
        review_controller.create_review)
    .get(review_controller.get_all_reviews);

router.route("/:id")
    .delete(review_controller.delete_review)
    .get(review_controller.get_review_by_id)
    .patch(review_controller.update_review);

module.exports=router;    
