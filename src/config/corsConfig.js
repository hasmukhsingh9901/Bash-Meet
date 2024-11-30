import dotenv from "dotenv";

dotenv.config({path:'./.env'});

const allowingServer = process.env.ALLOWING_SERVER ? process.env.ALLOWING_SERVER.split(",") : [];

const corsOptions = {
    origin: (origin, callback) =>
      !allowingServer.includes(origin) ? callback(null, true) : callback(new Error("Not allowed by CORS")),
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ["WWW-Authenticate"],
  };
  
  export { corsOptions };