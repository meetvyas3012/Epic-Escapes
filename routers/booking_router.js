const express=require("express");
const booking_controller=require("D:/STUDY/NODE JS/natours/controllers/booking_controller");
const auth_controller=require("D:/STUDY/NODE JS/natours/controllers/auth_controller");

const router=express.Router();

router.use(auth_controller.protect);

router.get(
    "/checkout-session/:tour_id",
    booking_controller.get_checkout_session
);


router.use(auth_controller.restricted_to("admin","lead-guide"));

router.route("/")
    .get(booking_controller.get_all_bookings)
    .post(booking_controller.update_booking);

router.route("/:id")
    .get(booking_controller.get_booking_by_id)
    .patch(booking_controller.update_booking)
    .delete(booking_controller.delete_booking);

module.exports=router;