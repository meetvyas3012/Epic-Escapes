const express=require("express");
const user_router=express.Router();
const user_controller=require("D:/STUDY/NODE JS/natours/controllers/user_controller");
const auth_controller=require("D:/STUDY/NODE JS/natours/controllers/auth_controller");
const multer=require("multer");
const App_error = require("../controllers/error_controller");

user_router.route("/signup")
    .post(auth_controller.signup);

user_router.route("/login")
    .post(auth_controller.login);

user_router.route("/logout")
    .get(auth_controller.logout);

user_router.use(auth_controller.protect);

user_router.route("/")
    .get(user_controller.get_all_users);

user_router.route("/forgot-password")
    .post(auth_controller.forgot_password);

user_router.route("/reset-password/:token")
    .patch(auth_controller.reset_password);

user_router.route("/update-password")
    .patch(auth_controller.update_password);

user_router.route("/update-user-data")
    .patch(
        user_controller.upload_user_photo,
        user_controller.resize_user_photo,
        user_controller.update_user_data);

user_router.route("/delete-user")
    .delete(user_controller.delete_user);

user_router.route("/:id")
    .get(user_controller.get_users_by_id)
    .delete(user_controller.delete_user);

user_router.route("/me")
    .get(
        user_controller.get_me,
        user_controller.get_users_by_id
    );

module.exports=user_router;