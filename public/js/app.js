let socket = io();
let roomname = document.querySelector('#roomname');
let userslist = document.querySelector('#userslist');
let chatMessages = document.querySelector('.chat-messages');
let msgTxt = document.getElementById('msgTxt');
let sendBtn = document.querySelector('#sendBtn');

//Kliens csatlakozott a szerverhez
socket.emit('JoinToRoom');

//Update room data
socket.on('updateRoom', (room, users)=>{
    outputRoomName(room);
    outputUserList(users);
});

//Üzenet fogadása
socket.on('message',(msg)=>{
    outputMessages(msg);
});

//Üzenet elküldése
document.addEventListener('click',()=>{
    let msg = msgTxt.value;
    if(msg != '')
    {
        socket.emit('message', msg);
        msgTxt.value = '';
        msgTxt.focus();
    }
});

//Beleírja a szobanevet a chatbe hogy melyikbe lépett be és ki
function outputRoomName(room){
    roomname.innerHTML = room;
};

//Beírja a szobában tartózkodó embereket az ul-en belülre
//li-be
function outputUserList(users){
    userslist.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = user.name;
        userslist.appendChild(li);
    });
};

// Beírja a chatbe az üzeneteket (ki lépett be)
function outputMessages(message){
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('uname');
    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`
    div.appendChild(p);
    const p2 = document.createElement('p');
    p2.innerText = message.text;
    div.appendChild(p2);
    chatMessages.appendChild(div);
};