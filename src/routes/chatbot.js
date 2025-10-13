const express = require("express");
const {userAuth} = require("../middlewares/auth");
const chatbotModel = require("../model/chatbot");
const { generateAnswer } = require("../utils/chatbotService");

const chatbotRouter = express.Router();

chatbotRouter.post("/chatbot/message", userAuth, async (req, res) => {
  try {
    const { question } = req.body;
    const query = question.toLowerCase().trim();

    // Check if we already have this question in the database
    const existing = await chatbotModel.findOne({ question: query });

    if (existing) {
      return res.json({ response: existing.response });
    }

    // Otherwise, generate a new answer using LangChain + OpenAI
    const aiResponse = await generateAnswer(query);

    // Save the Q&A to MongoDB for future reuse
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
