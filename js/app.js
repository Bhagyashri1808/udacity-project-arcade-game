const starUl = document.querySelector(".star");
const levelSpan = document.querySelector(".level-div").querySelector("span");
let interval;
// Enemies our player must avoid
class Enemy {
  constructor(startPosition, speed) {
    // The image/sprite for our enemies, this uses
    this.sprite = 'images/enemy-bug.png';
    //this is predefined so each enemy starts at the same point on x
    this.x = -90;
    this.y = startPosition;
    this.startPosition = startPosition;
    this.speed = speed;
    this.speeds = [100, 150, 200, 250, 300, 350, 400, 450];
  }
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    this.x = this.x + this.speed * dt;
    if (this.x > ctx.canvas.width) {
      this.reset();
    }
  }

  // Draw the enemy on the screen, required method for game
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    //check for collision between enemy and player
    this.detectCollision();
  }
  // resets the enemy to startPosition to get that moving animation
  reset() {
    this.x = -90;
    this.y = this.startPosition;
  }

  /**
  *calculate the x and y distance between enemy and player to check if both collide
  *with each other and change the sprite to show there was collision and reset the
  *sprite back to normal
  */
  detectCollision() {
    var horizontalDistance = player.x - this.x;
    var verticalDistance = player.y - this.y;

    if (horizontalDistance > -40 && horizontalDistance < 40 &&
      verticalDistance > -65 && verticalDistance < 65) {
      player.crash = true;
      let interval = setInterval(function() {
        player.crash = false;
        player.reset();
        clearInterval(interval);
      }, 200);
    }
  }
}

// player class
class Player {
  constructor(startPosition) {
    this.sprite = 'images/char-boy.png';
    this.crash = false; // to detectCollision
    this.win = false; //to change sprite when player wins
    this.x = 2 * 101;
    this.y = 4 * 83;
    this.startPosition = startPosition;
    this.moved = false; //used to call update fn only when player is moved
    this.directionOfMove = ""; //stores the direction of player
    this.level = 1; //initial level
    this.leveltype = "Easy"; //initial difficult level is set to easy.
  }


  update(dt) {
    //update is called everytime but we need to execute only when the player is moved
    if (this.moved) {
      if (this.directionOfMove === 'up') {
        this.y = this.y - 1000 * dt;
      } else if (this.directionOfMove === 'down') {
        this.y = this.y + 1000 * dt;
      }
      this.moved = false;
      //show win sprite once the player reached water
      if (this.y < 10 && !this.win) {
        this.win = true;
        let j = setInterval(function() {
          player.win = false;
          var li = document.createElement("li");
          //add star every time player wins
          li.className = "fas fa-star fa-2x";
          starUl.appendChild(li);
          //Update the level by 1
          levelSpan.innerHTML = `${++player.level}`;
          //change the difficulty level after some level
          if (player.level > 5 && player.leveltype === "Easy")
            changeLevelToMedium();
          else if (player.level > 12 && player.leveltype === "Medium")
            changeLevelToDifficult();
          player.reset();
          clearInterval(j);
        }, 300);
      }


      if (this.directionOfMove === 'left')
        this.x = this.x - 1000 * dt;
      else if (this.directionOfMove === 'right')
        this.x = this.x + 1000 * dt;
      //check that player should not move outof canvas
      if (this.x < 10 || this.x > ctx.canvas.width || this.y > 400) {
        this.reset();
      }
    }
  }
  render() {
    //render different sprites when crashed and win.
    if (this.crash)
      ctx.drawImage(Resources.get('images/argh.png'), this.x + 50, this.y + 50, 100, 100);
    else if (this.win)
      ctx.drawImage(Resources.get('images/stickmanhappy.png'), this.x + 50, this.y + 50, 100, 100);
    else
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  handleInput(keyCode) {
    this.moved = true;
    switch (keyCode) {
      case "up":
        this.directionOfMove = keyCode;
        break;
      case "down":
        this.directionOfMove = keyCode;
        break;
      case "left":
        this.directionOfMove = keyCode;
        break;
      case "right":
        this.directionOfMove = keyCode;
        break;
      default:
        this.moved = false;
    }
  }
  reset() {
    //bring player back to the startPosition
    this.x = 2 * 101;
    this.y = 4 * 83;
  }
}
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

//This function pops up a modal where difficulty level and player can be choosed
function myFunction() {

  var modal = document.querySelector(".modal");
  modal.style.display = "block";

  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";
  x.addEventListener('click', changeSettings);
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  span.onclick = function() {
    modal.style.display = "none";
  }
}

//This function changes the settings according to the level selected.
function changeSettings(e) {
  if (e.target.nodeName === "INPUT" && e.target.name === "player") {
    e.target.checked = "true";
    player.sprite = `images/char-${e.target.value}.png`;
  } else if (e.target.nodeName === "INPUT" && e.target.name === "leveltype" && e.target.value === "Medium") {
    changeLevelToMedium();
  } else if (e.target.nodeName === "INPUT" && e.target.name === "leveltype" && e.target.value === "Difficult") {
    changeLevelToDifficult();
  } else if (e.target.nodeName === "INPUT" && e.target.name === "leveltype" && e.target.value === "Easy") {
    if (interval)
      clearInterval(interval);
    player.leveltype = "Easy";
    document.getElementById("difficulty-span").innerHTML = "Easy";
    allEnemies[0].speed = 90;
    allEnemies[1].speed = 250;
    allEnemies[2].speed = 100;
  }
}

function changeLevelToMedium() {
  if (interval)
    clearInterval(interval);
  player.leveltype = "Medium";
  document.getElementById("difficulty-span").innerHTML = "Medium";
  //ever .5 ms shuffle the speed array to just spice up the game
  interval = setInterval(function() {
    let array = [150, 200, 250]; // 300, 350, 400, 450];
    let currentIndex = array.length,
      temporaryValue, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    for (let i = 0; i < allEnemies.length; i++) {
      allEnemies[i].speed = array[i];
    }
  }, 500);
}

function changeLevelToDifficult() {
  if (interval)
    clearinterval(interval);
  player.leveltype = "Defficult";
  document.getElementById("difficulty-span").innerHTML = "Difficult";
  //ever .5 ms shuffle the speed array to just spice up the game
  interval = setInterval(function() {
    let array = [350, 400, 450, 150, 200, 250];
    let currentIndex = array.length,
      temporaryValue, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    for (let i = 0; i < allEnemies.length; i++) {
      allEnemies[i].speed = array[i];
    }
    }, 500);
}
