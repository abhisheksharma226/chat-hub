import User from "../models/user.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async(req , res) => {
    try {
        const { fullname , username , password , confirmPassword , gender } = req.body;

        if(password !== confirmPassword){
            return res.status(400).json({error: "Password Don't Match"});
            }

        const user = await User.findOne({username});
        if(user){
            return res.status(400).json({error: "Username Already Exists"});
         }

        //HASH PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);


         const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username={username}`;
         const gitlProfilePic = `https://avatar.iran.liara.run/public/girl?username={username}`;

         const newUser = new User({
            fullname,
            username,
            password : hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : gitlProfilePic
         })

         if(newUser){
            await generateTokenAndSetCookie(newUser._id , res);
            await newUser.save();


         res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilePic: newUser.profilePic
         })
         }else{
            res.status(400).json({error: "Something Went Wrong"});
         }

    } catch (error) {
            console.log("Error in signup", error.message);
            res.status(500).json({error : "Internal Server Error"});
    }
}

export const login = (req , res) => {
    res.send("login");
}

export const logout = (req , res) => {
    res.send("logout");
}