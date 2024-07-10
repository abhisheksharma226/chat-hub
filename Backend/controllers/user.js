import User from "../models/user.js";

export const getUserForSlidebar = async (req , res) => {
    try {
        
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({  _id: {$ne : loggedInUserId}}).select("-password");

        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error("Error in getUserForSlidebar : " , error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}