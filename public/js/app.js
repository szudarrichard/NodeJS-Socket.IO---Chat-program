let socket = io();
let roomname = document.querySelector('#roomname');
let userslist = document.querySelector('#userslist');
 

//Kliens csatlakozott a szerverhez
socket.emit('JoinToRoom');

//Update room data
socket.on('updateRoom', (room, users)=>{
    outputRoomName(room);
    outputUserList(users);
});

socket.on('message',(msg)=>{
    console.log(msg);
})

//Beleírja a szobanevet a chatbe hogy melyikbe lépett be és ki
function outputRoomName(room){
    roomname.innerHTML = room;
}


//Beírja a szobában tartózkodó embereket az ul-en belülre
//li-be
function outputUserList(users){
    userslist.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = user.name;
        userslist.appendChild(li);

    });
}