const express=require("express");
const router=express.Router();
const view_controller=require("D:/STUDY/NODE JS/natours/controllers/view_controller");
const auth_controller=require("D:/STUDY/NODE JS/natours/controllers/auth_controller");
const user_controller=require("D:/STUDY/NODE JS/natours/controllers/user_controller");
const booking_controller=require("D:/STUDY/NODE JS/natours/controllers/booking_controller");



router.get("/",booking_controller.create_bookings_checkout,auth_controller.is_logged_in,view_controller.base);
router.use(auth_controller.is_logged_in);
router.get("/overview",view_controller.overview);
router.get("/tour/:slug",auth_controller.protect,view_controller.tours);
router.get("/login",view_controller.login);
router.get("/me",auth_controller.protect,view_controller.me);
router.get("/update-user",user_controller.update_user_data,view_controller.me);
router.get("/my-tours",auth_controller.protect,booking_controller.get_my_tours);

module.exports=router;