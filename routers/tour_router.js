const express=require("express");
const router=express.Router();
const tour_controller=require("D:/STUDY/NODE JS/natours/controllers/tour_controller");
const auth_controller=require("D:/STUDY/NODE JS/natours/controllers/auth_controller");
const review_router=require("D:/STUDY/NODE JS/natours/routers/review_router");

// router.param("id",tour_controller.check_id);

router.route("/top-tours")
    .get(tour_controller.top_tours,tour_controller.get_all_tours); 

router.route("/")
    .get(tour_controller.get_all_tours)
    .post(auth_controller.protect,tour_controller.add_tour);

router.use(auth_controller.protect);

router.route("/tour-stats")
    .get(tour_controller.get_tour_stats);

router.route("/monthly-plan/:year")
    .get(tour_controller.get_monthly_plan);   

router.route("/:id")
    .get(tour_controller.get_tours_by_id)
    .patch(
        auth_controller.restricted_to("admin","lead-guide"),
        tour_controller.upload_tour_images,
        tour_controller.resize_tour_images,
        tour_controller.update_tour)
    .delete(
        auth_controller.restricted_to("admin","lead-guide"),
        tour_controller.delete_tour
    );

router.route("/tours-within/:distance/center/:lat_lng/unit/:unit")
    .get(tour_controller.get_tours_within);

router.route("/distance/:lat_lng/unit/:unit")
    .get(tour_controller.get_distance);

router.use("/:tour_id/reviews",review_router);

module.exports=router;    