// sprite tile 24x24
let sprites = new Image();
sprites.src = "spritemap.png";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreBoard = document.getElementById("score");

class PacmanElement {
    id;
    moveAvailable = false;
    movementType = "chase";
    outside;
    direction;
    alive = true;
    scared = null;
    movementInterval;
    activated;

    constructor(id, x, y, spritex, spritey, outside, activated) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.spriteX = spritex;
        this.startSpriteX = this.spriteX;
        this.spriteY = spritey;
        this.startSpriteY = this.spriteY;
        this.outside = outside;
        this.activated = activated;
    }

}

class PacmanGame {
    level = 1;
    life = 2;
    movementSpeed = 10;
    spriteTile = 24;
    ghostResetTile = {x: 13, y: 11};
    map = {
        tile: 20,
        width: 28,
        height: 31,
        board: [
            "┏============┓┏============┓",
            "|X....X.....X||X.....X....X|",
            "|.┏==┓.┏===┓.||.┏===┓.┏==┓.|",
            "|P|  |.|   |.||.|   |.|  |P|",
            "|.┗==┛.┗===┛.┗┛.┗===┛.┗==┛.|",
            "|X....X..X..X..X.....X....X|",
            "|.┏==┓.┏┓.┏======┓.┏┓.┏==┓.|",
            "|.┗==┛.||.┗==┓┏==┛.||.┗==┛.|",
            "|X....X||X..X||X...||X....X|",
            "┗====┓.|┗==┓.||.┏==┛|.┏====┛",
            "     |.|┏==┛.┗┛.┗==┓|.|     ",
            "     |.||X..X..X..X||.|     ",
            "     |.||.┏======┓.||.|     ",
            "=====┛.┗┛.|######|.┗┛.┗=====",
            "......X..X|######|X..X......",
            "=====┓.┏┓.|######|.┏┓.┏=====",
            "     |.||.┗======┛.||.|     ",
            "     |.||.########.||.|     ",
            "     |.||.┏======┓.||.|     ",
            "┏====┛.┗┛.┗==┓┏==┛.┗┛.┗====┓",
            "|X....X..X..X||X..X..X....X|",
            "|.┏==┓.┏===┓.||.┏===┓.┏==┓.|",
            "|.┗=┓|.┗===┛.┗┛.┗===┛.|┏=┛.|",
            "|K.X||X..X..X..X..X..X||X.K|",
            "┗=┓.||.┏┓.┏======┓.┏┓.||.┏=┛",
            "┏=┛.┗┛.||.┗==┓┏==┛.||.┗┛.┗=┓",
            "|X.X..X||X..X||X..X||X..X.X|",
            "|.┏====┛┗==┓.||.┏==┛┗====┓.|",
            "|.┗========┛.┗┛.┗========┛.|",
            "|X..........X..X..........X|",
            "┗==========================┛"
        ]
    };
    score = 0;
    gameIntervals = {};
    elements = {
        player: new PacmanElement("player", 13, 17, 48, 72, true, true),
        ghostPink: new PacmanElement("ghostPink", 12, 13, 0, 192, false, false),
        ghostRed: new PacmanElement("ghostRed", 13, 11, 0, 144, true, true),
        ghostOrange: new PacmanElement("ghostOrange", 13, 13, 0, 216, false, false),
        ghostBlue: new PacmanElement("ghostBlue", 14, 13, 192, 192, false, false)
    };
    ghostMovementModifier = {
        chase: 1.5,
        frightened: 2,
        backToHouse: 0.5
    };
    ghosts = Object.values(this.elements).slice(1);
    player = this.elements.player;
    allPositions = this.map.board.flatMap((row, y) =>
        row.split("").map((char, x) => ({x, y, char}))
    );
    walls = this.allPositions.filter(
        item =>
            item.char !== "X" &&
            item.char !== "P" &&
            item.char !== "." &&
            item.char !== "#" &&
            item.char !== "K"
    );
    dots = this.allPositions.filter(
        item => item.char === "." || item.char === "X"
    );
    dotsBlueActivationNumber = this.dots.length - 30;
    dotsOrangeActivationNumber = this.dots.length * 0.3;
    crossroads = this.allPositions.filter(
        item => item.char === "X" || item.char === "K"
    );
    doors = this.allPositions.filter(item => item.char === "D");
    powerups = this.allPositions.filter(
        item => item.char === "P" || item.char === "K"
    );

