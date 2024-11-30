import mongoose from "mongoose";

const bashSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  image:{
    type:String,
    // required:true, 
  },
  message:{
    type:String,
    required:true
  }

},{
    timestamps:true
})


const Bash = mongoose.model("Bash",bashSchema)
export default Bash;