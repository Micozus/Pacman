// sprite tile 24x24
let sprites = new Image();
sprites.src = "spritemap.png";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreBoard = document.getElementById("score");

class PacmanElement {
    moveAvailable = false;
    phase = "chase";
    direction;

    constructor(x, y, spritex, spritey) {
        this.x = x;
        this.y = y;
        this.spritex = spritex;
        this.spritey = spritey;
        // chase, scatter, frightened
    }

}

class PacmanGame {
    map = {
        tile: 20,
        width: 28,
        height: 31,
        board: [
            "############################",
            "#X....X.....X##X.....X....X#",
            "#.####.#####.##.#####.####.#",
            "#.####.#####.##.#####.####.#",
            "#.####.#####.##.#####.####.#",
            "#X....X..X..X..X.....X....X#",
            "#.####.##.########.##.####.#",
            "#.####.##.########.##.####.#",
            "#X....X##X..X##X.....X....X#",
            "######.#####.##.#####.######",
            "    ##.#####.##.#####.##    ",
            "    ##.##X..X..X..X##.##    ",
            "    ##.##.########.##.##    ",
            "######.##.########.##.######",
            "X.....X..X########X..X.....X",
            "######.##.########.##.######",
            "    ##.##.########.##.##    ",
            "    ##.##.        .##.##    ",
            "    ##.##.########.##.##    ",
            "######.##.########.##.######",
            "#X....X..X..X##X..X..X....X#",
            "#.####.#####.##.#####.####.#",
            "#.####.#####.##.#####.####.#",
            "#X.X##X..X..X..X..X..X##X.X#",
            "###.##.##.########.##.##.###",
            "###.##.##.########.##.##.###",
            "#X.X..X##X..X##X..X##X..X.X#",
            "#.##########.##.##########.#",
            "#.##########.##.##########.#",
            "#X..........X..X..........X#",
            "############################"
        ]
    };
    score = 0;
    elements = {
        player: new PacmanElement(13, 17, 48, 72),
        ghostPink: new PacmanElement(1, 1, 0, 192),
        ghostRed: new PacmanElement(2, 1, 0, 144),
        ghostOrange: new PacmanElement(3, 1, 0, 216),
        ghostBlue: new PacmanElement(4, 1, 192, 192)
    };
    ghosts = Object.values(this.elements).slice(1);
    allPositions = this.map.board.flatMap((row, y) => row.split("").map((char, x) => ({x, y, char})));
    walls = this.allPositions.filter(item => item.char === "#");
    dots = this.allPositions.filter(item => item.char === "." || item.char === "X");
    crossroads = this.allPositions.filter(item => item.char === "X");

    eatDot() {
        this.dots.forEach((dot, index) => {
            if (this.elements.player.x === dot.x && this.elements.player.y === dot.y) {
                this.dots.splice(index, 1);
                this.score += 100;
                scoreBoard.innerText = this.score;
            }
        });
    }

    playerMovement() {
        switch (this.elements.player.direction) {
            case "ArrowRight":
                this.moving(this.elements.player, "ArrowRight");
                this.elements.player.spritex = 145;
                break;
            case "ArrowLeft":
                this.moving(this.elements.player, "ArrowLeft");
                this.elements.player.spritex = 49;
                break;
            case "ArrowUp":
                this.moving(this.elements.player, "ArrowUp");
                this.elements.player.spritex = 73;
                break;
            case "ArrowDown":
                this.moving(this.elements.player, "ArrowDown");
                this.elements.player.spritex = 169;
                break;
        }


        if (this.elements.player.x < 0 && this.elements.player.y === 14) {
            this.elements.player.x = this.map.width - 1;
        }
        if (this.elements.player.x > this.map.width - 1 && this.elements.player.y === 14) {
            this.elements.player.x = 0;
        }
        this.eatDot();
    }

    randomiseFromGivenDirections(directions) {
        return directions[Math.floor(Math.random() * directions.length)];
    }

