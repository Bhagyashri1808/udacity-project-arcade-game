// Enemies our player must avoid
class Enemy {
  constructor(startPosition, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = -1;
    this.y = startPosition;
    this.startPosition = startPosition;
    this.speed = speed;
    this.speeds = [100, 150, 200, 250, 300, 350, 400, 450];
  }

  update(dt) {
    // console.log(dt);
    this.x = this.x + this.speed * dt;
    if (this.x > ctx.canvas.width) {
      this.reset();
    }
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.detectCollision();
  }
  reset() {
    this.x = -1;
    this.y = this.startPosition;
  }
  detectCollision(){
    var horizontalDistance = player.x - this.x;
    var verticalDistance = player.y - this.y;

    if (horizontalDistance > -50 && horizontalDistance < 50 &&
        verticalDistance > -30 && verticalDistance < 30) {
        player.reset();
    }
  }

}

class Player {
  constructor(startPosition) {
    this.sprite = 'images/char-boy.png';
    this.x = 2 * 101;
    this.y = 4 * 83;
    this.startPosition = startPosition;
    this.moved = false;
    this.directionOfMove = "";
  }

  update(dt) {
    if (this.moved) {
      if (this.directionOfMove === 'up') {
        this.y = this.y - 1000 * dt;
      } else if (this.directionOfMove === 'down') {
        this.y = this.y + 1000 * dt;
      }
      this.moved = false;
      // console.log(this.y);
      if (this.y < 10) {
        this.reset();
      }
      if (this.directionOfMove === 'left')
        this.x = this.x - 1000 * dt;
      else if (this.directionOfMove === 'right')
        this.x = this.x + 1000 * dt;
      if (this.x < 10) {
        this.reset();
      }
    }
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  handleInput(keyCode) {
    this.moved = true;
    switch (keyCode) {
      case "up":
        // this.y -= 200;
        this.directionOfMove = keyCode;
        break;
      case "down":
        // this.y += 200;
        this.directionOfMove = keyCode;
        break;
      case "left":
        // this.x -= 200;
        this.directionOfMove = keyCode;
        break;
      case "right":
        // this.x += 200;
        this.directionOfMove = keyCode;
        break;
      default:
        this.moved = false;
    }
    // if (this.y > ctx.canvas.height) {
    //     this.reset();
    // }
  }
  reset() {
    //bring player back to the startPosition
    this.x = 2 * 101;
    this.y = 4 * 83;
  }
}
// var Enemy = function(){
//     // Variables applied to each of our instances go here,
//     // we've provided one for you to get started
//
//     // The image/sprite for our enemies, this uses
//     // a helper we've provided to easily load images
//     this.sprite = 'images/enemy-bug.png';
// };
// console.log(typeof Enemy);
// // Update the enemy's position, required method for game
// // Parameter: dt, a time delta between ticks
// Enemy.prototype.update = function(dt) {
//     // You should multiply any movement by the dt parameter
//     // which will ensure the game runs at the same speed for
//     // all computers.
// };
//
// // Draw the enemy on the screen, required method for game
// Enemy.prototype.render = function() {
//     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// };

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
// var Player = function(){
//   this.sprite = 'images/char-boy.png';
// };
//
// Player.prototype.update = function(dt) {
//
// };
//
// Player.prototype.render = function() {
//     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// };
//


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
  new Enemy(60, 90),
  new Enemy(145, 250),
  new Enemy(230, 100),
];

let player = new Player(2);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});
