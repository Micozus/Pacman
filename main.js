const pacman = document.getElementById("pacman");
const board = document.getElementById("board");
const scoreBoard = document.getElementById("score");

const pink = document.getElementById("ghostPink");

/*const blue = document.getElementById("ghostBlue");
const red = document.getElementById("ghostRed");
const green = document.getElementById("ghostGreen");*/

class PacmanElement {
    id;
    x;
    y;
    phase = "chase";
    // chase, scatter, frightened
    moveAvailable = true;

    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
    }

    updateElemGridPosition() {
        this.id.style.gridArea = `${this.y + 1}/${this.x + 1}/${this.y + 2}/${this.x + 2}`;
        this.moveAvailable = true;
    };

    elemAnimation(translateDirection, keyframesStyle) {
        this.id.animate(this.elemAnimationData(translateDirection, keyframesStyle), {
            direction: 'normal',
            easing: 'ease-in',
            duration: 190,
            iterations: 1
        });
    };

    elemAnimationData(translateDirection, keyframesStyle) {
        return [{transform: `${translateDirection}(0px)`},
            {transform: `${translateDirection}(${keyframesStyle})`}]
    };

    updateElem(direction) {
        if (direction === undefined) {
            this.updateElemGridPosition();
        } else {
            switch (direction) {
                case "L":
                    this.elemAnimation('translateX', '-10px');
                    break;
                case "R":
                    this.elemAnimation('translateX', '10px');
                    break;
                case "U":
                    this.elemAnimation('translateY', '-10px');
                    break;
                case "D":
                    this.elemAnimation('translateY', '10px');
                    break;
            }
            this.moveAvailable = false;
            setTimeout(() => this.updateElemGridPosition(), 195);
            this.eatDot();
        }
    };

    pickViablePath() {
        const elemCurrentPosition = {
            x: this.x,
            y: this.y
        };
        const basicPaths = [
            // Right
            {
                x: elemCurrentPosition.x + 1,
                y: elemCurrentPosition.y,
                direction: "ArrowRight"
            },
            // Left
            {
                x: elemCurrentPosition.x - 1,
                y: elemCurrentPosition.y,
                direction: "ArrowLeft"
            },
            // Up
            {
                x: elemCurrentPosition.x,
                y: elemCurrentPosition.y - 1,
                direction: "ArrowUp"
            },
            // Down
            {
                x: elemCurrentPosition.x,
                y: elemCurrentPosition.y + 1,
                direction: "ArrowDown"
            }
        ];
        return basicPaths.filter(path => {
            return (game.walls.find(wall => wall.x === path.x &&
                wall.y === path.y) === undefined) &&
                !(path.x < 0 || path.x > game.boardWidth - 1)
        });
    };

    pickPlayerDirection(event) {
        if (this.pickViablePath().find(path => path.direction === event.code)) {
            switch (event.code) {
                case "ArrowRight":
                    this.x = this.x + 1;
                    return "R";
                case "ArrowLeft":
                    this.x = this.x - 1;
                    return "L";
                case "ArrowUp":
                    this.y = this.y - 1;
                    return "U";
                case "ArrowDown":
                    this.y = this.y + 1;
                    return "D";
            }
        }
    };

    pickGhostPath() {
        const playerCurrentPosition = {
            x: game.player.x,
            y: game.player.y
        };
        const viablePaths = this.pickViablePath();

    };

    eatDot() {
        if (this.id === pacman) {
            game.dots.forEach((dot, index) => {
                let dotElement;
                if (this.x === dot.x && this.y === dot.y) {
                    dotElement = document.getElementById(`dot${dot.x}:${dot.y}`);
                    game.dots.splice(index, 1);
                    dotElement.parentNode.removeChild(dotElement);
                    game.score += 100;
                    scoreBoard.innerText = game.score;
                }
            });
        }
    };

}

class PacmanGame {
    boardWidth = 28;
    boardMap = [
        "############################",
        "#............##............#",
        "#.####.#####.##.#####.####.#",
        "#.####.#####.##.#####.####.#",
        "#.####.#####.##.#####.####.#",
        "#..........................#",
        "#.####.##.########.##.####.#",
        "#.####.##.########.##.####.#",
        "#......##....##............#",
        "######.#####.##.#####.######",
        "    ##.#####.##.#####.##    ",
        "    ##.##..........##.##    ",
        "    ##.##.########.##.##    ",
        "######.##.########.##.######",
        "..........########..........",
        "######.##.########.##.######",
        "    ##.##.########.##.##    ",
        "    ##.##.        .##.##    ",
        "    ##.##.########.##.##    ",
        "######.##.########.##.######",
        "#............##............#",
        "#.####.#####.##.#####.####.#",
        "#.####.#####.##.#####.####.#",
        "#...##................##...#",
        "###.##.##.########.##.##.###",
        "###.##.##.########.##.##.###",
        "#......##....##....##......#",
        "#.##########.##.##########.#",
        "#.##########.##.##########.#",
        "#..........................#",
        "############################"
    ];
    score = 0;
    allPositions = this.boardMap.flatMap((row, y) => row.split("").map((char, x) => ({x, y, char})));
    walls = this.allPositions.filter(item => item.char === "#");
    dots = this.allPositions.filter(item => item.char === ".");
    player = new PacmanElement(pacman, 13, 17);
    ghostPink = new PacmanElement(pink, 1, 1);
    ghosts = [this.ghostPink];

    pacmanInit() {
        const drawWalls = (x, y) => {
            const wall = document.createElement("div");
            wall.classList.add("wall");
            wall.style.gridArea = `${y + 1}/${x + 1}/${y + 2}/${x + 2}`;
            board.appendChild(wall);
        };

        const drawDots = (x, y) => {
            const dot = document.createElement("div");
            dot.classList.add("dot");
            dot.id = `dot${x}:${y}`;
            dot.style.gridArea = `${y + 1}/${x + 1}/${y + 2}/${x + 2}`;
            board.appendChild(dot);
        };
        this.walls.forEach(wall => drawWalls(wall.x, wall.y));
        this.dots.forEach(dot => drawDots(dot.x, dot.y));
        this.player.updateElem();
        this.ghosts.forEach(ghost => ghost.updateElem());
    };

}

const game = new PacmanGame();
game.pacmanInit();


/*const ghostBlue = {
    id: blue,
    x: 2,
    y: 1
};
const ghostRed = {
    id: red,
    x: 3,
    y: 1
};
const ghostGreen = {
    id: green,
    x: 4,
    y: 1
};*/


window.addEventListener("keydown", event => {
    if (game.player.moveAvailable) {
        game.player.updateElem(game.player.pickPlayerDirection(event));
    }
});

