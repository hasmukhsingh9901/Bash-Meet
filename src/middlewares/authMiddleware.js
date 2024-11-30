import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
  const token = req.headrs.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: error.message });
  }
};
