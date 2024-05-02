// Start using socket io
import express from "express";
import {Server} from "socket.io";
import cors from "cors";
import http from "http";
import { log } from "console";

const app = express();


// 1. Create hhtp server
const server = http.createServer(app);


//2. Create Socket Server
// socket server uses http server to start the connection

const io = new Server(server, {
    cors :{
        origin : "*",
        methods : ["GET","POST"]
    }
});

// socket programming works on events of nodejs
// we are listening here for conection event and now we have to listen for new_message raised(emit) by the client
io.on('connection', (socket) => {
    console.log("Connection is established");

    socket.on("userEntered_event", (name) => {
        socket.username = name;
    })
    socket.on('new_message', (msg) => {

        let userMsg = {
            userName : socket.username,
            msg : msg
        }
        // as soon as we listen for new_message event we broadcast this msg to all the clients
        socket.broadcast.emit('broadcast_msg_event', userMsg) // first the client was broadcasting the new_msg event now the server is broadcasting to all the clients
    })
    socket.on("disconnect", () => {
        console.log("Disconnected");
    })
}) // takes the event as a parameter also returns instance of socket that can be used to later disconnect the connection


server.listen(3000, () => {
    console.log("App is listening on port 3000");
})