    modifyMovementSpeed(ghost, modifier) {
        let ghostIntervalToChange = this.gameIntervals.ghostMovement.find(interval => interval.ghost.id === ghost.id);
        clearInterval(ghostIntervalToChange.interval);
        const intervalToSet = setInterval(() => this.ghostMovement(ghost), this.movementSpeed * modifier);
        ghostIntervalToChange.interval = intervalToSet;
        ghost.movementInterval = intervalToSet;
    }

    eatDot() {
        this.dots.forEach((dot, index) => {
            if (
                this.player.x === dot.x &&
                this.player.y === dot.y
            ) {
                this.dots.splice(index, 1);
                this.score += 100;
                scoreBoard.innerText = this.score;
            }
        });
    }

    eatPowerup() {
        this.powerups.forEach((powerup, index) => {
            if (
                this.player.x === powerup.x &&
                this.player.y === powerup.y
            ) {
                this.powerups.splice(index, 1);
                this.ghosts
                    .filter(ghost => ghost.outside)
                    .forEach(ghost => {
                        clearTimeout(ghost.scared);
                        ghost.scared = null;
                        this.ghostScaredState(ghost, 6000 - this.level * 500);
                    });
            }
        });
    }

    playerMovement() {
        if (this.player.direction) {
            this.player.spriteY = 3 * this.spriteTile;
            switch (this.player.direction) {
                case "ArrowRight":
                    this.moving(this.player, "ArrowRight");
                    this.player.spriteX = 6 * this.spriteTile;
                    break;
                case "ArrowLeft":
                    this.moving(this.player, "ArrowLeft");
                    this.player.spriteX = 2 * this.spriteTile;
                    break;
                case "ArrowUp":
                    this.moving(this.player, "ArrowUp");
                    this.player.spriteX = 3 * this.spriteTile;
                    break;
                case "ArrowDown":
                    this.moving(this.player, "ArrowDown");
                    this.player.spriteX = 7 * this.spriteTile;
                    break;
            }
        } else {
            this.setPlayerStartingSprite();
        }

        this.elemToCrossMapBridge(this.player);
        this.eatDot();
        this.eatPowerup();
    }

    setPlayerStartingSprite() {
        this.player.spriteX = 0;
        this.player.spriteY = this.spriteTile * 7;
    }

    // Wybór kierunku na zasadzie pseudolosowości wyboru, aby duszki nie były bezlitosnymi mordercami i czasami mogły się mylić :)
    randomiseFromGivenDirections(directions) {
        return directions[Math.floor(Math.random() * directions.length)];
    }

    elemToCrossMapBridge(elem) {
        if (elem.x < 0 && elem.y === 14) {
            elem.x = this.map.width - 1;
        }
        if (elem.x > this.map.width - 1 && elem.y === 14) {
            elem.x = 0;
        }
    }

