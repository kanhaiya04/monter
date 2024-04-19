import { Request, Response } from "express";
import User from "../models/userModel";
import Otp from "../models/otpModel";
import { validationResult } from "express-validator";
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");

const RegisterController = async (req: Request, res: Response) => {
  try {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: errors.array()[0].msg });
    }
    const { firstName, lastName, email, password } = req.body;

    //check if user already exists
    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

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

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: `Hashing password error for ${password}: ` + error.message,
      });
    }
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default RegisterController;
