import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    // console.log(localFilePath, process.env.CLOUDINARY_API_KEY);

    // If file exists, upload it on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // console.log(response);
    // After successfully uploading, unlink the file from our local storage
    // console.log(
    //   `File has been successfully uploaded!!!\nLink is: ${response.url}`
    // );
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // If we find any error in between, we have to remove the file from our server first using unlinkSync()
    console.log("Error while file uploading to Cloudinary\n", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const getPublicId = (imageURL) => {
  const parts = imageURL.split("/");
  const filename = parts.pop();
  const publicId = filename.split(".")[0];
  return publicId;
};
// Delete an image asset called 'zombie'
export const deleteFromCloudinary = async (publicUrl) => {
  try {
    if (!publicUrl) return null;

    const publicId = getPublicId(publicUrl);

    const response = await cloudinary.uploader.destroy(publicId);

    return response;
  } catch (error) {
    console.log("Error while file uploading to Cloudinary\n", error);
    return null;
  }
};
