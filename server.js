const http = require('http');
const express = require('express');
var session = require('express-session');
const ejs = require('ejs');
const socketio = require('socket.io');
const {joinUser, getRoomUsers} = require('./user/users.js');
const app = express();
const server = http.createServer(app);
const port = 3000;
const io = socketio(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req,res) => {
    res.render('index');
});


app.post('/chat', (req, res)=> {
    session.nickname = req.body.nickname;
    session.roomname = req.body.room;
    res.render('chat');
});

io.on('connection', (socket)=>{
    //Client connected to room
    socket.on('JoinToRoom', ()=>{
        const user = joinUser(socket.id, session.nickname, session.roomname);
        io.emit('updateRoom', session.roomname, getRoomUsers(session.roomname));
    });
});

server.listen(port, () => {
    console.log(`Server listening on port: ${port}...`);
});

