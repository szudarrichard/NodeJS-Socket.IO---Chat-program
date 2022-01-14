const http = require('http');
const express = require('express');
const ejs = require('ejs');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const port = 3000;
const io = socketio(server);

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req,res) => {
    res.render('index');
});


app.post('/chat', (req, res)=> {
    res.render('chat');
});

server.listen(port, () => {
    console.log(`Server listening on port: ${port}...`);
});