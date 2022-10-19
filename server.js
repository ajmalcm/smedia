require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const SocketServer=require("./socketServer");
const {ExpressPeerServer} =require("peer")
const path=require("path")
//app config
const app = express();
//middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//socket
const http=require("http").createServer(app);
const io=require("socket.io")(http)


io.on('connection',socket=>{
    SocketServer(socket)
})

// creating peer server
ExpressPeerServer(http, {path:'/'})

//routes
app.use("/api",require("./routes/authRouter"));
app.use("/api",require("./routes/userRouter"));
app.use("/api",require("./routes/postRouter"));
app.use("/api",require("./routes/commentRouter"));
app.use("/api",require("./routes/notifyRouter"));
app.use("/api",require("./routes/messageRouter"))

//connection
const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (err) { throw err }
        console.log("connected to mongo");
}) 


if(process.env.NODE_ENV === "production")
{
    app.use(express.static("client/build"))
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}



//listeners
const port = process.env.PORT || 5000;
http.listen(port, () => {
    console.log("listening on the port ", port);
})

