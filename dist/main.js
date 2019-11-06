"use strict";

var boardWidth = 28;
var boardHeight = 31;
var pacman = document.getElementById("pacman");
var board = document.getElementById("board");
var scoreBoard = document.getElementById("score");
var score = 0;
var moveAvailable = true;
var player = {
  id: pacman,
  x: 13,
  y: 17
};
var boardMap = ["############################", "#............##............#", "#.####.#####.##.#####.####.#", "#.####.#####.##.#####.####.#", "#.####.#####.##.#####.####.#", "#..........................#", "#.####.##.########.##.####.#", "#.####.##.########.##.####.#", "#......##....##............#", "######.#####.##.#####.######", "    ##.#####.##.#####.##    ", "    ##.##..........##.##    ", "    ##.##.########.##.##    ", "######.##.########.##.######", "..........########..........", "######.##.########.##.######", "    ##.##.########.##.##    ", "    ##.##.        .##.##    ", "    ##.##.########.##.##    ", "######.##.########.##.######", "#............##............#", "#.####.#####.##.#####.####.#", "#.####.#####.##.#####.####.#", "#...##................##...#", "###.##.##.########.##.##.###", "###.##.##.########.##.##.###", "#......##....##....##......#", "#.##########.##.##########.#", "#.##########.##.##########.#", "#..........................#", "############################"];
var allPositions = boardMap.flatMap(function (row, y) {
  return row.split("").map(function (_char, x) {
    return {
      x: x,
      y: y,
      "char": _char
    };
  });
});

var drawWalls = function drawWalls(x, y) {
  var wall = document.createElement("div");
  wall.classList.add("wall");
  wall.style.gridArea = "".concat(y + 1, "/").concat(x + 1, "/").concat(y + 2, "/").concat(x + 2);
  board.appendChild(wall);
};

var drawDots = function drawDots(x, y) {
  var dot = document.createElement("div");
  dot.classList.add("dot");
  dot.id = "dot".concat(x, ":").concat(y);
  dot.style.gridArea = "".concat(y + 1, "/").concat(x + 1, "/").concat(y + 2, "/").concat(x + 2);
  board.appendChild(dot);
};

var walls = allPositions.filter(function (item) {
  return item["char"] === "#";
});
var dots = allPositions.filter(function (item) {
  return item["char"] === ".";
});
walls.forEach(function (wall) {
  return drawWalls(wall.x, wall.y);
});
dots.forEach(function (dot) {
  return drawDots(dot.x, dot.y);
});

var updateGridPosition = function updateGridPosition() {
  player.id.style.gridArea = "".concat(player.y + 1, "/").concat(player.x + 1, "/").concat(player.y + 2, "/").concat(player.x + 2);
  moveAvailable = true;
};

var pacmanAnimation = function pacmanAnimation(translateDirection, keyframesStyle) {
  player.id.animate(pacmanAnimationData(translateDirection, keyframesStyle), {
    direction: 'normal',
    easing: 'linear',
    duration: 190,
    iterations: 1
  });
};

var pacmanAnimationData = function pacmanAnimationData(translateDirection, keyframesStyle) {
  return [{
    transform: "".concat(translateDirection, "(0px)")
  }, {
    transform: "".concat(translateDirection, "(").concat(keyframesStyle, ")")
  }];
};

var updatePacman = function updatePacman(direction) {
  if (direction === undefined) {
    updateGridPosition();
  } else {
    switch (direction) {
      case "L":
        pacmanAnimation('translateX', '-10px');
        break;

      case "R":
        pacmanAnimation('translateX', '10px');
        break;

      case "U":
        pacmanAnimation('translateY', '-10px');
        break;

      case "D":
        pacmanAnimation('translateY', '10px');
        break;
    }

    moveAvailable = false;
    setTimeout(function () {
      return updateGridPosition();
    }, 200);
  }
};

updatePacman();
window.addEventListener("keydown", function (event) {
  if (moveAvailable) {
    var currentPosition = {
      x: player.x,
      y: player.y
    };
    var direction;

    switch (event.code) {
      case "ArrowRight":
        player.x = player.x + 1;
        console.log("R", player.x, player.y);
        direction = "R";
        break;

      case "ArrowLeft":
        player.x = player.x - 1;
        console.log("L", player.x, player.y);
        direction = "L";
        break;

      case "ArrowUp":
        player.y = player.y - 1;
        console.log("U", player.x, player.y);
        direction = "U";
        break;

      case "ArrowDown":
        player.y = player.y + 1;
        console.log("D", player.x, player.y);
        direction = "D";
        break;
    }

    if (player.x < 0 || player.x > boardWidth - 1) {
      player.x = currentPosition.x;
    }

    if (player.y < 0 || player.y > boardHeight - 1) {
      player.y = currentPosition.y;
    }

    walls.forEach(function (wall) {
      if (player.x === wall.x && player.y === wall.y) {
        player.x = currentPosition.x;
        player.y = currentPosition.y;
      }
    });
    dots.forEach(function (dot, index) {
      var dotElement;

      if (player.x === dot.x && player.y === dot.y) {
        dotElement = document.getElementById("dot".concat(dot.x, ":").concat(dot.y));
        dots.splice(index, 1);
        dotElement.parentNode.removeChild(dotElement);
        score += 100;
        scoreBoard.innerText = score;
      }
    });
    updatePacman(direction);
  }
});
//# sourceMappingURL=main.js.map