    changeGhostSpriteBasedOnDirection(ghost) {
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

    // Algorytm poruszania ducha
    ghostDirectionAlgorithm(elementToChase, ghost) {
        this.crossroads.forEach(crossroad => {
            // Komentarze określają lokalizację Pacmana w stosunku do ducha
            if (ghost.x === crossroad.x && ghost.y === crossroad.y) {
                console.log("skrzyzowanie");
                console.log("cr. x " + crossroad.x);
                console.log("cr. y " + crossroad.y);
                // Sprawdzenie czy duch nie zostal zlapany przez Pacmana
                if (ghost.alive) {
                    // Prawo Dół

                    if (elementToChase.x > ghost.x && elementToChase.y > ghost.y) {
                        // Ruch warunkowany typem poruszania ducha, drugi state to frightened,
                        // TODO: ew. scatter type
                        ghost.direction =
                            ghost.movementType === "chase"
                                ? this.randomiseFromGivenDirections(["ArrowRight", "ArrowDown"])
                                : this.randomiseFromGivenDirections(["ArrowLeft", "ArrowUp"]);

                        // Prawo

                    } else if (
                        elementToChase.x > ghost.x &&
                        elementToChase.y === ghost.y
                    ) {
                        ghost.direction =
                            ghost.movementType === "chase"
                                ? this.randomiseFromGivenDirections(["ArrowRight"])
                                : this.randomiseFromGivenDirections(["ArrowLeft", "ArrowDown", "ArrowUp"]);

                        // Prawo Góra

                    } else if (elementToChase.x > ghost.x && elementToChase.y < ghost.y) {
                        ghost.direction =
                            ghost.movementType === "chase"
                                ? this.randomiseFromGivenDirections(["ArrowRight", "ArrowUp"])
                                : this.randomiseFromGivenDirections(["ArrowLeft", "ArrowDown"]);

                        // Lewo Dół

                    } else if (elementToChase.x < ghost.x && elementToChase.y > ghost.y) {
                        ghost.direction =
                            ghost.movementType === "chase"
                                ? this.randomiseFromGivenDirections(["ArrowLeft", "ArrowDown"])
                                : this.randomiseFromGivenDirections(["ArrowRight", "ArrowUp"]);

                        // Lewo

                    } else if (
                        elementToChase.x < ghost.x &&
                        elementToChase.y === ghost.y
                    ) {
                        ghost.direction =
                            ghost.movementType === "chase"
                                ? this.randomiseFromGivenDirections(["ArrowLeft"])
                                : this.randomiseFromGivenDirections(["ArrowRight", "ArrowDown", "ArrowUp"]);

                        // Lewo Góra

                    } else if (elementToChase.x < ghost.x && elementToChase.y < ghost.y) {
                        ghost.direction =
                            ghost.movementType === "chase"
                                ? this.randomiseFromGivenDirections(["ArrowLeft", "ArrowUp"])
                                : this.randomiseFromGivenDirections(["ArrowRight", "ArrowDown"]);
                    }

                    // Jezeli zostal zlapany przez Pacmana kieruje sie do bramy jako duch

                } else {

                    // Prawo Dół

                    if (elementToChase.x > ghost.x && elementToChase.y > ghost.y) {
                        ghost.direction = this.randomiseFromGivenDirections(["ArrowRight", "ArrowDown"]);

                        // Prawo

                    } else if (
                        elementToChase.x > ghost.x &&
                        elementToChase.y === ghost.y
                    ) {
                        ghost.direction = this.randomiseFromGivenDirections(["ArrowRight"]);

                        // Prawo Góra

                    } else if (elementToChase.x > ghost.x && elementToChase.y < ghost.y) {
                        ghost.direction = this.randomiseFromGivenDirections(["ArrowRight", "ArrowUp"]);

                        // Lewo Dół

                    } else if (elementToChase.x < ghost.x && elementToChase.y > ghost.y) {
                        ghost.direction = this.randomiseFromGivenDirections(["ArrowLeft", "ArrowDown"]);

                        // Lewo

                    } else if (
                        elementToChase.x < ghost.x &&
                        elementToChase.y === ghost.y
                    ) {
                        ghost.direction = this.randomiseFromGivenDirections(["ArrowLeft"]);

                        // Lewo Góra

                    } else if (elementToChase.x < ghost.x && elementToChase.y < ghost.y) {
                        ghost.direction = this.randomiseFromGivenDirections(["ArrowLeft", "ArrowUp"]);
                    }
                }
            } else if (!ghost.moveAvailable) {
                ghost.direction = this.randomiseFromGivenDirections(["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"]);
            }

            this.changeGhostSpriteBasedOnDirection(ghost);
        });
    }

    ghostMovementTypesPick(ghost) {
        !ghost.alive
            ? this.ghostDirectionAlgorithm(this.ghostResetTile, ghost)
            : this.ghostDirectionAlgorithm(this.player, ghost);
    }

    ghostCollisionCheck(ghost) {
        if (ghost.outside && ghost.alive) {
            ghost.movementType === "frightened"
                ? this.ghostReset(ghost)
                : this.playerReset(ghost);
        }
    }

    ghostMovement(ghost) {
        if (ghost.outside) {
            this.elemToCrossMapBridge(ghost);
            this.ghostMovementTypesPick(ghost);
            if (
                !ghost.alive &&
                ghost.x === this.ghostResetTile.x &&
                ghost.y === this.ghostResetTile.y
            ) {
                this.deactivateGhost(ghost);
                setTimeout(() => this.activateGhost(ghost), 1000);
            }
            this.moving(ghost, ghost.direction);
        }
    }

    playerPositionReset() {
        this.player.x = 13;
        this.player.y = 17;
        this.player.direction = null;
    }

    playerReset(ghost) {
        if (
            this.player.x === ghost.x &&
            this.player.y === ghost.y
        ) {
            this.player.direction = null;
            this.ghosts.forEach(ghost => this.deactivateGhost(ghost));
            this.pacmanDestroyAnimation();
            this.player.alive = false;
            setTimeout(() => this.gameReset(), 2600);
        }
    }

    ghostReset(ghost) {
        if (
            this.player.x === ghost.x &&
            this.player.y === ghost.y
        ) {
            clearTimeout(ghost.scared);
            clearTimeout(ghost.interval);
            this.setCaughtByPacmanGhostSprite(ghost);
            this.modifyMovementSpeed(ghost, this.ghostMovementModifier.backToHouse);
            ghost.scared = null;
            ghost.interval = null;
            ghost.alive = false;
        }
    }

    ghostActivationRoutine(clear) {
        // The pink ghost starts inside the ghost house, but always exits immediately, even in the first level.

        let pinkActivationTimeout = setTimeout(() => {
            if (!this.elements.ghostPink.activated) this.activateGhost(this.elements.ghostPink)
        }, 1000);
        if (clear !== undefined) {
            clearTimeout(pinkActivationTimeout);
        }
        // The blue ghost is nicknamed Inky, and remains inside the ghost house for a short time on the first level,
        // not joining the chase until Pac-Man has managed to consume at least 30 of the dots.
        if (this.dots.length <= this.dotsBlueActivationNumber && !this.elements.ghostBlue.activated) this.activateGhost(this.elements.ghostBlue);
        //The orange ghost, "Clyde", is the last to leave the ghost house,
        // and does not exit at all in the first level until over a third of the dots have been eaten.
        if (this.dots.length <= this.dotsOrangeActivationNumber && !this.elements.ghostOrange.activated) this.activateGhost(this.elements.ghostOrange);
    }

    sortGhostsInHouse() {
        let ghostsInHouse = Object.values(game.elements).filter(
            ghost => !ghost.outside
        );
        for (let i = 0; i < ghostsInHouse.length; i++) {
            ghostsInHouse[i].x = 12 + i;
        }
    }

    activateGhost(ghost) {
        ghost.x = 13;
        ghost.y = 11;
        ghost.outside = true;
        ghost.alive = true;
        ghost.movementType = "chase";
        ghost.scared = null;
        ghost.activated = true;
        clearTimeout(ghost.scared);
        this.sortGhostsInHouse();
    }

    preciseRound(num, dec) {
        return +num.toFixed(dec);
    }

    // Powrót ducha do bazowych sprite'ów
    resetGhostSprite(ghost) {
        ghost.spriteX = ghost.startSpriteX;
        ghost.spriteY = ghost.startSpriteY;
    }

    // Ustawianie spritu ducha wskazujac, że jego movement type jest frightened
    setScaredGhostSprite(ghost) {
        ghost.spriteX = this.spriteTile * 9;
        ghost.spriteY = this.spriteTile * 4;
    }

    // Ustawianie spritu ducha na jasny, wskazówka dla gracza, że zaraz zmieni typ movementu
    setScaredFlashingGhostSprite(ghost) {
        ghost.spriteX = this.spriteTile * 7;
        ghost.spriteY = this.spriteTile * 4;
    }

    setCaughtByPacmanGhostSprite(ghost) {
        ghost.spriteX = this.spriteTile * 9;
        ghost.spriteY = this.spriteTile * 9;
    }

    // Logika zmiany typu movementu po powerupie
    ghostScaredState(ghost, time) {
        clearTimeout(ghost.scared);
        ghost.scared = null;
        ghost.movementType = "frightened";
        this.modifyMovementSpeed(ghost, this.ghostMovementModifier.frightened);
        this.setScaredGhostSprite(ghost);
        ghost.scared = setTimeout(() => {
            if (ghost.alive) this.ghostFlashingSprite(ghost)
        }, time);
    }

    // Logika flashowania powrotu do poprzedniego movement typu
    ghostFlashingSprite(ghost) {
        let flashingTimeout;
        let interval = setInterval(() => {
            (ghost.alive)
                ? this.setScaredGhostSprite(ghost)
                : this.setCaughtByPacmanGhostSprite(ghost);
            flashingTimeout = setTimeout(() => (ghost.alive)
                ? this.setScaredFlashingGhostSprite(ghost)
                : this.setCaughtByPacmanGhostSprite(ghost), 300);
        }, 500);
        ghost.interval = interval;
        setTimeout(() => {
            clearInterval(interval);
            ghost.interval = null;
            clearTimeout(ghost.scared);
            clearTimeout(flashingTimeout);
            if (ghost.alive) {
                this.modifyMovementSpeed(ghost, this.ghostMovementModifier.chase);
                ghost.scared = null;
                ghost.movementType = "chase";
                this.resetGhostSprite(ghost);
            }
        }, 4000);
    }

    deactivateGhost(ghost) {
        if (ghost.outside) {
            this.sortGhostsInHouse();
            let ghostsInHouse = Object.values(game.elements).filter(
                ghost => !ghost.outside
            ).length;
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
            ghost.outside = false;
            this.resetGhostSprite(ghost);
            this.modifyMovementSpeed(ghost, this.ghostMovementModifier.chase);
        }

    }

    objectCollisionCheck(elem, direction, elemToCollide) {
        switch (direction) {
            case "ArrowUp":
                return elem.x === elemToCollide.x && elem.y - 1 === elemToCollide.y;
            case "ArrowDown":
                return elem.x === elemToCollide.x && elem.y + 1 === elemToCollide.y;
            case "ArrowLeft":
                return elem.x - 1 === elemToCollide.x && elem.y === elemToCollide.y;
            case "ArrowRight":
                return elem.x + 1 === elemToCollide.x && elem.y === elemToCollide.y;
        }


    }

    objectCollisionDecisionMake(elem, currentPosition, direction) {
        this.walls.forEach(wall => {
            if (this.objectCollisionCheck(currentPosition, direction, wall)) {
                elem.moveAvailable = false;
                elem.x = Math.round(currentPosition.x);
                elem.y = Math.round(currentPosition.y);
                if (elem === this.player) {
                    elem.direction = elem.lastGoodPath;
                } else {
                    this.ghostMovementTypesPick(elem)
                }
            } else {
                elem.moveAvailable = true;
                elem.lastGoodPath = elem.direction;
            }
        });

    }

    moving(elem, direction) {
        const currentPosition = {
            x: this.preciseRound(elem.x, 1),
            y: this.preciseRound(elem.y, 1)
        };

        switch (direction) {
            case "ArrowUp":
                if (currentPosition.x % 1 === 0) elem.y = elem.y - 0.1;
                break;
            case "ArrowDown":
                if (currentPosition.x % 1 === 0) elem.y = elem.y + 0.1;
                break;
            case "ArrowLeft":
                if (currentPosition.y % 1 === 0) elem.x = elem.x - 0.1;
                break;
            case "ArrowRight":
                if (currentPosition.y % 1 === 0) elem.x = elem.x + 0.1;
                break;
        }

        const newPosition = {
            x: this.preciseRound(elem.x, 1),
            y: this.preciseRound(elem.y, 1)
        };
        this.objectCollisionDecisionMake(elem, currentPosition, direction);

        // if (this.objectCollisionCheck(elem, direction)) this.ghostMovementTypesPick(elem);

        // this.doors.forEach(door => {
        //     if (this.objectCollisionCheck(newPosition, door, direction)) {
        //         elem.x = Math.round(currentPosition.x);
        //         elem.y = Math.round(currentPosition.y);
        //     }
        // });

    }

    pacmanInit() {
        this.gameIntervals = {};
        const ghostIntervals = [];
        this.ghosts.forEach(ghost => {
            ghost.movementInterval = setInterval(() => this.ghostMovement(ghost), this.movementSpeed * game.ghostMovementModifier.chase);
            ghostIntervals.push({
                ghost: ghost,
                interval: ghost.movementInterval
            });
        });
        this.gameIntervals = {
            ghostActivationRoutine: setInterval(() => this.ghostActivationRoutine(), 1000),
            playerMovement: setInterval(() => this.playerMovement(), this.movementSpeed),
            // Częstsze sprawdzanie kolizji - nie ma mowy, że duchy się miną z pacmanem
            ghostCollision: setInterval(() => this.ghosts.forEach(ghost => this.ghostCollisionCheck(ghost)), this.movementSpeed),
            ghostMovement: [...ghostIntervals]
        };
    }

    pacmanDestroyAnimation() {
        if (this.player.alive) {
            this.setPlayerStartingSprite();
            let playerInterval = this.gameIntervals.playerMovement;
            clearInterval(playerInterval);
            playerInterval = null;
            let destroyStartingTile = this.spriteTile * 5;
            this.player.spriteX = destroyStartingTile;
            let startingPosition = 1;
            let animation = setInterval(() => {
                this.player.spriteX = destroyStartingTile + (startingPosition * this.spriteTile);
                startingPosition++;
                if (startingPosition === 12) clearInterval(animation);
            }, 200);
        }
    }

    gameReset(resetType) {

        this.player.alive = true;
        this.ghosts.forEach(ghost => this.deactivateGhost(ghost));
        Object.values(this.gameIntervals)
            .flatMap(interval => interval)
            .map(el => (typeof el === "object") ? el.interval : el)
            .forEach(interval => {
                clearInterval(interval);
                interval = null;
            });

        // Zakończenie poziomu - level up
        if (resetType !== undefined) {
            this.level++;
            this.dots = this.allPositions.filter(
                item => item.char === "." || item.char === "X"
            );
        }
        this.ghosts.forEach(ghost => ghost.activated = false);
        this.playerPositionReset();
        this.activateGhost(this.elements.ghostRed);
        this.pacmanInit();


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
                switch (wall.char) {
                    case "=":
                        ctx.drawImage(
                            sprites,
                            0,
                            96,
                            24,
                            24,
                            wall.x * game.map.tile,
                            wall.y * game.map.tile,
                            game.map.tile,
                            game.map.tile
                        );
                        break;
                    case "|":
                        ctx.drawImage(
                            sprites,
                            24,
                            96,
                            24,
                            24,
                            wall.x * game.map.tile,
                            wall.y * game.map.tile,
                            game.map.tile,
                            game.map.tile
                        );
                        break;
                    case "┏":
                        ctx.drawImage(
                            sprites,
                            96,
                            96,
                            24,
                            24,
                            wall.x * game.map.tile,
                            wall.y * game.map.tile,
                            game.map.tile,
                            game.map.tile
                        );
                        break;
                    case "┗":
                        ctx.drawImage(
                            sprites,
                            48,
                            96,
                            24,
                            24,
                            wall.x * game.map.tile,
                            wall.y * game.map.tile,
                            game.map.tile,
                            game.map.tile
                        );
                        break;
                    case "┛":
                        ctx.drawImage(
                            sprites,
                            72,
                            96,
                            24,
                            24,
                            wall.x * game.map.tile,
                            wall.y * game.map.tile,
                            game.map.tile,
                            game.map.tile
                        );
                        break;
                    case "┓":
                        ctx.drawImage(
                            sprites,
                            120,
                            96,
                            24,
                            24,
                            wall.x * game.map.tile,
                            wall.y * game.map.tile,
                            game.map.tile,
                            game.map.tile
                        );
                        break;
                }
            });

            // Rysowanie drzwi

            game.doors.forEach(door => {
                ctx.fillStyle = "wheat";
                ctx.fillRect(
                    door.x * game.map.tile,
                    door.y * game.map.tile + game.map.tile * 0.4,
                    game.map.tile,
                    game.map.tile * 0.2
                );
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
        (event.code === "ArrowRight" ||
            event.code === "ArrowLeft" ||
            event.code === "ArrowUp" ||
            event.code === "ArrowDown") &&
        game.player.alive
    ) {
        game.elements.player.direction = event.code;
    }
});
