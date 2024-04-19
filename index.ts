import express, { Express, Request, Response } from "express";
import connectDB from "./utils/db";
import userRouter from "./routes/userRoutes";
const dotenv = require("dotenv");

dotenv.config();
const app: Express = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

connectDB();

app.get("/", (req: Request, res: Response) => {
  res.send("API is working");
});

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
