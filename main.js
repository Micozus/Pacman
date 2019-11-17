"use strict";

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function _instanceof(left, right) {
  if (
    right != null &&
    typeof Symbol !== "undefined" &&
    right[Symbol.hasInstance]
  ) {
    return !!right[Symbol.hasInstance](left);
  } else {
    return left instanceof right;
  }
}

function _classCallCheck(instance, Constructor) {
  if (!_instanceof(instance, Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// sprite tile 24x24
var sprites = new Image();
sprites.src = "spritemap.png";
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var PacmanElement = function PacmanElement(
  id,
  x,
  y,
  spritex,
  spritey,
  outside,
  activated
) {
  _classCallCheck(this, PacmanElement);

  this.id = id;
  this.x = x;
  this.y = y;
  this.spriteX = spritex;
  this.startSpriteX = this.spriteX;
  this.spriteY = spritey;
  this.startSpriteY = this.spriteY;
  this.outside = outside;
  this.activated = activated;
  this.moveAvailable = false;
  this.movementType = "chase";
  this.alive = true;
  this.scared = null;
};

var PacmanGame =
  /*#__PURE__*/
  (function() {
    function PacmanGame() {
      _classCallCheck(this, PacmanGame);

      _defineProperty(this, "gameStarted", false);

      _defineProperty(this, "gameOver", false);

      _defineProperty(this, "level", 1);

      _defineProperty(this, "life", 2);

      _defineProperty(this, "spriteTile", 24);

      _defineProperty(this, "ghostResetTile", {
        x: 13,
        y: 11
      });

      _defineProperty(this, "map", {
        tile: 20,
        width: 28,
        height: 31,
        board: [
          "┏============┓┏============┓",
          "|X....X.....X||X.....X....X|",
          "|.┏==┓.┏===┓.||.┏===┓.┏==┓.|",
          "|P|  |.|   |.||.|   |.|  |P|",
          "|.┗==┛.┗===┛.┗┛.┗===┛.┗==┛.|",
          "|X....X..X..X..X..X..X....X|",
          "|.┏==┓.┏┓.┏======┓.┏┓.┏==┓.|",
          "|.┗==┛.||.┗==┓┏==┛.||.┗==┛.|",
          "|X....X||X..X||X..X||X....X|",
          "┗====┓.|┗==┓.||.┏==┛|.┏====┛",
          "     |.|┏==┛.┗┛.┗==┓|.|     ",
          "     |.||X..X..X..X||.|     ",
          "     |.||.┏==DD==┓.||.|     ",
          "=====┛.┗┛.|######|.┗┛.┗=====",
          "......X..X|######|X..X......",
          "=====┓.┏┓.|######|.┏┓.┏=====",
          "     |.||.┗======┛.||.|     ",
          "     |.||XS######SX||.|     ",
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
      });

      _defineProperty(this, "score", "00000");

      _defineProperty(this, "scorePoints", [0, 0, 0, 0, 0]);

      _defineProperty(this, "gameIntervals", {});

      _defineProperty(this, "elements", {
        player: new PacmanElement("player", 13, 17, 48, 72, true, true),
        ghostPink: new PacmanElement("ghostPink", 12, 13, 0, 192, false, false),
        ghostRed: new PacmanElement("ghostRed", 13, 11, 0, 144, true, true),
        ghostOrange: new PacmanElement(
          "ghostOrange",
          13,
          13,
          0,
          216,
          false,
          false
        ),
        ghostBlue: new PacmanElement(
          "ghostBlue",
          14,
          13,
          192,
          192,
          false,
          false
        )
      });

      _defineProperty(this, "ghostMovementModifier", {
        chase: 1.5,
        frightened: 2,
        backToHouse: 0.5
      });

      _defineProperty(this, "ghosts", Object.values(this.elements).slice(1));

      _defineProperty(this, "player", this.elements.player);

      _defineProperty(
        this,
        "allPositions",
        this.map.board.flatMap(function(row, y) {
          return row.split("").map(function(char, x) {
            return {
              x: x,
              y: y,
              char: char
            };
          });
        })
      );

      _defineProperty(
        this,
        "walls",
        this.allPositions.filter(function(item) {
          return (
            item.char !== "X" &&
            item.char !== "P" &&
            item.char !== "." &&
            item.char !== "#" &&
            item.char !== "D" &&
            item.char !== "K" &&
            item.char !== "S"
          );
        })
      );

      _defineProperty(
        this,
        "dots",
        this.allPositions.filter(function(item) {
          return item.char === "." || item.char === "X";
        })
      );

      _defineProperty(
        this,
        "startingDoors",
        this.allPositions.filter(function(item) {
          return item.char === "S";
        })
      );

      _defineProperty(this, "dotsBlueActivationNumber", this.dots.length - 30);

      _defineProperty(
        this,
        "dotsOrangeActivationNumber",
        this.dots.length * 0.3
      );

      _defineProperty(
        this,
        "crossroads",
        this.allPositions.filter(function(item) {
          return item.char === "X" || item.char === "K";
        })
      );

      _defineProperty(
        this,
        "doors",
        this.allPositions.filter(function(item) {
          return item.char === "D";
        })
      );

      _defineProperty(
        this,
        "powerups",
        this.allPositions.filter(function(item) {
          return item.char === "P" || item.char === "K";
        })
      );
    }

    _createClass(PacmanGame, [
      {
        key: "modifyMovementSpeed",
        value: function modifyMovementSpeed(ghost, modifier) {
          var _this = this;

          var ghostIntervalToChange = this.gameIntervals.ghostMovement.find(
            function(interval) {
              return interval.ghost.id === ghost.id;
            }
          );
          clearInterval(ghostIntervalToChange.interval);
          var intervalToSet = setInterval(function() {
            return _this.ghostMovement(ghost);
          }, 100 * modifier);
          ghostIntervalToChange.interval = intervalToSet;
          ghost.movementInterval = intervalToSet;
        }
      },
      {
        key: "eatDot",
        value: function eatDot() {
          var _this2 = this;

          this.dots.forEach(function(dot, index) {
            if (_this2.player.x === dot.x && _this2.player.y === dot.y) {
              _this2.dots.splice(index, 1);

              _this2.score = _this2.score * 1 + 100 + "";

              switch (_this2.score.length) {
                case 3:
                  _this2.score = "00" + _this2.score;
                  break;

                case 4:
                  _this2.score = "0" + _this2.score;
                  break;
              }

              _this2.scorePoints = _this2.score.split("");
            }
          });
        }
      },
      {
        key: "eatPowerup",
        value: function eatPowerup() {
          var _this3 = this;

          this.powerups.forEach(function(powerup, index) {
            if (
              _this3.player.x === powerup.x &&
              _this3.player.y === powerup.y
            ) {
              _this3.powerups.splice(index, 1);

              _this3.score = _this3.score * 1 + 1000 + "";

              switch (_this3.score.length) {
                case 3:
                  _this3.score = "00" + _this3.score;
                  break;

                case 4:
                  _this3.score = "0" + _this3.score;
                  break;
              }

              _this3.scorePoints = _this3.score.split("");

              _this3.ghosts
                .filter(function(ghost) {
                  return ghost.outside;
                })
                .forEach(function(ghost) {
                  clearTimeout(ghost.scared);
                  ghost.scared = null;

                  _this3.ghostScaredState(ghost, 6000 - _this3.level * 500);
                });
            }
          });
        }
      },
      {
        key: "playerMovement",
        value: function playerMovement() {
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
          this.checkIfLvlUp();
        }
      },
      {
        key: "checkIfLvlUp",
        value: function checkIfLvlUp() {
          if (
            this.dots.length === 0 &&
            this.powerups.length === 0 &&
            this.life > 0
          ) {
            this.gameReset("lvlUp");
          }
        }
      },
      {
        key: "setPlayerStartingSprite",
        value: function setPlayerStartingSprite() {
          this.player.spriteX = 0;
          this.player.spriteY = this.spriteTile * 7;
        } // Wybór kierunku na zasadzie pseudolosowości wyboru, aby duszki nie były bezlitosnymi mordercami i czasami mogły się mylić :)
      },
      {
        key: "randomiseFromGivenDirections",
        value: function randomiseFromGivenDirections(directions) {
          return directions[Math.floor(Math.random() * directions.length)];
        }
      },
      {
        key: "elemToCrossMapBridge",
        value: function elemToCrossMapBridge(elem) {
          if (elem.x < 0 && elem.y === 14) {
            elem.x = this.map.width - 1;
          }

          if (elem.x > this.map.width - 1 && elem.y === 14) {
            elem.x = 0;
          }
        }
      },
      {
        key: "changeGhostSpriteBasedOnDirection",
        value: function changeGhostSpriteBasedOnDirection(ghost) {
          if (
            ghost.movementType === "chase" ||
            ghost.movementType === "scatter"
          ) {
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
        } // Algorytm poruszania ducha
      },
      {
        key: "ghostDirectionAlgorithm",
        value: function ghostDirectionAlgorithm(elementToChase, ghost) {
          var _this4 = this;

          this.crossroads.forEach(function(crossroad) {
            // Komentarze określają lokalizację Pacmana w stosunku do ducha
            if (ghost.x === crossroad.x && ghost.y === crossroad.y) {
              // Sprawdzenie czy duch nie zostal zlapany przez Pacmana
              if (ghost.alive) {
                // Prawo Dół
                if (elementToChase.x > ghost.x && elementToChase.y > ghost.y) {
                  // Ruch warunkowany typem poruszania ducha, drugi state to frightened,
                  // TODO: ew. scatter type
                  ghost.direction =
                    ghost.movementType === "chase"
                      ? _this4.randomiseFromGivenDirections([
                          "ArrowRight",
                          "ArrowDown"
                        ])
                      : _this4.randomiseFromGivenDirections([
                          "ArrowLeft",
                          "ArrowUp"
                        ]); // Prawo
                } else if (
                  elementToChase.x > ghost.x &&
                  elementToChase.y === ghost.y
                ) {
                  ghost.direction =
                    ghost.movementType === "chase"
                      ? _this4.randomiseFromGivenDirections(["ArrowRight"])
                      : _this4.randomiseFromGivenDirections([
                          "ArrowLeft",
                          "ArrowDown",
                          "ArrowUp"
                        ]); // Prawo Góra
                } else if (
                  elementToChase.x > ghost.x &&
                  elementToChase.y < ghost.y
                ) {
                  ghost.direction =
                    ghost.movementType === "chase"
                      ? _this4.randomiseFromGivenDirections([
                          "ArrowRight",
                          "ArrowUp"
                        ])
                      : _this4.randomiseFromGivenDirections([
                          "ArrowLeft",
                          "ArrowDown"
                        ]); // Lewo Dół
                } else if (
                  elementToChase.x < ghost.x &&
                  elementToChase.y > ghost.y
                ) {
                  ghost.direction =
                    ghost.movementType === "chase"
                      ? _this4.randomiseFromGivenDirections([
                          "ArrowLeft",
                          "ArrowDown"
                        ])
                      : _this4.randomiseFromGivenDirections([
                          "ArrowRight",
                          "ArrowUp"
                        ]); // Lewo
                } else if (
                  elementToChase.x < ghost.x &&
                  elementToChase.y === ghost.y
                ) {
                  ghost.direction =
                    ghost.movementType === "chase"
                      ? _this4.randomiseFromGivenDirections(["ArrowLeft"])
                      : _this4.randomiseFromGivenDirections([
                          "ArrowRight",
                          "ArrowDown",
                          "ArrowUp"
                        ]); // Lewo Góra
                } else if (
                  elementToChase.x < ghost.x &&
                  elementToChase.y < ghost.y
                ) {
                  ghost.direction =
                    ghost.movementType === "chase"
                      ? _this4.randomiseFromGivenDirections([
                          "ArrowLeft",
                          "ArrowUp"
                        ])
                      : _this4.randomiseFromGivenDirections([
                          "ArrowRight",
                          "ArrowDown"
                        ]);
                } // Jezeli zostal zlapany przez Pacmana kieruje sie do bramy jako duch
              } else {
                // Prawo Dół
                if (elementToChase.x > ghost.x && elementToChase.y > ghost.y) {
                  ghost.direction = _this4.randomiseFromGivenDirections([
                    "ArrowRight",
                    "ArrowDown"
                  ]); // Prawo
                } else if (
                  elementToChase.x > ghost.x &&
                  elementToChase.y === ghost.y
                ) {
                  ghost.direction = _this4.randomiseFromGivenDirections([
                    "ArrowRight"
                  ]); // Prawo Góra
                } else if (
                  elementToChase.x > ghost.x &&
                  elementToChase.y < ghost.y
                ) {
                  ghost.direction = _this4.randomiseFromGivenDirections([
                    "ArrowRight",
                    "ArrowUp"
                  ]); // Lewo Dół
                } else if (
                  elementToChase.x < ghost.x &&
                  elementToChase.y > ghost.y
                ) {
                  ghost.direction = _this4.randomiseFromGivenDirections([
                    "ArrowLeft",
                    "ArrowDown"
                  ]); // Lewo
                } else if (
                  elementToChase.x < ghost.x &&
                  elementToChase.y === ghost.y
                ) {
                  ghost.direction = _this4.randomiseFromGivenDirections([
                    "ArrowLeft"
                  ]); // Lewo Góra
                } else if (
                  elementToChase.x < ghost.x &&
                  elementToChase.y < ghost.y
                ) {
                  ghost.direction = _this4.randomiseFromGivenDirections([
                    "ArrowLeft",
                    "ArrowUp"
                  ]);
                }
              }
            } else if (!ghost.moveAvailable) {
              ghost.direction = _this4.randomiseFromGivenDirections([
                "ArrowRight",
                "ArrowDown",
                "ArrowLeft",
                "ArrowUp"
              ]);
            }

            _this4.changeGhostSpriteBasedOnDirection(ghost);
          });
        }
      },
      {
        key: "ghostMovementTypesPick",
        value: function ghostMovementTypesPick(ghost) {
          !ghost.alive
            ? this.ghostDirectionAlgorithm(this.ghostResetTile, ghost)
            : this.ghostDirectionAlgorithm(this.player, ghost);
        }
      },
      {
        key: "ghostCollisionCheck",
        value: function ghostCollisionCheck(ghost) {
          if (ghost.outside && ghost.alive) {
            ghost.movementType === "frightened"
              ? this.ghostReset(ghost)
              : this.playerReset(ghost);
          }
        }
      },
      {
        key: "ghostMovement",
        value: function ghostMovement(ghost) {
          if (ghost.outside) {
            this.elemToCrossMapBridge(ghost);
            this.ghostMovementTypesPick(ghost);

            if (
              !ghost.alive &&
              ghost.x === this.ghostResetTile.x &&
              ghost.y === this.ghostResetTile.y
            ) {
              this.deactivateGhost(ghost);
              this.activateGhost(ghost);
            }

            this.moving(ghost, ghost.direction);
          }
        }
      },
      {
        key: "playerPositionReset",
        value: function playerPositionReset() {
          this.player.x = 13;
          this.player.y = 17;
          this.player.direction = null;
        }
      },
      {
        key: "playerReset",
        value: function playerReset(ghost) {
          var _this5 = this;

          if (this.player.x === ghost.x && this.player.y === ghost.y) {
            this.player.direction = null;
            this.ghosts.forEach(function(ghost) {
              return _this5.deactivateGhost(ghost);
            });
            this.pacmanDestroyAnimation();
            this.player.alive = false;
            setTimeout(function() {
              return _this5.gameReset("pacmanDeath");
            }, 2600);
          }
        }
      },
      {
        key: "ghostReset",
        value: function ghostReset(ghost) {
          if (this.player.x === ghost.x && this.player.y === ghost.y) {
            clearTimeout(ghost.scared);
            clearTimeout(ghost.interval);
            this.setCaughtByPacmanGhostSprite(ghost);
            this.modifyMovementSpeed(
              ghost,
              this.ghostMovementModifier.backToHouse
            );
            ghost.scared = null;
            ghost.interval = null;
            ghost.alive = false;
          }
        }
      },
      {
        key: "ghostActivationRoutine",
        value: function ghostActivationRoutine() {
          var _this6 = this;

          // The pink ghost starts inside the ghost house, but always exits immediately, even in the first level.
          setTimeout(function() {
            if (!_this6.elements.ghostPink.activated)
              _this6.activateGhost(_this6.elements.ghostPink);
          }, 1000); // The blue ghost is nicknamed Inky, and remains inside the ghost house for a short time on the first level,
          // not joining the chase until Pac-Man has managed to consume at least 30 of the dots.

          if (
            this.dots.length <= this.dotsBlueActivationNumber &&
            !this.elements.ghostBlue.activated
          )
            this.activateGhost(this.elements.ghostBlue); //The orange ghost, "Clyde", is the last to leave the ghost house,
          // and does not exit at all in the first level until over a third of the dots have been eaten.

          if (
            this.dots.length <= this.dotsOrangeActivationNumber &&
            !this.elements.ghostOrange.activated
          )
            this.activateGhost(this.elements.ghostOrange);
        }
      },
      {
        key: "sortGhostsInHouse",
        value: function sortGhostsInHouse() {
          var ghostsInHouse = Object.values(game.elements).filter(function(
            ghost
          ) {
            return !ghost.outside;
          });

          for (var i = 0; i < ghostsInHouse.length; i++) {
            ghostsInHouse[i].x = 12 + i;
          }
        }
      },
      {
        key: "activateGhost",
        value: function activateGhost(ghost) {
          ghost.x = 13;
          ghost.y = 11;
          ghost.outside = true;
          ghost.alive = true;
          ghost.movementType = "chase";
          ghost.scared = null;
          ghost.activated = true;
          clearTimeout(ghost.scared);
          this.sortGhostsInHouse();
        } // Powrót ducha do bazowych sprite'ów
      },
      {
        key: "resetGhostSprite",
        value: function resetGhostSprite(ghost) {
          ghost.spriteX = ghost.startSpriteX;
          ghost.spriteY = ghost.startSpriteY;
        } // Ustawianie spritu ducha wskazujac, że jego movement type jest frightened
      },
      {
        key: "setScaredGhostSprite",
        value: function setScaredGhostSprite(ghost) {
          ghost.spriteX = this.spriteTile * 9;
          ghost.spriteY = this.spriteTile * 4;
        } // Ustawianie spritu ducha na jasny, wskazówka dla gracza, że zaraz zmieni typ movementu
      },
      {
        key: "setScaredFlashingGhostSprite",
        value: function setScaredFlashingGhostSprite(ghost) {
          ghost.spriteX = this.spriteTile * 7;
          ghost.spriteY = this.spriteTile * 4;
        }
      },
      {
        key: "setCaughtByPacmanGhostSprite",
        value: function setCaughtByPacmanGhostSprite(ghost) {
          ghost.spriteX = this.spriteTile * 9;
          ghost.spriteY = this.spriteTile * 9;
        } // Logika zmiany typu movementu po powerupie
      },
      {
        key: "ghostScaredState",
        value: function ghostScaredState(ghost, time) {
          var _this7 = this;

          clearTimeout(ghost.scared);
          ghost.scared = null;
          ghost.movementType = "frightened";
          this.modifyMovementSpeed(
            ghost,
            this.ghostMovementModifier.frightened
          );
          this.setScaredGhostSprite(ghost);
          ghost.scared = setTimeout(function() {
            if (ghost.alive) _this7.ghostFlashingSprite(ghost);
          }, time);
        } // Logika flashowania powrotu do poprzedniego movement typu
      },
      {
        key: "ghostFlashingSprite",
        value: function ghostFlashingSprite(ghost) {
          var _this8 = this;

          var flashingTimeout;
          var interval = setInterval(function() {
            ghost.alive
              ? _this8.setScaredGhostSprite(ghost)
              : _this8.setCaughtByPacmanGhostSprite(ghost);
            flashingTimeout = setTimeout(function() {
              return ghost.alive
                ? _this8.setScaredFlashingGhostSprite(ghost)
                : _this8.setCaughtByPacmanGhostSprite(ghost);
            }, 300);
          }, 500);
          ghost.interval = interval;
          setTimeout(function() {
            clearInterval(interval);
            ghost.interval = null;
            clearTimeout(ghost.scared);
            clearTimeout(flashingTimeout);

            if (ghost.alive) {
              _this8.modifyMovementSpeed(
                ghost,
                _this8.ghostMovementModifier.chase
              );

              ghost.scared = null;
              ghost.movementType = "chase";

              _this8.resetGhostSprite(ghost);
            }
          }, 4000);
        }
      },
      {
        key: "deactivateGhost",
        value: function deactivateGhost(ghost) {
          if (ghost.outside) {
            this.sortGhostsInHouse();
            var ghostsInHouse = Object.values(game.elements).filter(function(
              ghost
            ) {
              return !ghost.outside;
            }).length;

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
      },
      {
        key: "moving",
        value: function moving(elem, direction) {
          var currentPosition = {
            x: elem.x,
            y: elem.y
          };
          if (direction === "ArrowUp") elem.y--;
          if (direction === "ArrowDown") elem.y++;
          if (direction === "ArrowLeft") elem.x--;
          if (direction === "ArrowRight") elem.x++;
          this.walls.forEach(function(wall) {
            if (elem.x === wall.x && elem.y === wall.y) {
              elem.x = currentPosition.x;
              elem.y = currentPosition.y;
            }
          });
          this.doors.forEach(function(door) {
            if (elem.x === door.x && elem.y === door.y) {
              elem.x = currentPosition.x;
              elem.y = currentPosition.y;
            }
          });

          if (elem !== this.player) {
            this.startingDoors.forEach(function(door) {
              if (elem.x === door.x && elem.y === door.y) {
                elem.x = currentPosition.x;
                elem.y = currentPosition.y;
              }
            });
          }

          if (elem.x !== currentPosition.x || elem.y !== currentPosition.y) {
            elem.moveAvailable = true;
            elem.lastGoodPath = elem.direction;
          } else {
            elem.moveAvailable = false;

            if (elem === this.player) {
              elem.direction = elem.lastGoodPath;
            } else {
              elem.direction = !elem.alive
                ? this.ghostDirectionAlgorithm(this.ghostResetTile, elem)
                : this.ghostDirectionAlgorithm(this.player, elem);
            }
          }
        }
      },
      {
        key: "pacmanInit",
        value: function pacmanInit() {
          var _this9 = this;

          var ghostIntervals = [];
          this.ghosts.forEach(function(ghost) {
            ghost.activated = false;
            ghost.movementInterval = setInterval(function() {
              return _this9.ghostMovement(ghost);
            }, 100 * game.ghostMovementModifier.chase);
            ghostIntervals.push({
              ghost: ghost,
              interval: ghost.movementInterval
            });
          });
          this.gameIntervals = {
            ghostActivationRoutine: setInterval(function() {
              return _this9.ghostActivationRoutine();
            }, 1000),
            playerMovement: setInterval(function() {
              _this9.playerMovement();
            }, 100),
            // Częstsze sprawdzanie kolizji - nie ma mowy, że duchy się miną z pacmanem
            ghostCollision: setInterval(function() {
              _this9.ghosts.forEach(function(ghost) {
                return _this9.ghostCollisionCheck(ghost);
              });
            }, 10),
            ghostMovement: [].concat(ghostIntervals)
          };
        }
      },
      {
        key: "pacmanDestroyAnimation",
        value: function pacmanDestroyAnimation() {
          var _this10 = this;

          if (this.player.alive) {
            this.setPlayerStartingSprite();
            var playerInterval = this.gameIntervals.playerMovement;
            clearInterval(playerInterval);
            playerInterval = null;
            var destroyStartingTile = this.spriteTile * 5;
            this.player.spriteX = destroyStartingTile;
            var startingPosition = 1;
            var animation = setInterval(function() {
              _this10.player.spriteX =
                destroyStartingTile + startingPosition * _this10.spriteTile;
              startingPosition++;
              if (startingPosition === 12) clearInterval(animation);
            }, 200);
          }
        }
      },
      {
        key: "resetDots",
        value: function resetDots() {
          this.dots = this.allPositions.filter(function(item) {
            return item.char === "." || item.char === "X";
          });
          this.powerups = this.allPositions.filter(function(item) {
            return item.char === "P" || item.char === "K";
          });
        }
      },
      {
        key: "gameReset",
        value: function gameReset(resetType) {
          var _this11 = this;

          this.player.alive = true;
          this.ghosts.forEach(function(ghost) {
            return _this11.deactivateGhost(ghost);
          });
          Object.values(this.gameIntervals)
            .flatMap(function(interval) {
              return interval;
            })
            .map(function(el) {
              return _typeof(el) === "object" ? el.interval : el;
            })
            .forEach(function(interval) {
              clearInterval(interval);
              interval = null;
            });

          if (resetType === "pacmanDeath") {
            this.life--;

            if (this.life === 0) {
              this.gameOver = true;
              this.gameStarted = false;
              this.score = "00000";
              this.scorePoints = [0, 0, 0, 0, 0];
              this.resetDots();
            }
          } // Zakończenie poziomu - level up

          if (resetType === "lvlUp") {
            this.level++;
            this.resetDots();
          }

          this.ghosts.forEach(function(ghost) {
            return (ghost.activated = false);
          });
          this.playerPositionReset();
          this.activateGhost(this.elements.ghostRed);
          this.pacmanInit();
        }
      }
    ]);

    return PacmanGame;
  })();

var game = new PacmanGame();

var Canvas =
  /*#__PURE__*/
  (function() {
    function Canvas() {
      _classCallCheck(this, Canvas);

      _defineProperty(this, "gameColor", "#fffa2f");
    }

    _createClass(Canvas, [
      {
        key: "showWelcomeScreen",
        value: function showWelcomeScreen() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = this.gameColor;
          ctx.font = "60px consolas";
          ctx.textAlign = "center";
          ctx.fillText("PACMAN", canvas.width / 2, canvas.height / 2 - 20);
          ctx.font = "20px consolas";
          ctx.fillText(
            "Press spacebar to start",
            canvas.width / 2,
            canvas.height / 2 + 30
          );
        }
      },
      {
        key: "showGameOver",
        value: function showGameOver() {
          ctx.fillStyle = "#000000";
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = this.gameColor;
          ctx.font = "60px Consolas";
          ctx.textAlign = "center";
          ctx.fillText("You lost!", canvas.width / 2, canvas.height / 2 - 20);
          ctx.font = "20px Consolas";
          ctx.fillText(
            "Press space bar to start a new game",
            canvas.width / 2,
            canvas.height / 2 + 30
          );
        }
      },
      {
        key: "showCongratulations",
        value: function showCongratulations() {
          console.log("test");
          ctx.fillStyle = "#000000";
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = this.gameColor;
          ctx.font = "60px Consolas";
          ctx.textAlign = "center";
          ctx.fillText(
            "Congratulations!",
            canvas.width / 2,
            canvas.height / 2 - 20
          );
          ctx.font = "20px Consolas";
          ctx.fillText(
            "You won life! If you wish to continue - go on, press space bar!",
            canvas.width / 2,
            canvas.height / 2 + 30
          );
        }
      },
      {
        key: "canvasInit",
        value: function canvasInit() {
          var _this12 = this;

          var step = function step() {
            if (game.gameStarted) {
              var toDraw = Object.values(game.elements);
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              toDraw.forEach(function(draw) {
                return ctx.drawImage(
                  sprites,
                  draw.spriteX,
                  draw.spriteY,
                  24,
                  24,
                  draw.x * game.map.tile,
                  draw.y * game.map.tile,
                  game.map.tile,
                  game.map.tile
                );
              }); // Rysowanie żyć

              for (var i = 0; i < game.life; i++) {
                ctx.drawImage(
                  sprites,
                  0,
                  game.spriteTile * 3,
                  24,
                  24,
                  5 + i * 25,
                  canvas.height - 28,
                  20,
                  20
                );
              } // Rysowanie kulek

              game.dots.forEach(function(dot) {
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
              }); // Rysowanie powerupów

              game.powerups.forEach(function(powerup) {
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
              }); //
              // Rysowanie
              // wyniku
              // S

              var scoreWord = [19, 3, 15, 18, 5];
              scoreWord.forEach(function(letter, index) {
                ctx.drawImage(
                  sprites,
                  2 + letter * 12,
                  24,
                  10,
                  10,
                  (game.map.width * game.map.tile) / 1.5 + index * 11,
                  game.map.tile * game.map.height + 1,
                  10,
                  10
                );
              });
              game.scorePoints.forEach(function(letter, index) {
                ctx.drawImage(
                  sprites,
                  2 + letter * 12,
                  2,
                  10,
                  10,
                  (game.map.width * game.map.tile) / 1.5 + index * 11,
                  game.map.tile * game.map.height + 12,
                  10,
                  10
                );
              }); // Rysowanie
              // levelu

              var lvlWord = [12, 22, 12];
              lvlWord.forEach(function(letter, index) {
                ctx.drawImage(
                  sprites,
                  2 + letter * 12,
                  24,
                  10,
                  10,
                  (game.map.width * game.map.tile) / 1.2 + index * 11,
                  game.map.tile * game.map.height + 1,
                  10,
                  10
                );
              });
              ctx.drawImage(
                sprites,
                game.level * 12,
                0,
                12,
                12,
                (game.map.width * game.map.tile) / 1.2,
                game.map.tile * game.map.height + 12,
                10,
                10
              ); // Rysowanie ścian

              game.walls.forEach(function(wall) {
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
              }); // Rysowanie drzwi

              game.doors.forEach(function(door) {
                ctx.fillStyle = "wheat";
                ctx.fillRect(
                  door.x * game.map.tile,
                  door.y * game.map.tile + game.map.tile * 0.4,
                  game.map.tile,
                  game.map.tile * 0.2
                );
              });
            } else if (!game.gameStarted && !game.gameOver) {
              _this12.showWelcomeScreen();
            } else if (!game.gameStarted && game.gameOver) {
              _this12.showGameOver();

              game.level = 1;
              game.life = 2;
            } else if (game.gameStarted && game.level === 2 && !game.gameOver) {
              _this12.showCongratulations();

              game.level = 1;
              game.life = 2;
            }

            window.requestAnimationFrame(step);
          };

          canvas.width = game.map.width * game.map.tile;
          canvas.height = game.map.height * (game.map.tile + 1);

          sprites.onload = function() {
            window.requestAnimationFrame(step);
          };
        }
      }
    ]);

    return Canvas;
  })();

var gameCanvas = new Canvas();
game.pacmanInit();
gameCanvas.canvasInit(); // STRASZNA IFOLOGIA - DO PRZEPISANIA

var keyEvent = function keyEvent(event) {
  event.preventDefault();

  if (
    game.gameStarted &&
    (event.code === "ArrowRight" ||
      event.code === "ArrowLeft" ||
      event.code === "ArrowUp" ||
      event.code === "ArrowDown")
  ) {
    if (
      (event.code === "ArrowRight" ||
        event.code === "ArrowLeft" ||
        event.code === "ArrowUp" ||
        event.code === "ArrowDown") &&
      game.player.alive
    )
      if (
        game.elements.player.direction === "ArrowDown" ||
        game.elements.player.direction === "ArrowUp"
      ) {
        if (event.code === "ArrowDown" || event.code === "ArrowUp") {
          game.elements.player.direction = event.code;
        }
      }

    if (
      game.elements.player.direction === "ArrowLeft" ||
      game.elements.player.direction === "ArrowRight"
    ) {
      game.elements.player.direction = event.code;
    }

    if (game.elements.player.x === 13 && game.elements.player.y === 17) {
      game.elements.player.direction = event.code;
    }

    game.crossroads.forEach(function(crossroad) {
      if (
        game.elements.player.x === crossroad.x &&
        game.elements.player.y === crossroad.y
      ) {
        game.elements.player.direction = event.code;
      }
    });
  }

  if (!game.gameStarted || game.gameOver) {
    if (event.code === "Space") {
      game.gameStarted = true;
    }
  }
};

window.addEventListener("keydown", function(event) {
  return keyEvent(event);
});
window.addEventListener("keyup", function(event) {
  return keyEvent(event);
});
