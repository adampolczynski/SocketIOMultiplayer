var Client = {};
Client.socket = io.connect();

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};
Client.sendClick = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};
Client.movePlayerByKeyboard = function(x,y){
    Client.socket.emit('keypressed', x,y);
};
Client.checkIfCollided = function(x,y) {
    Client.socket.emit('check if collided', x, y);
}
Client.socket.on('show star', function(x,y) {
   Game.addStar(x, y);
});
Client.socket.on('star catched', function() {
    Game.resetStar();
    Client.socket.emit('add points');
});
Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.nickname,data.x,data.y);
});
Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].nickname,data[i].x,data[i].y);
    }
    Client.socket.on('move',function(data){
        Game.movePlayer(data.id,data.x,data.y);
    });
    Client.socket.on('keyboard move', function(data) {
       Game.movePlayer(data.id, data.x, data.y);
    });
    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });
});