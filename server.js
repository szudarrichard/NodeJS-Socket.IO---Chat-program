const http = require('http');
const express = require('express');
var session = require('express-session');
const path = require('path');
const mysql = require('mysql');
const ejs = require('ejs');
const socketio = require('socket.io');
const {joinUser, getRoomUsers, userLeave, getCurrentUser} = require('./user/users.js');
const {formatMessage} = require('./user/messages.js');
const app = express();
const server = http.createServer(app);
const port = 3000;
const io = socketio(server);

//MySql kapcsolat
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'SZR',
    password: '123456',
    database: '214szft_chat'
});

connection.connect((err) => {
    if(err) {
        console.log(err);
    }
    else {
        console.log('Connection success...');
    }
});

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

//Belépés és regisztráció
app.get('/login', (req,res) => {
    res.render('login');
});

app.post('/login', (req,res) => {
    var email = req.body.email;
    var pw = req.body.password;

    if (email == "" || pw == "") {
        ejs.renderFile("views/login.ejs", {hiba:"Adja meg a kötelező adatokat!"}, (err, data)=>{
            if (err) {
                console.log(err)
            }
            else{
                res.send(data);
            }
        })
    }
    else{
    connection.query(`SELECT * FROM users WHERE email = '${email}' AND passwd='${pw}'`, (err, data)=>{
            if (err) {
                console.log("hiba");
            }
            else{
                if(data.length!=0)
                {
                    res.redirect("/");
                }
                else
                {
                    console.log('rossz adat');
                }
                
            }
        });
    }
});

app.get('/register', (req,res) => {
    res.render('register');
});

app.post('/register', (req,res) => {
    var nev = req.body.name;
    var email = req.body.email;
    var pw1 = req.body.password;
    var pw2 = req.body.password2;

    if (nev == "" || email == "" || pw1 == "" || pw2 == "") {
        ejs.renderFile("views/register.ejs", {hiba:"Adja meg a kötelező adatokat!"}, (err, data)=>{
            if (err) {
                console.log(err)
            }
            else{
                res.send(data);
            }
        })
    }
    else{
        connection.query(`INSERT INTO users VALUES(null, '${nev}', '${email}', '${pw1}')`, (err, data)=>{
            if (err) {
                console.log("hiba");
            }
            else{
                res.redirect("/login");
            }
        });
    }
});

//Chat start
app.post('/chat', (req, res)=> {
    session.nickname = req.body.nickname;
    session.roomname = req.body.room;
    res.render('chat');
});

io.on('connection', (socket)=>{
    //Client connected to room
    socket.on('JoinToRoom', ()=>{
        const user = joinUser(socket.id, session.nickname, session.roomname);
        //Belépés a szobába
        socket.join(user.room);

        //Frissíti a szoba információt
        io.to(user.room).emit('updateRoom', session.roomname, getRoomUsers(session.roomname));

        //Üdvözli az éppen belépő embert
        socket.emit('message', formatMessage('System', `Üdv a ${user.room} szobában.`));

        //Megjeleníti ki lépett be a és melyik szobába mindenkinek(kivéve aki belépett)
        socket.broadcast.to(user.room).emit('message', formatMessage('System', `${user.name} belépett a  szobába!`));
    });

    //Megkapja az üzenetet
    socket.on('message',(msg)=>{
        const user = getCurrentUser(socket.id);
        //Megjeleníti a többi embernek a szobában az üzenetet
        socket.broadcast.to(user.room).emit('message', formatMessage(user.name, msg));
    });

    //Kilépés a szobából
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        //Kiíratjuk, hogy ki lépett ki a szobából
        io.to(user.room).emit('message',formatMessage('System', `${user.name} kilépett a szobából!`));

        //Frissítjük a szoba információt (ki jelentkezett ki)
        io.to(user.room).emit('updateRoom', user.room, getRoomUsers(user.room));

    });

});

server.listen(port, () => {
    console.log(`Server listening on port: ${port}...`);
});

