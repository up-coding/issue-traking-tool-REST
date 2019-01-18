const socketio = require('socket.io');
const mongoose = require('mongoose');
const shortid = require('shortid');
const events = require('events');
const eventEmitter = new events.EventEmitter();
const tokenLib = require("./tokenLib.js");
const Comment = require('../models/CommentModel');

let setServer = (server) => {

   // let allOnlineUsers = []

    let io = socketio.listen(server);

    let myIo = io.of('/')

    myIo.on('connection',(socket) => {
        console.log("on connection--emitting verify user");
        socket.emit("verifyUser", "");
        socket.on('set-user',(authToken) => {
            console.log("set-user called")
            tokenLib.verifyClaimWithoutSecret(authToken,(err,user)=>{
                if(err){
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth token' })
                }
                else{
                    console.log("user is verified..setting details");
                    let currentUser = user.data;
                    // setting socket user id 
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    console.log(`${fullName} is online`);
                    socket.emit('assigned-issue-list',"");
/* 
                    let userObj = {userId:currentUser.userId,fullName:fullName}
                    allOnlineUsers.push(userObj)
                    console.log(allOnlineUsers)

                    // setting room name
                    socket.room = 'edChat'
                    // joining chat-group room.
                    socket.join(socket.room)
                    socket.to(socket.room).broadcast.emit('online-user-list',allOnlineUsers); */

                }


            })
          
        }) // end of listening set-user event


        socket.on('disconnect', () => {
            // disconnect the user from socket
            // remove the user from online list
            // unsubscribe the user from his own channel

            console.log("user is disconnected");
            // console.log(socket.connectorName);
            console.log(socket.userId);


           /*  var removeIndex = allOnlineUsers.map(function(user) { return user.userId; }).indexOf(socket.userId);
            allOnlineUsers.splice(removeIndex,1)
            console.log(allOnlineUsers)

            socket.to(socket.room).broadcast.emit('online-user-list',allOnlineUsers);
            socket.leave(socket.room) */


            

        


        }) // end of on disconnect


        socket.on('comment', (data) => {
            console.log("socket comment called")
            console.log(data);
            data.commentId = shortid.generate();
            console.log(data.commentId);
            console.log('after adding id');
            console.log(data);

            // event to save chat.
            setTimeout(function(){
                eventEmitter.emit('save-comment', data);
                console.log('comment saving');
            },2000)
            //myIo.emit(data.receiverId,data)

        });

         




    });

}


// database operations are kept outside of socket.io code.

 
eventEmitter.on('save-comment', (data) => {

    // let today = Date.now();
     console.log('comment saved');
    let newComment = new Comment({
        issueId:data.issueId,
         
        senderName: data.senderName,
        senderId: data.senderId,
        comment: data.comment,
        createdOn: data.createdOn

    });

    newComment.save((err,result) => {
        if(err){
            console.log(`error occurred: ${err}`);
        }
        else if(result == undefined || result == null || result == ""){
            console.log("Comment Is Not Saved.");
        }
        else {
            console.log("Comment Saved.");
            console.log(result);
        }
    });

}); // end of saving chat.

module.exports = {
    setServer: setServer
}