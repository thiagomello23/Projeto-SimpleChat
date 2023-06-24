
import mongoose from "mongoose";
const { Schema }  = mongoose;

const UserSchema = new Schema({
    nome: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    senha: {type: String, required: true},
    profilePic: {type: String},
    bio: {type: String},
    status: {type: String, required: true},
    amigos: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
})

export default UserSchema;
