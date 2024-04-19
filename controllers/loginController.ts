import { Request, Response } from "express";
import User from "../models/userModel";
import Otp from "../models/otpModel";
import { validationResult } from "express-validator";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

const LoginController = async (req: Request, res: Response) => {
  try {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    // Check if user is present or not
    const user = await User.findOne({ email });

    // If user not found with provided email
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not registered",
      });
    }

    // Check if user is not validated
    if (!user.validated) {
      //generate otp
      let otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      let result = await Otp.findOne({ otp: otp });
      while (result) {
        otp = otpGenerator.generate(6, {
          upperCaseAlphabets: false,
        });
        result = await Otp.findOne({ otp: otp });
      }
      await Otp.create({ email, otp });
      return res.status(400).json({
        success: false,
        message: "User not validated, OTP sent to email",
      });
    }

    // Compare the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }
    const data = {
      user: {
        id: user.id,
      },
    };

    // generate the jwt token
    const authToken = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // send the token
    return res.status(201).json({
      success: true,
      message: "User logged in successfully",
      token: authToken,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default LoginController;
