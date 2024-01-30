import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const upload_on_cloud = async (localpath) => {
  try {
    if (!localpath) {
      return null;
    }
    const responce = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });
    return responce;
  } catch (error) {
    fs.unlinkSync(localpath); // remove localsave temp file as a upload operation got fail
    return null;
  }
};

export default upload_on_cloud;
