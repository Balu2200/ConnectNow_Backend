const express = require("express");
const userRouter = express.Router();
const {connectionRequestModel} = require("../model/connectionRequest");
const {userAuth} = require("../middlewares/auth");
const userModel = require("../model/user");


userRouter.get("/user/request/received", userAuth, async(req, res) =>{

    try{

        const loggedInUser = req.user;
        const connectionRequest = await connectionRequestModel.find({
            toUserId: loggedInUser._id,
            status:"interested"
        }).populate("fromUserId", ["firstName","lastName","about","photoUrl","age"]); 
         
        res.json({message:"Data fetched successfully", Data:connectionRequest});
    }
    catch(err){
        res.status(400).send("Error:"+ err.message);
    }
});

userRouter.get("/user/connections", userAuth , async(req, res) =>{

    try{

        const loggedInUser = req.user;
        const connections = await connectionRequestModel.find({
            $or: [
            { fromUserId: loggedInUser._id, status: "accepted" },
            { toUserId: loggedInUser._id, status: "accepted" }
            ]
        }).populate("fromUserId", ["firstName", "lastName","age","photoUrl","about"])
          .populate("toUserId", ["firstName", "lastName","age","photoUrl","about"]);

        const data = connections.map((row) => {
            if (row.fromUserId._id.equals(loggedInUser._id)) {
            return row.toUserId;
            } else {
            return row.fromUserId;
            }
        });

        res.json({message: "Connections fetched successfully", Data: data});
    }
    catch(err){
        res.status(400).send("Error:"+ err.message);
    }
});

userRouter.get("/feed", userAuth, async(req, res)=>{

    try{
         const loggedInUser = req.user;

         const page = parseInt(req.query.page, 10) || 1;
         const limit = parseInt(req.query.limit, 10) || 10;
         const skip = (page - 1) * limit;

         const connectionRequest = await connectionRequestModel.find(
            {
                $or: [
                     { fromUserId: loggedInUser._id },
                     { toUserId: loggedInUser._id }
                ]
            }
        ).select("fromUserId toUserId").skip(skip).limit(limit);

        const hideUserFromFeed = new Set();

        connectionRequest.forEach((req) => {
            if (req.fromUserId) hideUserFromFeed.add(req.fromUserId.toString());
            if (req.toUserId) hideUserFromFeed.add(req.toUserId.toString());
        });

        const users = await userModel.find({
           $and: [{_id: { $nin: Array.from(hideUserFromFeed) }}, { _id: { $ne: loggedInUser._id } }],
        });

        res.json({ message: "Feed fetched successfully", Data: users });

    }
    catch(err){
        res.status(400).send("Error:"+ err.message);
    }
});


module.exports = userRouter;