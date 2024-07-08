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



export const login = async (req , res) => {
    try {
        
        const { username , password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({ error: "Invalid Username or Passowrd" });
        }


        generateTokenAndSetCookie(user._id , res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic,
        });


    } catch (error) {
        console.log("Error in Login", error.message);
        res.status(500).json({error : "Internal Server Error"});
    }
}



export const logout = (req , res) => {
    try {
        res.cookie("jwt", "" , { maxAge: 0 });
        res.status(200).json({ message: "Logged Out" });
    } catch (error) {
        console.log("Error in Logout", error.message);
        res.status(500).json({error : "Internal Server Error"});
    }
}