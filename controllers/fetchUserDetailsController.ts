import { Request, Response } from "express";
import User from "../models/userModel";
import WorkDetails from "../models/workDetailsModel";

//interface for the user data
interface userData {
  firstName: string;
  lastName: string;
  email: string;
  location?: string;
  age?: number;
  jobTitle?: string;
  companyName?: string;
  jobDescription?: string;
  jobLocation?: string;
  jobStatus?: string;
}

const FetchUserDetailsController = async (req: Request, res: Response) => {
  try {
    //userId fetched from the token
    const userId = req.body?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Invalid user" });
    }

    //find the user with the userId
    const user = await User.findById(userId).select("-password");

    //if user not found
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    //userData object to send the user data
    let userData: userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    if (user.location) userData.location = user.location;
    if (user.age) userData.age = user.age;

    //find the work details of the user
    const workDetails = await WorkDetails.findById(user.workDetails);

    //if work details found, add it to the userData object
    if (workDetails) {
      userData.jobTitle = workDetails.title;
      userData.companyName = workDetails.companyName;
      if (workDetails.description)
        userData.jobDescription = workDetails.description;
      if (workDetails.location) userData.jobLocation = workDetails.location;
      if (workDetails.status) userData.jobStatus = workDetails.status;
    }

    //send the userData object
    return res.status(200).json({
      success: true,
      message: "Fetched user details successfully",
      userData,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default FetchUserDetailsController;
