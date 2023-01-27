// VARIABLES
const pausedStyle = { font: "bold 30px sans-serif", fill: "#000" };

// GAME OVER SCENE
class PausedScene extends Phaser.Scene{
    constructor(){
        super('PausedScene')
    }

    create() {       
        pause.visible = false;
        let pausedText = this.add.text(this.game.renderer.width / 2 + 10, this.game.renderer.height / 2, `PAUSED MODE. PRESS THE MOUSE TO CONTINUE`, pausedStyle).setOrigin(0.5);

        this.input.once('pointerdown', function () {
            this.scene.resume('GameScene');
            pausedText.visible = false;
            pause.visible = true;
        }, this);       
    }
}