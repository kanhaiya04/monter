import { Request, Response } from "express";
import User from "../models/userModel";
import WorkDetails from "../models/workDetailsModel";
import Otp from "../models/otpModel";

const ValidateUserController = async (req: Request, res: Response) => {
  try {
    const { otp, email, jobTitle, companyName } = req.body;
    if (!otp || !email || !jobTitle || !companyName) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    // Check if user is present or not
    const checkUserPresent = await User.findOne({ email });
    // If user not found with provided email
    if (!checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }
    // Find the most recent OTP for the email
    const response = await Otp.find({ email }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      });
    }

    const workDetails = await WorkDetails.create({
      title: jobTitle,
      companyName,
      description: req.body.jobDescription ? req.body.jobDescription : "",
      location: req.body.joblocation ? req.body.joblocation : "",
      status: req.body.jobStatus ? req.body.jobStatus : "full-time",
    });

    await User.findOneAndUpdate(
      { email },
      { workDetails: workDetails._id, validated: true }
    );
    return res.status(201).json({
      success: true,
      message: "User is validated successfully",
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default ValidateUserController;
