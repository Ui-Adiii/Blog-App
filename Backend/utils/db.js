import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`)
    .then(() => {
      console.log("DB Connected Successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectDB