import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;