import express from "express";
import dotenv from "dotenv"; 

import authRoute from "./Routes/auth.js";
import connectToMongoDB from "./db/connect.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());


app.get("/" , (req , res) => {
    res.send("Hello World");
})

app.use("/api/auth" , authRoute);

app.listen(PORT , () => {
    connectToMongoDB();
    console.log(`Server Started at ${PORT}`)});