    ghostDirectionPick(player, ghost) {
        this.crossroads.forEach(crossroad => {
            if (ghost.x === crossroad.x && ghost.y === crossroad.y) {
                if (player.x > ghost.x && player.y > ghost.y) {
                    ghost.direction = this.randomiseFromGivenDirections(["ArrowRight", "ArrowDown"]);
                } else if(player.x > ghost.x && player.y === ghost.y) {
                    ghost.direction = this.randomiseFromGivenDirections(["ArrowRight"]);
                } else if(player.x > ghost.x && player.y < ghost.y) {

                }
            }
        });

        if (!ghost.moveAvailable) {
            switch (Math.floor(Math.random() * 4)) {
                case 0:
                    ghost.direction = "ArrowLeft";
                    break;
                case 1:
                    ghost.direction = "ArrowRight";
                    break;
                case 2:
                    ghost.direction = "ArrowUp";
                    break;
                case 3:
                    ghost.direction = "ArrowDown";
                    break;
            }
        }
    }

    ghostMovement() {
        this.ghosts.forEach(ghost => {
this.ghostDirectionPick(this.elements.player, ghost);
            this.moving(ghost, ghost.direction);
            this.playerReset(ghost);
        });
    }

    playerReset(ghost) {
        if (this.elements.player.x === ghost.x && this.elements.player.y === ghost.y) {
            this.elements.player.x = 13;
            this.elements.player.y = 17;
            this.elements.player.direction = null;
        }
    }

    gameReset() {

    }

    moving(elem, direction) {
        const currentPosition = {
            x: elem.x,
            y: elem.y
        };
        if (direction === "ArrowUp") elem.y--;
        if (direction === "ArrowDown") elem.y++;
        if (direction === "ArrowLeft") elem.x--;
        if (direction === "ArrowRight") elem.x++;
        this.walls.forEach(wall => {
            if (elem.x === wall.x && elem.y === wall.y) {
                elem.x = currentPosition.x;
                elem.y = currentPosition.y;
            }
        });
        if (elem.x !== currentPosition.x || elem.y !== currentPosition.y) {
            elem.moveAvailable = true;
            elem.lastGoodPath = elem.direction;
        } else {
            elem.moveAvailable = false;
            elem.direction = elem.lastGoodPath;
        }
    };

    pacmanInit() {
        setInterval(() => {
            this.playerMovement();
            this.ghostMovement();
        }, 100);
    }
}

const game = new PacmanGame();

class Canvas {
    canvasInit() {
        const step = () => {
            const toDraw = Object.values(game.elements);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            toDraw.forEach(draw =>
                ctx.drawImage(
                    sprites,
                    draw.spritex,
                    draw.spritey,
                    24,
                    24,
                    draw.x * game.map.tile,
                    draw.y * game.map.tile,
                    game.map.tile,
                    game.map.tile
                )
            );
            game.dots.forEach(dot => {
                ctx.strokeStyle = "yellow";
                ctx.fillStyle = "yellow";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(
                    dot.x * game.map.tile + game.map.tile / 2,
                    dot.y * game.map.tile + game.map.tile / 2,
                    game.map.tile / 5,
                    0,
                    2 * Math.PI
                );
                ctx.stroke();
            });
            game.walls.forEach(wall => {
                ctx.fillStyle = "darkblue";
                ctx.fillRect(wall.x * game.map.tile, wall.y * game.map.tile, game.map.tile, game.map.tile);
            });

            // // Do usunięcia - służy zaznaczeniu skrzyżowań
            //
            // game.crossroads.forEach(crossroad => {
            //     ctx.fillStyle = "red";
            //     ctx.fillRect(crossroad.x * game.map.tile, crossroad.y * game.map.tile, game.map.tile, game.map.tile);
            // });
            //
            // // Koniec zaznaczania skrzyżowań

            window.requestAnimationFrame(step);

        };
        canvas.width = game.map.width * game.map.tile;
        canvas.height = game.map.height * game.map.tile;
        sprites.onload = () => {
            window.requestAnimationFrame(step);
        };
    }
}

const gameCanvas = new Canvas();

game.pacmanInit();

gameCanvas.canvasInit();

window.addEventListener("keyup", event => {
    if (
        event.code === "ArrowRight" ||
        event.code === "ArrowLeft" ||
        event.code === "ArrowUp" ||
        event.code === "ArrowDown"
    ) {
        game.elements.player.direction = event.code;
    }
});
