var express = require('express');
var app = express();
var server = require('http').Server(app);
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var io = require('socket.io')(server);
//var redis = require('socket.io-redis');

//io.adapter(redis({ host: 'localhost', port: 6379}));

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
server.listen(process.env.PORT || 3000,function(){
    console.log('Listening on '+server.address().port);
});
server.lastPlayderID = 0; // Keep track of the last id assigned to a new player
server.star = {x:randomInt(100,400), y: randomInt(100,400), vx:randomInt(20,80),vy:randomInt(20,80)}
io.on('connection',function(socket){
	console.log('connection has been made');
    io.emit('update ui', getAllPlayers());
    socket.on('newplayer',function(n){
        socket.player = {
            nickname: makeid(),
            id: server.lastPlayderID++,
            x: randomInt(100,400),
            y: randomInt(100,400),
            points: 0,
        };

        if (server.lastPlayderID == 2) { // waiting until two players in room available
            //io.emit('show star', server.star.x, server.star.y, server.star.vx, server.star.vy);
            io.emit('show start',server.star.x, server.star.y, server.star.vx, server.star.vy);
        }
        //io.emit('show star', server.star.x, server.star.y, server.star.vx, server.star.vy);
        io.emit('allplayers',getAllPlayers());
        socket.id = server.lastPlayderID;
        console.log("Player joined: "+socket.player.nickname);
        socket.emit('removeButton');
        socket.on('click',function(data){
            console.log('click to '+data.x+', '+data.y);
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move', socket.player);
        });
        socket.on('keypressed', function(x, y) {
           socket.player.x += x;
           socket.player.y += y;
           io.emit('move', socket.player);
        });
        socket.on('show star', function(x,y,vx,vy) {
            io.emit('show star',x,y,vx,vy);

        });
        socket.on('update star', function(x, y, vx, vy) {
           server.star.x = x;
           server.star.y = y;
           server.star.vx = vx;
           server.star.vy = vy;
           console.log('star position updated');
        });
        socket.on('check if collided', function(x, y) {
            //console.log('star.x:'+x+" player.x:"+socket.player.x);
            if ((x >= socket.player.x-20 && x <= socket.player.x+20) && (y >= socket.player.y-20 && y <= socket.player.y+20)) {
                console.log('colllllliddeeeee!!!');
                io.emit('star catched',randomInt(100,400), randomInt(100,400), randomInt(20,220), randomInt(20,220));
                socket.player.points += 20;
                io.emit('update ui', getAllPlayers());
            }

        });
        socket.on('disconnect', function() {
            io.emit('remove', socket.player.id);
            console.log('Player disconnected: '+socket.player.nickname);
            delete socket.player;
            server.lastPlayderID--;
        });
    });

});
function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;

        if(player) players.push(player);
        console.log('players amount: '+players.length);

    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function makeid() {
  var text = "User_";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 4; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}