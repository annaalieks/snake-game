// MENU SCENE
class MenuScene extends Phaser.Scene{
    constructor(){
        super('MenuScene')
    }

    preload() {
        this.load.image('bg', './assets/images/bg.jpg');
        this.load.image('play', './assets/images/play.svg')
    }

    create() {
        this.add.image(0, 0, 'bg').setOrigin(0);
        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'play');
        
        playButton.setInteractive({
            useHandCursor: true
        });
        playButton.on('pointerover',() => {
            playButton.setScale(1.1, 1.1)
        })
        playButton.on('pointerout',() => {
            playButton.setScale(1.0, 1.0)
        })
        playButton.on('pointerdown',() => {
            this.scene.start('GameScene');
        })       
    }
}