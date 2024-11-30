import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { corsOptions } from "./config/corsConfig.js";

dotenv.config({path:'./.env'});


const app = express();

const port = process.env.PORT;

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => { 
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);  
});
