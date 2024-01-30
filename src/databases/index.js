import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const ConnectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`);
    console.log("connect done");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default ConnectDB;
