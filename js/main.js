var game = new Phaser.Game(600, 700, Phaser.AUTO, document.getElementById('game'));

game.state.add('Game',Game);
game.state.start('Game');