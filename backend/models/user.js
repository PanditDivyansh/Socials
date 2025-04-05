const mongoose = require("mongoose")

const userschema = new mongoose.Schema({
    Name : String,
    Regno : String,
    email : String,
    verified: Boolean
})

const User = mongoose.model("user",userschema)
module.exports = User;