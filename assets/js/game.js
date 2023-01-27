// VARIBLES

// Main game variables
let snake;
let food;
let cursors;

// Direction variables
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

// Counter variables
// Text style variable
const textStyle = { font: "bold 15px sans-serif", fill: "#000", align: "center" };

// Icons counter variables
let score;
let speed;
let highestScore;

// Text counter variables
let scoreTextValue;
let speedTextValue;
let highestScoreTextValue;

// Storage variable
let savedBestResult;

// New scene transition variables
let pause;
let play;


// GAME SCENE
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
    }

    preload() {
        this.load.image('body', './assets/images/snake.svg');
        this.load.image('food', './assets/images/apple.svg');
        this.load.image('score', './assets/images/score.svg');
        this.load.image('speed', './assets/images/speed.svg');
        this.load.image('cup', './assets/images/cup.svg');
        this.load.image('pause', './assets/images/pause.svg');
        this.load.image('resume', './assets/images/resume.svg');
    }

    create() {

        let Food = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Food(scene, x, y) {
                    Phaser.GameObjects.Image.call(this, scene)

                    this.setTexture('food');
                    this.setPosition(x * 25, y * 25);
                    this.setOrigin(0);

                    this.score = 0;

                    // Set scoreboard
                    scoreTextValue.text = this.score.toString();
                    // Set best scoreboard
                    this.trackBestResult();

                    scene.children.add(this);
                },

            eat: function () {
                // Increase score
                ++this.score;

                // Refresh scoreboard
                scoreTextValue.text = this.score.toString();

                // Update best scoreboard
                this.trackBestResult();
            },

            trackBestResult: function () {

                savedBestResult = localStorage.getItem('bestResult');


                if (!savedBestResult) {
                    const bestResult = 0;
                    highestScoreTextValue.text = bestResult.toString();
                } else {
                    highestScoreTextValue.text = JSON.parse(savedBestResult);
                }

                if (Number(highestScoreTextValue.text) <= Number(scoreTextValue.text)) {
                    localStorage.setItem('bestResult', JSON.stringify(scoreTextValue.text));
                    savedBestResult = localStorage.getItem('bestResult');
                    highestScoreTextValue.text = JSON.parse(savedBestResult);
                }
            }
        });

        let Snake = new Phaser.Class({

            initialize:

                function Snake(scene, x, y) {
                    this.headPosition = new Phaser.Geom.Point(x, y);

                    this.body = scene.add.group();

                    this.head = this.body.create(x * 25, y * 25, 'body');
                    this.head.setOrigin(0);

                    this.alive = true;

                    this.speed = 150;

                    // Set speed value
                    this.speedValue = 0;
                    speedTextValue.text = this.speedValue.toString();

                    this.moveTime = 0;

                    this.tail = new Phaser.Geom.Point(x, y);

                    this.heading = RIGHT;
                    this.direction = RIGHT;
                },

            update: function (time) {
                if (time >= this.moveTime) { 
                    return this.move(time); 
                }
            },

            faceLeft: function () {
                if (this.direction === UP || this.direction === DOWN) {
                    this.heading = LEFT;
                }
            },

            faceRight: function () {
                if (this.direction === UP || this.direction === DOWN) {
                    this.heading = RIGHT;
                }
            },

            faceUp: function () {
                if (this.direction === LEFT || this.direction === RIGHT) {
                    this.heading = UP;
                }
            },

            faceDown: function () {
                if (this.direction === LEFT || this.direction === RIGHT) {
                    this.heading = DOWN;
                }
            },

            move: function (time) {
                
                // Based on the heading property (which is the direction the group pressed) we update the headPosition value accordingly. 
                // The Math.wrap call allow the snake to wrap around the screen.

                switch (this.heading) {
                    case LEFT:
                        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 35);
                        break;

                    case RIGHT:
                        this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 35);
                        break;

                    case UP:
                        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 25);
                        break;

                    case DOWN:
                        this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 25);
                        break;
                }

                this.direction = this.heading;

                //  Update the body segments and place the last coordinate into this.tail
                Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 25, this.headPosition.y * 25, 1, this.tail); // (items, x, y, [direction] (The iteration direction. 0 = first to last and 1 = last to first.), [output])

                //  Check to see if any of the body pieces have the same x/y as the head
                //  If they do, the head ran into the body

                let hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1); // (group.getChildren(), compare, index)

                if (hitBody) {

                    this.alive = false;

                    return false;
                } else {
                    //  Update the timer ready for the next movement
                    this.moveTime = time + this.speed;

                    return true;
                }
            },

            grow: function () {
                let newPart = this.body.create(this.tail.x, this.tail.y, 'body');

                newPart.setOrigin(0);
            },

            collideWithFood: function (food) {
                if (this.head.x === food.x && this.head.y === food.y) {
                    this.grow();

                    food.eat();

                    //  For every 5 items of food eaten we'll increase the snake speed a little
                    if (this.speed > 20 && food.score % 5 === 0) {
                        this.speed -= 10;
                        
                        // Refresh speed value
                        ++this.speedValue;
                        speedTextValue.text = this.speedValue.toString();
                    }

                    return true;

                } else {
                    return false;
                }
            },

            updateGrid: function (grid) {
                //  Remove all body pieces from valid positions list
                this.body.children.each(function (segment) {

                    let bx = segment.x / 25;
                    let by = segment.y / 25;

                    grid[by][bx] = false;

                });

                return grid;
            },

            // We can place the food anywhere in our 35x25 grid except on-top of the snake, so we need to filter those out of the possible food locations.
            // Method repositionFood return {boolean} true if the food was placed, otherwise false

            repositionFood: function () {
                //  First create an array that assumes all positions are valid for the new piece of food
                //  A Grid we'll use to reposition the food each time it's eaten
                let testGrid = [];

                for (let y = 0; y < 25; y++) {
                    testGrid[y] = [];

                    for (let x = 0; x < 35; x++) {
                        testGrid[y][x] = true;
                    }
                }

                snake.updateGrid(testGrid);

                //  Purge out false positions
                let validLocations = [];

                for (let y = 0; y < 25; y++) {
                    for (let x = 0; x < 35; x++) {
                        if (testGrid[y][x] === true) {
                            //  Is this position valid for food? If so, add it here ...
                            validLocations.push({ x: x, y: y });
                        }
                    }
                }

                if (validLocations.length > 0) {
                    //  Use the RNG to pick a random food position
                    let pos = Phaser.Math.RND.pick(validLocations);

                    //  And place it
                    food.setPosition(pos.x * 25, pos.y * 25);

                    return true;
                } else {
                    return false;
                }
            }

        });

        let Icon = new Phaser.Class({

            Extends: Phaser.GameObjects.Image,

            initialize:

                function Icon (scene, x, y, texture) {
                    Phaser.GameObjects.Image.call(this, scene)

                    this.setTexture(texture);
                    this.setPosition(x, y);
                    this.setOrigin(0);

                    scene.add.existing(this);
                }
        });

        let CounterValue = new Phaser.Class({

            Extends: Phaser.GameObjects.Text,

            initialize:

                function CounterValue(scene, x, y, text, style) {
                    Phaser.GameObjects.Text.call(this, scene)

                    this.setPosition(x, y);
                    this.setText(text);
                    this.setStyle(style);

                    scene.add.existing(this);
                }
        });

        // Icons
        score = new Icon(this, 10, 10, 'score');
        speed = new Icon(this, 10, 30, 'speed');
        highestScore = new Icon(this, 10, 50, 'cup'); 
        pause = new Icon(this, 10, 70, 'pause');
        play = new Icon(this, 10, 70, 'resume');
        play.visible = false;

        // Pause
        pause.setInteractive({
            useHandCursor: true
        });
        pause.on('pointerup',() => {
            this.scene.pause();
            this.scene.launch('PausedScene');
        })

        // Counter values
        scoreTextValue = new CounterValue(this, 35, 8, this.score, textStyle);
        speedTextValue = new CounterValue(this, 35, 28, this.speedValue, textStyle);
        highestScoreTextValue = new CounterValue(this, 35, 48, this.bestResult, textStyle);
        
        // Food
        food = new Food(this, 7, 7);

        // Snake
        snake = new Snake(this, 10, 10);

        // Keyboard controls
        cursors = this.input.keyboard.createCursorKeys();
    }

    // Update
    update (time) {
        if (!snake.alive) {
            this.scene.start('GameOverScene');
        }

        // Check which key is pressed, and then change the direction the snake is heading based on that.
        if (cursors.left.isDown) {
            snake.faceLeft();
        } else if (cursors.right.isDown) {
            snake.faceRight();
        } else if (cursors.up.isDown) {
            snake.faceUp();
        } else if (cursors.down.isDown) {
            snake.faceDown();
        }

        if (snake.update(time)) {
            //  If the snake updated, we need to check for collision against food

            if (snake.collideWithFood(food)) {
                snake.repositionFood();
            }
        }
    }
}