const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { genetateMessage, generateLocationMessage } = require('./utils/mesaages')
const { addUser,removeUser,getUser,getUserInRoom } = require('./utils/users')

const app = express()

const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

// server (emit) -> client (receive) - countUpdated
// clinet (emit) -> server (receive) - increment 
// emit methods so far : socket.emit, io.emit, socket.broadcast.emit, || or add .to() before .emit
let wlcMsg = 'Welcome!'
io.on('connection', (socket)=>{
    console.log('New webSocket connection');
    
    socket.on('join', ( { username, room }, callback )=>{
        const { error, user } = addUser({id : socket.id, username, room})

        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', genetateMessage(wlcMsg,'Admin'))
        socket.broadcast.to(user.room).emit('message', genetateMessage(`${user.username} has joined!`,'Admin'))
        io.to(user.room).emit('roomData', {
            room : user.room,
            users : getUserInRoom(user.room)
        })
        callback()
    })
    
    socket.on('sendMessage',(message, callback)=>{
        const user = getUser(socket.id)

        io.to(user.room).emit('message', genetateMessage(message,user.username ))
        callback('indeed')
    })



    socket.on('sendLocation', (location, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(`http://www.google.com/maps?q=${location.lat},${location.lon}`, user.username))
        callback()

    })

    

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', genetateMessage(`${user.username} has left`, 'Admin'))
            io.to(user.room).emit('roomData', {
                room : user.room,
                users : getUserInRoom(user.room)
            })
        }
        
        
    })
    // socket.emit('countUpdated', count)
    // socket.on('increment', ()=>{
    //     count++
    //     io.emit('countUpdated', count)
    // })

})




server.listen(port, ()=>{
    console.log(`Server up on port ${port}`);
})