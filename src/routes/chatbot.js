const express = require("express");
const {userAuth} = require("../middlewares/auth");
const chatbotModel = require("../model/chatbot");
const { generateAnswer } = require("../utils/chatbotservice");

const chatbotRouter = express.Router();

chatbotRouter.post("/chatbot/message", userAuth, async (req, res) => {
  try {
    const { question } = req.body;
    const query = question.toLowerCase().trim();
    const existing = await chatbotModel.findOne({ question: query });

    if (existing) {
      return res.json({ response: existing.response });
    }
    const aiResponse = await generateAnswer(query);
    const newEntry = new chatbotModel({
      question: query,
      response: aiResponse,
    });

    await newEntry.save();

    return res.json({ response: aiResponse });
  } catch (err) {
    console.error("Chatbot Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = chatbotRouter;
