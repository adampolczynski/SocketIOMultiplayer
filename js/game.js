var Game = {};
var text;
var image;
Game.init = function(){
    Game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
	Game.load.image('block', 'assets/diamond.png');
	Game.load.image('flyer', 'assets/star.png');
	Game.load.image('settings', 'assets/settings.png');
	Game.load.image('background', 'assets/bg.jpg');
    /* game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
    game.load.image('sprite','assets/sprites/sprite.png'); */
};

Game.create = function(){
    Game.playerMap = {};
	Game.physics.startSystem(Phaser.Physics.ARCADE);

    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    //  and assign it to a variable
    game.add.image(0,0, 'background');




	this.stage.backgroundColor = '#88f0f0';


    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);

};
Game.update = function() {
    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        Client.movePlayerByKeyboard(-2, 0);


    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        Client.movePlayerByKeyboard(2, 0);

    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        Client.movePlayerByKeyboard(0, -2);

    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
        Client.movePlayerByKeyboard(0, 2);

    }
    if (image) {
        Client.checkIfCollided(image.world.x, image.world.y);

    }
}

Game.getCoordinates = function(layer,pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.addNewPlayer = function(id,nickname,x,y){
    if (Game.playerMap[id]) {
        Game.playerMap[id].kill();
    };
    var sprite = game.add.sprite(x,y,'block');//.addChild(text);
	var style = { font: "12px Arial", fill: "#ffffff" };
	text = game.add.text(0, -14, nickname, style);
	sprite.addChild(text);
    //game.physics.enable(sprite, Phaser.Physics.ARCADE);
    //sprite.body.collideWorldBounds = true;
    //sprite.body.immovable = true;
    //sprite.body.velocity.setTo(20,20);
    //sprite.body.bounce.setTo(0);
    //Game.physics.arcade.collide(image, sprite);

    Game.playerMap[id] = sprite;
};
Game.addStar = function(x, y, vx, vy) {
    if (image) {
        image.kill();
    }
    image = Game.add.sprite(x, y, 'flyer');

    Game.physics.enable(image, Phaser.Physics.ARCADE);

    //  This gets it moving
    image.body.velocity.setTo(vx,vy);

    //  This makes the game world bounce-able
    image.body.collideWorldBounds = true;

    //  This sets the image bounce energy for the horizontal
    //  and vertical vectors. "1" is 100% energy return
    image.body.bounce.set(1);
    image.inputEnabled = true;
}

Game.moveSprite = function(x,y) {
	image = game.add.sprite(x, y, 'flyer');
};
Game.movePlayer = function(id,x,y){
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x,player.y,x,y);
    var tween = game.add.tween(player);
    var duration = distance*10;
    tween.to({x:x,y:y}, duration);
    tween.start();
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};
function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}