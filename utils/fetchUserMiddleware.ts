import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

const FetchUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    //fetch the token from the header
    const token = req.header("token");

    //if token not found
    if (!token) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    //verify the token
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = data.user.id;
    next();
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export default FetchUser;
