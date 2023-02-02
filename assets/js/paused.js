// VARIABLES
const pausedStyleDark = { font: "bold 25px sans-serif", fill: "#000" };
const pausedStyleGreen = { font: "bold 25px sans-serif", fill: "#88B04B" };
let pausedText;

// GAME OVER SCENE
class PausedScene extends Phaser.Scene{
    constructor(){
        super('PausedScene')
    }

    create() {     
        this.cursors = this.input.keyboard.createCursorKeys();

        pause.visible = false;

        if (!darkMode) {
            pausedText = this.add.text(this.game.renderer.width / 2 + 10, this.game.renderer.height / 2, `PAUSED MODE. PRESS THE MOUSE OR SPACE TO CONTINUE`, pausedStyleDark).setOrigin(0.5);
        } else {
            pausedText = this.add.text(this.game.renderer.width / 2 + 10, this.game.renderer.height / 2, `PAUSED MODE. PRESS THE MOUSE OR SPACE TO CONTINUE`, pausedStyleGreen).setOrigin(0.5);
        }

        this.input.on('pointerdown', function () {
            this.scene.resume('GameScene');
            pausedText.visible = false;
            pause.visible = true;
        }, this);  

    }

    update() {
        if (this.cursors.space.isDown) {
            this.scene.resume('GameScene');
            pausedText.visible = false;
            pause.visible = true;
        }
    }
}