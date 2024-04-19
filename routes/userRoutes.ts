import { Router } from "express";
import RegisterController from "../controllers/registerController";
import ValidateUserController from "../controllers/validateUserController";
import LoginController from "../controllers/loginController";
import FetchUserDetailsController from "../controllers/fetchUserDetailsController";
import FetchUser from "../utils/fetchUser";
const { body } = require("express-validator");

const router = Router();
router.post(
  "/register",
  [
    //validation
    body("email", "Invalid email").isEmail(),
    body("firstName", "First name can't be empty").notEmpty(),
    body("lastName", "Last name can't be empty").notEmpty(),
    body("password", "Password Min. Length should be 5 char").isLength({
      min: 5,
    }),
  ],
  RegisterController
);
router.post(
  "/validate",
  [
    //validation
    body("email", "Invalid email").isEmail(),
    body("otp", "Otp can't be empty").notEmpty(),
    body("jobTitle", "Job title is required").notEmpty(),
    body("companyName", "Company name is required").notEmpty(),
  ],
  ValidateUserController
);
router.post(
  "/login",
  [
    //validation
    body("email", "Invalid email").isEmail(),
    body("password", "Password can't be empty").notEmpty(),
  ],
  LoginController
);
router.get("/fetchUserDetails", FetchUser, FetchUserDetailsController);

export default router;
