// VARIABLES
const resultStyle = { font: "bold 20px sans-serif", fill: "#53a82a" };
const playStyle = { font: "bold 30px sans-serif", fill: "#53a82a" };

// GAME OVER SCENE
class GameOverScene extends Phaser.Scene{
    constructor(){
        super('GameOverScene')
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
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        })
        
        this.add.text(this.game.renderer.width / 2 - 80, 250, `Your Score ${food.score}`, resultStyle);
        this.add.text(this.game.renderer.width / 2 - 80, 350, `Best Score ${highestScoreTextValue.text}`, resultStyle);
        this.add.text(this.game.renderer.width / 2 + 10, this.game.renderer.height / 2, 'PLAY AGAIN', playStyle).setOrigin(0.5);
    }
}