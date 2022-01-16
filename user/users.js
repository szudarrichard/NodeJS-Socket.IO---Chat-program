const users = [];

//Felhasználó belépése a chatbe
function joinUser(id, name, room){
    const user = {id, name, room};
    users.push(user);
    return user;
}

//Jelenlegi személy lekérése
function getCurrentUser(id){
    return users.find(user => user.id === id);
}

//Minden felhasználó kiírása a szobában
function getRoomUsers(room){
    return users.filter(user => user.room === room);
}

//Felhasználó kilépett a szobából
function userLeave(id){
    const index = users.findIndex(user => user.id === id);
    if(index !== -1)
    {
        return users.splice(index, 1)[0];
    }
    
}

module.exports = {
    joinUser,
    getRoomUsers,
    userLeave,
    getCurrentUser
}