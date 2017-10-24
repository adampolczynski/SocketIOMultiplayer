var game = new Phaser.Game(600, 400, Phaser.AUTO, document.getElementById('game'));

game.state.add('Game',Game);
game.state.start('Game');