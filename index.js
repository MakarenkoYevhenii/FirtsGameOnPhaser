var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};
var game = new Phaser.Game(config);
let player;
let platforms;
let lastPlatform;
let bricks;
let newBrick;
let brickInfo;
let scoreText;
let score = 0;

function preload() {
  this.load.image("sky", "./assets/sky.png");
  this.load.image("bomb", "./assets/bomb.png");
  this.load.image("Platform", "./assets/platform.png");
  this.load.image("enemies", "./assets/platform.png");
}

function create() {
  this.add.image(400, 300, "sky");
  scoreText = this.add.text(5, 5, "Points: 0", {
    font: "18px Arial",
    fill: "#eb4034",
  });
  this.physics.world.checkCollision.down = false;
  player = this.physics.add.sprite(350, 300, "bomb");
  player.setVelocity(200, 300).setCollideWorldBounds(true).setBounce(1);
  paddle = this.physics.add
    .sprite(
      this.sys.game.config.width / 2,
      this.sys.game.config.height * 0.9,
      "Platform"
    )
    .setScale(0.5)
    .setImmovable(true);
  this.physics.add.collider(player, paddle);
  endGamePoke = this.add.rectangle(400, 600, 800, 100, 0x6666ff);

  brickInfo = {
    width: 50,
    height: 20,
    count: {
      row: 12,
      col: 5,
    },
    offset: {
      top: 50,
      left: 60,
    },
    padding: 10,
  };
  bricks = this.add.group();
  for (c = 0; c < brickInfo.count.col; c++) {
    for (r = 0; r < brickInfo.count.row; r++) {
      var brickX =
        r * (brickInfo.width + brickInfo.padding) + brickInfo.offset.left;
      var brickY =
        c * (brickInfo.height + brickInfo.padding) + brickInfo.offset.top;
      newBrick = this.physics.add.sprite(brickX, brickY, "enemies");
      newBrick.body.immovable = true;

      bricks.add(newBrick);
    }
  }
  Phaser.Actions.ScaleXY(bricks.getChildren(), -0.9, -0.5);
}

function update() {
  this.physics.add.collider(player, bricks, ballHitBrick);

  paddle.x =
    this.sys.game.input.activePointer.position.x ||
    this.sys.game.config.width * 0.5;

  function ballHitBrick(ball, brick) {
    brick.destroy();
    score += 10;
    scoreText.setText(`Points: ${score}`);
  }
  if (bricks.getChildren().length === 0) {
    console.log(bricks.getChildren().length);
    location.reload();
  }
  if (
    Phaser.Geom.Intersects.RectangleToRectangle(
      player.getBounds(),
      endGamePoke.getBounds()
    )
  ) {
    this.scene.restart();
  }
}
