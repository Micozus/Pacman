// sprite tile 24x24
let sprites = new Image();
sprites.src = "spritemap.png";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreBoard = document.getElementById("score");

class PacmanElement {
    moveAvailable = false;
    movementType = "chase";
    outside;
    direction;

    constructor(x, y, spritex, spritey, outside) {
        this.x = x;
        this.y = y;
        this.spriteX = spritex;
        this.startSpriteX = this.spriteX;
        this.spriteY = spritey;
        this.startSpriteY = this.spriteY;
        this.outside = outside;
    }

}

class PacmanGame {
    level = 1;
    spriteTile = 24;
    map = {
        tile: 20,
        width: 28,
        height: 31,
        board: [
            "############################",
            "#X....X.....X##X.....X....X#",
            "#.####.#####.##.#####.####.#",
            "#P####.#####.##.#####.####P#",
            "#.####.#####.##.#####.####.#",
            "#X....X..X..X..X.....X....X#",
            "#.####.##.########.##.####.#",
            "#.####.##.########.##.####.#",
            "#X....X##X..X##X.....X....X#",
            "######.#####.##.#####.######",
            "    ##.#####.##.#####.##    ",
            "    ##.##X..X..X..X##.##    ",
            "    ##.##.###DD###.##.##    ",
            "######.##.##    ##.##.######",
            "X.....X..X########X..X.....X",
            "######.##.########.##.######",
            "    ##.##.########.##.##    ",
            "    ##.##.        .##.##    ",
            "    ##.##.########.##.##    ",
            "######.##.########.##.######",
            "#X....X..X..X##X..X..X....X#",
            "#.####.#####.##.#####.####.#",
            "#.####.#####.##.#####.####.#",
            "#K.X##X..X..X..X..X..X##X.K#",
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
        player: new PacmanElement(13, 17, 48, 72, true),
        ghostPink: new PacmanElement(12, 13, 0, 192, false),
        ghostRed: new PacmanElement(13, 11, 0, 144, true),
        ghostOrange: new PacmanElement(13, 13, 0, 216, false),
        ghostBlue: new PacmanElement(14, 13, 192, 192, false)
    };
    ghosts = Object.values(this.elements).slice(1);
    allPositions = this.map.board.flatMap((row, y) => row.split("").map((char, x) => ({x, y, char})));
    walls = this.allPositions.filter(item => item.char === "#");
    dots = this.allPositions.filter(item => item.char === "." || item.char === "X");
    crossroads = this.allPositions.filter(item => item.char === "X" || item.char === "K");
    doors = this.allPositions.filter(item => item.char === "D");
    powerups = this.allPositions.filter(item => item.char === "P" || item.char === "K");

    eatDot() {
        this.dots.forEach((dot, index) => {
            if (this.elements.player.x === dot.x && this.elements.player.y === dot.y) {
                this.dots.splice(index, 1);
                this.score += 100;
                scoreBoard.innerText = this.score;
            }
        });
    }

    eatPowerup() {
        this.powerups.forEach((powerup, index) => {
            if (this.elements.player.x === powerup.x && this.elements.player.y === powerup.y) {
                this.powerups.splice(index, 1);
                this.ghosts
                    .filter(ghost => ghost.outside)
                    .forEach(ghost => this.ghostScaredState(ghost, 10000 - (this.level * 500)));
            }
        });
    }

    playerMovement() {
        switch (this.elements.player.direction) {
            case "ArrowRight":
                this.moving(this.elements.player, "ArrowRight");
                this.elements.player.spriteX = 145;
                break;
            case "ArrowLeft":
                this.moving(this.elements.player, "ArrowLeft");
                this.elements.player.spriteX = 49;
                break;
            case "ArrowUp":
                this.moving(this.elements.player, "ArrowUp");
                this.elements.player.spriteX = 73;
                break;
            case "ArrowDown":
                this.moving(this.elements.player, "ArrowDown");
                this.elements.player.spriteX = 169;
                break;
        }


        if (this.elements.player.x < 0 && this.elements.player.y === 14) {
            this.elements.player.x = this.map.width - 1;
        }
        if (this.elements.player.x > this.map.width - 1 && this.elements.player.y === 14) {
            this.elements.player.x = 0;
        }
        this.eatDot();
        this.eatPowerup();
    }

    // Wybór kierunku na zasadzie pseudolosowości wyboru, aby duszki nie były bezlitosnymi mordercami i czasami mogły się mylić :)
    randomiseFromGivenDirections(directions) {
        return directions[Math.floor(Math.random() * directions.length)];
    }

    changeGhostSpriteBasedOnDirection(ghost) {

        // Normalny wygląd duszków
        if (ghost.movementType === "chase" || ghost.movementType === "scatter") {
            switch (ghost.direction) {
                case "ArrowLeft":
                    ghost.spriteX = ghost.startSpriteX + 4 * this.spriteTile;
                    break;
                case "ArrowUp":
                    ghost.spriteX = ghost.startSpriteX + 6 * this.spriteTile;
                    break;
                case "ArrowDown":
                    ghost.spriteX = ghost.startSpriteX + 2 * this.spriteTile;
                    break;
                case "ArrowRight":
                    ghost.spriteX = ghost.startSpriteX;
                    break;

            }
        }
    }

    ghostDirectionPick(player, ghost) {
        this.crossroads.forEach(crossroad => {
            // Komentarze określają lokalizację Pacmana w stosunku do ducha
            if (ghost.x === crossroad.x && ghost.y === crossroad.y) {
                // Prawo Dół
                if (player.x > ghost.x && player.y > ghost.y) {
                    ghost.direction = this.randomiseFromGivenDirections(["ArrowRight", "ArrowDown"]);
                    // Prawo
                } else if (player.x > ghost.x && player.y === ghost.y) {
                    ghost.direction = this.randomiseFromGivenDirections(["ArrowRight"]);
                    // Prawo Góra
                } else if (player.x > ghost.x && player.y < ghost.y) {
                    ghost.direction = this.randomiseFromGivenDirections(["ArrowRight", "ArrowUp"]);
                    // Lewo Dół
                } else if (player.x < ghost.x && player.y > ghost.y) {
                    ghost.direction = this.randomiseFromGivenDirections(["ArrowLeft", "ArrowDown"]);
                    // Lewo
                } else if (player.x < ghost.x && player.y === ghost.y) {
                    ghost.direction = this.randomiseFromGivenDirections(["ArrowLeft"]);
                    // Lewo Góra
                } else if (player.x < ghost.x && player.y < ghost.y) {
                    ghost.direction = this.randomiseFromGivenDirections(["ArrowLeft", "ArrowUp"]);
                }
            } else if (!ghost.moveAvailable) {
                ghost.direction = this.randomiseFromGivenDirections(["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"]);
            }
            this.changeGhostSpriteBasedOnDirection(ghost);
        });
    }

    ghostMovement() {
        this.ghosts.forEach(ghost => {
            if (ghost.outside) {
                this.ghostDirectionPick(this.elements.player, ghost);
                this.moving(ghost, ghost.direction);
                this.playerReset(ghost);
            }
        });
    }

    playerReset(ghost) {
        if (this.elements.player.x === ghost.x && this.elements.player.y === ghost.y) {
            this.elements.player.x = 13;
            this.elements.player.y = 17;
            this.elements.player.direction = null;
        }
    }

    sortGhostsInHouse() {
        let ghostsInHouse = Object.values(game.elements).filter(ghost => !ghost.outside);
        for (let i = 0; i < ghostsInHouse.length; i++) {
            ghostsInHouse[i].x = 12 + i;
        }
    }

    activateGhost(ghost) {
        ghost.x = 13;
        ghost.y = 11;
        ghost.outside = true;
        this.sortGhostsInHouse();
    }

    resetGhostSprite(ghost) {
        ghost.spriteX = ghost.startSpriteX;
        ghost.spriteY = ghost.startSpriteY;
    }

    setScaredGhostSprite(ghost) {
        ghost.spriteX = this.spriteTile * 9;
        ghost.spriteY = this.spriteTile * 4;
    }

    setScaredFlashingGhostSprite(ghost) {
        ghost.spriteX = this.spriteTile * 7;
        ghost.spriteY = this.spriteTile * 4;
    }

    ghostScaredState(ghost, time) {
        ghost.movementType = "frightened";
        this.setScaredGhostSprite(ghost);
        setTimeout(() => this.ghostFlashingSprite(ghost), time);
    }


    ghostFlashingSprite(ghost) {
        const interval = setInterval(() => {
            this.setScaredGhostSprite(ghost);
            setTimeout(() => this.setScaredFlashingGhostSprite(ghost), 300);
        }, 500);
        setTimeout(() => {
            this.resetGhostSprite(ghost);
            ghost.movementType = "chase";
            clearInterval(interval)
        }, 4000);
    }

    deactivateGhost(ghost) {
        if (ghost.outside) {
            this.sortGhostsInHouse();
            let ghostsInHouse = Object.values(game.elements).filter(ghost => !ghost.outside).length;
            switch (ghostsInHouse) {
                case 0:
                    ghost.x = 12;
                    break;
                case 1:
                    ghost.x = 13;
                    break;
                case 2:
                    ghost.x = 14;
                    break;
                case 3:
                    ghost.x = 15;
                    break;
            }
            ghost.y = 13;
            this.resetGhostSprite(ghost);
            ghost.outside = false;
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
        this.doors.forEach(door => {
            if (elem.x === door.x && elem.y === door.y) {
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
                    draw.spriteX,
                    draw.spriteY,
                    24,
                    24,
                    draw.x * game.map.tile,
                    draw.y * game.map.tile,
                    game.map.tile,
                    game.map.tile
                )
            );

            // Rysowanie kulek

            game.dots.forEach(dot => {
                ctx.strokeStyle = "#ffb8ae";
                ctx.fillStyle = "#ffb8ae";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(
                    dot.x * game.map.tile + game.map.tile / 2,
                    dot.y * game.map.tile + game.map.tile / 2,
                    game.map.tile / 7,
                    0,
                    2 * Math.PI
                );
                ctx.stroke();
            });

            // Rysowanie powerupów

            game.powerups.forEach(powerup => {
                ctx.strokeStyle = "#ffb8ae";
                ctx.fillStyle = "#ffb8ae";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(
                    powerup.x * game.map.tile + game.map.tile / 2,
                    powerup.y * game.map.tile + game.map.tile / 2,
                    game.map.tile / 3,
                    0,
                    2 * Math.PI
                );
                ctx.stroke();
            });

            // Rysowanie ścian

            game.walls.forEach(wall => {
                ctx.fillStyle = "darkblue";
                ctx.fillRect(wall.x * game.map.tile, wall.y * game.map.tile, game.map.tile, game.map.tile);
            });

            // Rysowanie drzwi

            game.doors.forEach(door => {
                ctx.fillStyle = "brown";
                ctx.fillRect(door.x * game.map.tile, door.y * game.map.tile, game.map.tile, game.map.tile);
            });

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
