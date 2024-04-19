import { Schema, model } from "mongoose";
import mailSender from "../utils/mailSender";

const otpSchema = new Schema({
  email: {
    type: "string",
    required: true,
  },
  otp: {
    type: "string",
    required: true,
  },
  createdAt: {
    type: "date",
    default: Date.now,
    expires: 60 * 5, //otp expires in 5 min
  },
});

const sendOtpEmail = async (email: string, otp: string) => {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
                         <p>Here is your OTP code: ${otp}</p>`
    );
    console.log("Email sent successfully: ", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
};

otpSchema.pre("save", async function (next) {
  if (this.isNew) {
    await sendOtpEmail(this.email, this.otp);
  }
  next();
});

const Otp = model("Otp", otpSchema);
export default Otp;
