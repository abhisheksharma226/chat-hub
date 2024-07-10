import express from "express";
import dotenv from "dotenv"; 
import cookieParser from "cookie-parser";

import authRoute from "./Routes/auth.js";
import messageRoute from "./Routes/message.js";
import userRoute from "./Routes/user.js";

import connectToMongoDB from "./db/connect.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());


app.get("/" , (req , res) => {
    res.send("Hello World");
})

app.use("/api/auth" , authRoute);
app.use("/api/messages" , messageRoute);
app.use("/api/users" , userRoute);

app.listen(PORT , () => {
    connectToMongoDB();
    console.log(`Server Started at ${PORT}`)});