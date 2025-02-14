const express = require("express");
const chatbotRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const chatbotModel = require("../model/chatbot");

chatbotRouter.post("/chatbot/message", userAuth, async(req, res) =>{

    try {
        const {question} = req.body;
        const query = question.toLowerCase().trim();

        const chatbotResponse = await chatbotModel.findOne({question:query});

        if (chatbotResponse) {
          return res.json({ response: chatbotresponse.response });
        } else {
          return res.json({
            response:
              "Sorry, I don't understand that. Please try a different question.",
          });
        }

    } catch (err) {
      res.status(500).json({ error: "Server error" });
    }

});

module.exports = chatbotRouter;
