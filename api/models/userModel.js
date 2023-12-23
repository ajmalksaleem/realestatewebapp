import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://www.shareicon.net/data/128x128/2016/07/26/802043_man_512x512.png"
    }
},
    { timestamps: true }
)

const User = mongoose.model('Usercol', userSchema);

export default User;