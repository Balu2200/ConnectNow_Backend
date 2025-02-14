const mongoose = require("mongoose");
const chatbotModel = require("../model/chatbot");

mongoose.connect(process.env.MONGODB_CONNECTION);

const seedData = [
  {
    question: "I want to check my connections",
    response:
      "You can check your connections under connections  tab by clicking on profile image",
  },
  {
    question: "I want to check my connection request",
    response:
      "You can check your connections request under request  tab by clicking on profile image",
  },
  {
    question: "customer support",
    response:
      "For support, you can email us at balupasumarthi1@email.com or call our helpline 7995931047.",
  },
  {
    question: "good morning",
    response: "Good morning! How can I assist you today?",
  },
  {
    question: "good afternoon",
    response: "Good afternoon! How can I help you?",
  },
  {
    question: "good evening",
    response: "Good evening! What can I do for you?",
  },
  {
    question: "happy birthday",
    response: "Happy Birthday! Wishing you a fantastic day ahead!",
  },
  {
    question: "happy new year",
    response: "Happy New Year! May this year bring you joy and prosperity!",
  },
];

const seedDb = async() =>{
    await chatbotModel.insertMany(seedData);
    console.log("Chatbot response added");
    mongoose.connection.close();
}

seedDb();
