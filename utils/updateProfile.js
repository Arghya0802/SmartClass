import mongoose from "mongoose";
export const findAndUpdateProfile = async (model, body) => {
  const { uniqueId } = body;

  const findProfile = await model.findOne({ uniqueId });

  const res = {};

  if (!findProfile) {
    res.message = "No Profile found with given Unique-Id";
    res.success = false;
  } else {
    const updatedProfile = await model.findByIdAndUpdate(findProfile._id, body);
    res.profile = updatedProfile;
    res.message = "Profile Updated Successfully!!!";
    res.success = true;
  }

  return res;
};
