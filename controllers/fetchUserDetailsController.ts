import { Request, Response } from "express";
import User from "../models/userModel";
import WorkDetails from "../models/workDetailsModel";

interface userData {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle?: string;
  companyName?: string;
  jobDescription?: string;
  jobLocation?: string;
  jobStatus?: string;
}

const FetchUserDetailsController = async (req: Request, res: Response) => {
  try {
    const userId = req.body?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid user" });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let userData: userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    const workDetails = await WorkDetails.findById(user.workDetails);

    if (workDetails) {
      userData.jobTitle = workDetails.title;
      userData.companyName = workDetails.companyName;
      if (workDetails.description)
        userData.jobDescription = workDetails.description;
      if (workDetails.location) userData.jobLocation = workDetails.location;
      if (workDetails.status) userData.jobStatus = workDetails.status;
    }

    return res.status(200).json({
      success: true,
      message: "Fetched user details successfully",
      userData,
    });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default FetchUserDetailsController;
