import express from "express";
import dotenv from "dotenv"; 
const app = express();

import authRoute from "./Routes/auth.js";


dotenv.config();
const PORT = process.env.PORT || 8000;

app.get("/" , (req , res) => {
    res.send("Hello World");
})

app.use("/api/auth" , authRoute);

app.listen(PORT , () => 
    console.log(`Server Started at ${PORT}`));