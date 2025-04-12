const mongoose = require("mongoose");

const chatschema = new mongoose.Schema({
    users:String,
    message: [
        {
            from: String,
            timestamp: { type: Date, default: Date.now },
            message: String
        }
    ]
});

const Chatmod = mongoose.model("chatmod", chatschema);
module.exports = Chatmod;
