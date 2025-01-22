const express = require("express");
const { connectDb } = require("./config/database");
const  cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/users");


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);




connectDb() 
    .then(() =>{
        console.log("Database Connected");
        app.listen(1234, () => {
            console.log("Server started on port 1234.....");
        });
    })
    .catch((err) => {
        console.log("Error:", err.message);
    });

    
