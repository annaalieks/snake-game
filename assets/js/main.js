// Phaser Game config object
let config = {
    type: Phaser.AUTO,
    width: 875,
    height: 625,
    backgroundColor: '#88b04b',
    scene: [
        MenuScene, GameScene, GameOverScene, PausedScene
    ]
};

// New Phaser.Game constructor
let game = new Phaser.Game(config);

