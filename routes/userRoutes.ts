import { Router } from "express";
import RegisterController from "../controllers/registerController";
import ValidateUserController from "../controllers/validateUserController";
import LoginController from "../controllers/loginController";
const { body } = require("express-validator");

const router = Router();
router.post(
  "/register",
  [
    //validation
    body("email", "Invalid email").isEmail(),
    body("firstName", "First name can't be empty").notEmpty(),
    body("lastName", "Last name can't be empty").notEmpty(),
    body("password", "Password Min. Length should be 5 char").isLength({ min: 5 }),
  ],
  RegisterController
);
router.post("/validate", ValidateUserController);
router.post("/login", LoginController);

export default router;
