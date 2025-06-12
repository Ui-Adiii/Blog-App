import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import commentRouter from "./routes/comment.route.js";
import postRouter from "./routes/post.route.js";
import cookieParser from "cookie-parser";
import connectCloudinary from "./utils/cloudinary.js";

dotenv.config({});
connectDB();
connectCloudinary();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

app.listen(PORT, () => {
  console.log(`server started on : ${PORT}`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
