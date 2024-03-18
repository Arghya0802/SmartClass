import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    uniqueId: {
      type: String,
      required: true,
      unique: true,
      validate: function () {
        if (this.uniqueId.length < 3 || this.uniqueId[1] !== "-") return false;
        return true;
      },
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: {
      type: String,
      default: "EMPTY",
    },
  },
  { timestamps: true }
);

adminSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();

    const hashed = await bcrypt.hash(this.password, 10);

    // console.log(`Password hashed successfully!!!`);
    // console.log(hashed);
    this.password = hashed;
    next();
  } catch (error) {
    return next(error);
  }
});

adminSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};

// jwt.sign({data}, secret_key, {expiresIn: expiryDate})
adminSchema.methods.generateAccessToken = async function () {
  try {
    return jwt.sign(
      {
        _id: this._id,
        uniqueId: this.uniqueId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  } catch (error) {
    throw new ApiError(
      500,
      "Internal Server Error while generating Access Token!!!"
    );
  }
};

adminSchema.methods.generateRefreshToken = async function () {
  try {
    return jwt.sign(
      {
        _id: this._id,
        uniqueId: this.uniqueId,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
  } catch (error) {
    throw new ApiError(
      500,
      "Internal Server error while generating Refresh Token!!!"
    );
  }
};
const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
