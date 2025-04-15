const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Chatmod = require("./models/chatmodel");
const User = require("./models/user");
const Complaint = require("./models/complaints"); // If there's a 'complaint.js' model


const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    saveUninitialized: true,
    resave: true,
    secret: "testmsg",
  })
);

mongoose
  .connect("mongodb://localhost:27017/socialusers", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// Send chat message
app.post("/send-chat", async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const usrstr = [from, to].sort().join("");

    let chat = await Chatmod.findOne({ users: usrstr });

    if (!chat) {
      chat = new Chatmod({
        users: usrstr,
        message: [],
      });
    }

    chat.message.push({
      from,
      message,
      timestamp: new Date(),
    });

    await chat.save();
    res.status(200).send("Message appended!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to send message");
  }
});

// Get chats
app.post("/get-chats", async (req, res) => {
  try {
    const { from, to } = req.body;
    const usrstr = [from, to].sort().join("");

    const chat = await Chatmod.findOne({ users: usrstr });

    if (!chat) {
      return res.status(404).json({ message: "No chat found" });
    }

    res.json(chat.message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/online-users", async (req, res) => {
  try {
    // Get users with online: true
    console.log('Users demanded')
    const onlineUsers = await User.find();

    res.json(onlineUsers); // returns [{ username: "user1" }, { username: "user2" }]
  } catch (err) {
    console.error("Failed to fetch online users", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/report-complaint', async (req, res) => {
  try {
    const { userID, complaint } = req.body;

    const newcomp = new Complaint({
      for: userID,
      complaint: complaint
    });

    await newcomp.save();
    res.status(200).send('Complaint reported successfully');
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error in posting complaint" });
  }
});


app.listen(4000, () => {
  console.log("Server2 running at 4000");
});
