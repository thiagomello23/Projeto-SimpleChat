
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
        nome: {type: String},
        profilePic: {type: String},
        bio: {type: String},
        status: {type: String},
        email: {type: String}
    }]
})

export default UserSchema;