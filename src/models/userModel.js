import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshtoken: [String],
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
  },
  {
    timestamps: true,
  }
);


// userSchema.virtual("id").get(function () {
//   return this._id.toHexString();
// });

// userSchema.set("toJSON", {
//   virtuals: true,
// });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next(); 
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); 
  next();

});

userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};  

// This pattern is a safeguard against redundant model definitions in Mongoose. By checking if the model already exists (mongoose.models.User), it reuses the existing model instead of trying to redefine it.

const User =  mongoose.model("User", userSchema);
export default User;

