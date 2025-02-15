const express = require("express");
const { connectDb } = require("./config/database");
const  cookieParser = require("cookie-parser");
const cors = require('cors');
require("dotenv").config();
const http = require("http");



const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials:true
  })
);
app.use(express.json());
app.use(cookieParser());


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/users");
const initilizeSocket = require("./utils/socket");


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

const server = http.createServer(app);
initilizeSocket(server);

connectDb() 
    .then(() =>{
        console.log("Database Connected");
        server.listen(process.env.PORT, () => {
            console.log("Server started on port 1234.....");
        });
    })
    .catch((err) => {
        console.log("Error:", err.message);
    });

    
