
import mongoose from "mongoose";
const { Schema } = mongoose;

const FriendNotifySchema = new Schema({
    sender_id: {type: Schema.Types.ObjectId, require: true},
    receiver_id: {type: Schema.Types.ObjectId, require: true},
    accept: {type: Schema.Types.Boolean, require: true},
    sender_email: {type: Schema.Types.String, require: true}
})

export default FriendNotifySchema;