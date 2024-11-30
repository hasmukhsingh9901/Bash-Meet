import User from "../models/userModel.js";
import crypto from "crypto";
import { z } from "zod";
import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

const signUp = async (req, res) => {
  try {
    const schema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    });
    const { name, email, password,isAdmin } = schema.parse(req.body);
    const existingUser = await User.findOne({
      $or: [{ email }, { name }],
    });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const user = await User.create({ name, email, password ,isAdmin});
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        accessToken,
        refreshToken,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const signIn = async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = schema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshtoken.push(refreshToken);

    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    res.status(200).json({
      accessToken,
      message: "Login Successfull",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const refreshAccessToken = async (req, res) => {
  try {
   const refreshToken = req.cookies.refreshToken;
   if (!refreshToken) return res.status(403).json({
    message:"Refresh token not provided"
   })

   const user  = await User.findOne({refreshtoken:refreshToken})
   if (!user) return res.status(403).json({
    message:"User not found"
   })
   jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,payload)=>{
       if(err) return res.status(403).json({message:"Invalid refresh token"});
       const accessToken = generateAccessToken(user);
       const newRefreshToken = generateRefreshToken(user);
       res.cookie("refreshToken",newRefreshToken,{
        httpOnly:true,
        path:"/",
        // maxAge: 7*24*60*60*1000,
        sameSite:"none",
        secure:true
       })
       res.status(200).json({accessToken})
   })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const verifyToken = async (req,res,next) => {
  try {
    if(!req.user){
      return res.status(401).json({ 
        message: 'Invalid or expired token',
        isValid: false 
      });
    }
    const userDetails = await User.findById(req.user.id).select({
      password:0,
      refreshtoken:0,
      // forgotPasswordToken:0,
      // forgotPasswordTokenExpiry:0
    });

    if(!userDetails){
      return res.status(401).json({ 
        message: 'Invalid or expired token',
        isValid: false 
      });
    }
    if(userDetails.isBlocked){
      return res.status(401).json({
        message: 'User is blocked',
        isValid: false
      });
    }

    res.status(200).json({
      message: 'Token is valid',
      isValid: true,
      user:{
        id:userDetails._id,
        name:userDetails.name,
        email:userDetails.email,
        isAdmin:userDetails.isAdmin
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
}

export { signUp, signIn,refreshAccessToken ,verifyToken};
