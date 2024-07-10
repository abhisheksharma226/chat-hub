import Conversation from "../models/conversation.js";
import Message from "../models/message.js";

export const sendMessage = async (req , res) => {
    try {
        const {message} = req.body;
        const {id: reciverId} = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all : [senderId , reciverId] },
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId , reciverId],
            })
        }
        
        const newMessage = new Message({
            senderId,
            reciverId,
            message,
        })

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }


        await Promise.all([conversation.save(), newMessage.save()]);

        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage" , error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export const getMessage = async (req , res) => {

    try {
        
        const {id: userToChatId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all : [senderId , userToChatId] },

        }).populate("messages");

        if(!conversation) return res.status(200).json([]);

        const messages = conversation.messages;

        res.status(200).json(conversation.messages);

    } catch (error) {
        console.log("Error in getMessage" , error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}