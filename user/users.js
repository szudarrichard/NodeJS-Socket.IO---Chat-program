const users = [];

//Felhasználó belépése a chatbe
function joinUser(id, name, room){
    const user = {id, name, room};
    users.push(user);
    return users;
}

//Minden felhasználó kiírása a szobában
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

module.exports = {
    joinUser,
    getRoomUsers
}