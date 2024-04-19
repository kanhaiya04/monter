import { Schema, model } from "mongoose";

const workDetailsSchema = new Schema({
  title: {
    type: "string",
    required: true,
  },
  companyName: {
    type: "string",
    required: true,
  },
  description: {
    type: "string",
  },
  location: {
    type: "string",
  },
  status: {
    type: "string",
    enum: ["full-time", "part-time", "contract"],
  },
  createdAt: {
    type: "date",
    default: Date.now,
  },
});

const WorkDetails = model("WorkDetails", workDetailsSchema);
export default WorkDetails;
