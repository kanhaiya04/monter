import { Request, Response } from "express";
import User from "../models/userModel";
import WorkDetails from "../models/workDetailsModel";
import Otp from "../models/otpModel";
import { validationResult } from "express-validator";

//interface for the work details
interface workDetails {
  title: string;
  companyName: string;
  description?: string;
  location?: string;
  status?: string;
}

const ValidateUserController = async (req: Request, res: Response) => {
  try {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: errors.array()[0].msg });
    }

    const { otp, email, location, age, jobTitle, companyName } = req.body;

    // Check if user is present or not
    const checkUserPresent = await User.findOne({ email });

    // If user not found with provided email
    if (!checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }

    // Check if user is already validated
    if (checkUserPresent.validated) {
      return res.status(400).json({
        success: false,
        message: "User is already validated",
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

    // Create the work details
    const workDetailsData: workDetails = {
      title: jobTitle,
      companyName,
    };
    if (req.body.joblocation)
      workDetailsData.location = req.body.jobDescription;

    if (req.body.jobDescription)
      workDetailsData.description = req.body.jobDescription;

    if (req.body.jobStatus) workDetailsData.status = req.body.jobStatus;

    // Create the work details
    const workDetails = await WorkDetails.create({
      ...workDetailsData,
    });

    // Update the user with the work details and validated as true
    await User.findOneAndUpdate(
      { email },
      {
        workDetails: workDetails._id,
        validated: true,
        location: location,
        age: age,
      }
    );

    // Send the response
    return res.status(201).json({
      success: true,
      message: "User is validated successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default ValidateUserController;
