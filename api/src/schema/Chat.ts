
import mongoose from "mongoose";
const { Schema }  = mongoose;

const Chat = new Schema({
    participantes: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    }],
    mensagens: [{
        sender: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        content: String,
        isFile: Boolean,
        createdAt: Date
    }]
})

export default Chat;