angular.module('questCreator').controller('playCtrl', function(socket, Avatar, Background, SceneObject, Entity, UserService, GameService, $state, $scope) {
    var self = this;
    var playerInfo = {
        userId: UserService.get().id,
    };
    var gameCanvas = document.getElementById('play-canvas');
    var gameCtx = gameCanvas.getContext('2d');
    var gameWidth = 700;
    var gameHeight = 500;
    this.warning = '';
    var typing = {
        show: false,
        phrase: ''
    };
    var responding = {
        show: false,
        phrase: ''
    };
    var inventory = {
        show: false,
        contents: ''
    }
    var pause = false;
    var startTime = new Date();

    var avatar = null;
    var background = null;
    var objects = null;
    var entities = null;
    var scene = null;

    var gameLoaded = false;
    var avatarLoaded = false;
    var entitiesLoaded = false;

    this.gameToPlay = GameService.getGameDetail().name;
    var gameInfo = null;
    var allMaps = null;
    this.currentMap = null;
    this.allRows = null;
    this.currentRow = null;
    this.currentScene = null;
    this.currentScenePos = [0, 0, 0];
    this.gameLoaded = false;

    this.gameStarted = false;

    var currentGame = GameService.loadGame(self.gameToPlay).done(function(response) {
        self.gameLoaded = true;
        gameInfo = response.info;
        allMaps = gameInfo.maps;
        self.currentMap = allMaps[0];
        self.allRows = self.currentMap.scenes;
        self.currentRow = self.allRows[0];
        self.currentScene = self.currentRow[0];
        background = self.currentScene.background;
        drawBackground();
        $scope.$apply();
    });

    $('body').off('keyup').on('keyup', function(event) {
        var keyCode = event.which;
        if (keyCode === 37) {
            avatar.action = (avatar.action === 'walkLeft')
                ? 'stand'
                : 'walkLeft';
            avatar.info.speed.x = (avatar.info.speed.x === -1 * avatar.info.speed.mag)
                ? 0
                : -1 * avatar.info.speed.mag;
            avatar.info.speed.y = 0;
        } else if (keyCode === 38) {
            avatar.action = (avatar.action === 'walkUp')
                ? 'stand'
                : 'walkUp';
            avatar.info.speed.x = 0;
            avatar.info.speed.y = (avatar.info.speed.y === -1 * avatar.info.speed.mag)
                ? 0
                : -1 * avatar.info.speed.mag;
        } else if (keyCode === 39) {
            avatar.action = (avatar.action === 'walkRight')
                ? 'stand'
                : 'walkRight';
            avatar.info.speed.x = (avatar.info.speed.x === avatar.info.speed.mag)
                ? 0
                : avatar.info.speed.mag;
            avatar.info.speed.y = 0;
        } else if (keyCode === 40) {
            avatar.action = (avatar.action === 'walkDown')
                ? 'stand'
                : 'walkDown';
            avatar.info.speed.x = 0;
            avatar.info.speed.y = (avatar.info.speed.y === avatar.info.speed.mag)
                ? 0
                : avatar.info.speed.mag;
        }
    });

    $('body').off('keypress').on('keypress', function(event) {
        var keyCode = event.which;
        if (typing.show && keyCode >= 32 && keyCode <= 220 && !responding.show && $('.active').length === 0) {
            pause = true;
            var char = String.fromCharCode(keyCode);
            typing.phrase += char;
            $('.typing').text(typing.phrase);
        } else if (keyCode === 13) {
            // Enter
            if (typing.show) { // If the user is finishing typing
                typing.show = false;
                $('.typing').hide();
                var userPhrase = typing.phrase;
                typing.phrase = '';
                checkTyping(userPhrase);
            } else if (responding.show) { // If the user is finished reading a response
                responding.show = false;
                $('.dialog').hide();
                responding.phrase = '';
            } else if (inventory.show) { // If the user is finished looking at inventory
                // $('.inventoryContainer').hide();
                // this.inventory.show = false;
            }
            if (!responding.show && !inventory.show && $('.active').length === 0) { // Resume the game if all windows have been closed
                pause = false;
            }
        } else if (keyCode === 32) {
            // Space
            if (!typing.show) {
                typing.phrase = '>';
                typing.show = true;
                $('.typing').text(typing.phrase).show();
            }
        }
    });

    function loadMainCharacter() {
        // Testing creation of avatar
        var avatarTest = {
            name: 'Avatar Test',
            info: {
                // The x and y coordinate of the top left corner of the avatar
                pos: {
                    x: 100,
                    y: 250
                },
                // The character's speed
                speed: {
                    mag: 3,
                    x: 0,
                    y: 0
                },
                // The animate object contains all the possible character actions with all of the frames to be drawn for each action.
                animate: {
                    // Key: possible action, Value: array of frames
                    walkLeft: [
                        // Each frame array element is an array of square objects to be drawn
                        // Frame 1 - walk left
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'blue'
                            }, {
                                x: 110,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'green'
                            }
                        ],
                        // Frame 2 - walk left
                        [
                            {
                                x: 110,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'blue'
                            }, {
                                x: 100,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'green'
                            }
                        ]
                    ],
                    walkRight: [
                        // Frame 1 - walk right
                        [
                            {
                                x: 150,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'blue'
                            }, {
                                x: 140,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'green'
                            }
                        ],
                        // Frame 2 - walk right
                        [
                            {
                                x: 140,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'blue'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'green'
                            }
                        ]
                    ],
                    walkUp: [
                        // Frame 1 - walk up
                        [
                            {
                                x: 100,
                                y: 110,
                                width: 30,
                                height: 30,
                                color: 'red'
                            }, {
                                x: 150,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'yellow'
                            }
                        ],
                        // Frame 2 - walk up
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'red'
                            }, {
                                x: 150,
                                y: 110,
                                width: 30,
                                height: 30,
                                color: 'yellow'
                            }
                        ]
                    ],
                    walkDown: [
                        // Frame 1 - walk down
                        [
                            {
                                x: 100,
                                y: 140,
                                width: 30,
                                height: 30,
                                color: 'red'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'yellow'
                            }
                        ],
                        // Frame 2 - walk down
                        [
                            {
                                x: 100,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'red'
                            }, {
                                x: 150,
                                y: 140,
                                width: 30,
                                height: 30,
                                color: 'yellow'
                            }
                        ]
                    ],
                    swimLeft: [
                        // Frame 1 - swim left
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }
                        ],
                        // Frame 2 - swim left
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }
                        ]
                    ],
                    swimRight: [
                        // Frame 1 - swim right
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }
                        ],
                        // Frame 2 - swim right
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }
                        ]
                    ],
                    swimUp: [
                        // Frame 1 - swim up
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }
                        ],
                        // Frame 2 - swim up
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }
                        ]
                    ],
                    swimDown: [
                        // Frame 1 - swim down
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'lightblue'
                            }
                        ],
                        // Frame 2 - swim down
                        [
                            {
                                x: 100,
                                y: 100,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }, {
                                x: 150,
                                y: 150,
                                width: 30,
                                height: 30,
                                color: 'gray'
                            }
                        ]
                    ]
                    // Other actions could go here
                },
                // The collision map is how the game can know whether the character has collided with another object or event trigger. It is an array of invisible (or gray for now) squares.
                collisionMap: [
                    {
                        x: 100,
                        y: 180,
                        width: 80,
                        height: 10,
                        color: 'gray'
                    }, {
                        x: 100,
                        y: 185,
                        width: 80,
                        height: 10,
                        color: 'gray'
                    }
                ]
            },
            current: false
        };
        var headerData = {
            user_id: UserService.get().id,
            token: UserService.get().token
        };
        // Avatar
        $.ajax({
            method: 'POST',
            url: 'https://forge-api.herokuapp.com/characters/create',
            headers: headerData,
            data: JSON.stringify(avatarTest),
            dataType: 'json',
            contentType: 'application/json',
            success: function(response) {
                avatar = new Avatar(response);
                avatar.info.currentFrame = avatar.info.animate.walkLeft[0];
                avatarLoaded = true;
                setInterval(checkAvatarAction, 75);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }

    function checkTyping(phrase) {
        if (phrase.includes('look')) {
            responding.phrase = "This is a description of your current scene. I hope it's helpful.";
        } else {
            responding.phrase = "I don't understand that.";
        }
        $('.dialog').text(responding.phrase).show();
        responding.show = true;
        pause = true;
    }
    function checkAvatarBounds() {
        var left = avatar.info.collisionMap[0].x;
        var right = avatar.info.collisionMap[0].x + avatar.info.collisionMap[0].width;
        var top = avatar.info.collisionMap[0].y;
        var bottom = avatar.info.collisionMap[0].y + avatar.info.collisionMap[0].height;
        avatar.info.collisionMap.forEach(function(square) {
            if (square.x < left) {
                left = square.x;
            }
            if (square.x + square.width > right) {
                right = square.x + square.width;
            }
            if (square.y < top) {
                top = square.y;
            }
            if (square.y + square.height > bottom) {
                bottom = square.y + square.height;
            }
        });
        avatar.bounds = {
            left: left + avatar.info.pos.x,
            right: right + avatar.info.pos.x,
            top: top + avatar.info.pos.y,
            bottom: bottom + avatar.info.pos.y,
            width: right - left,
            height: bottom - top
        };
        if (avatar.bounds.right < 0) { // Character moves to the left scene
            self.currentScenePos[2]--;
            if (self.currentScenePos[2] < 0) {
                self.currentScenePos[2] = self.currentRow.length - 1;
            }
            updateLocation();
            avatar.info.pos.x += gameWidth;
        } else if (avatar.bounds.left > gameWidth) { // Character moves to the right scene
            self.currentScenePos[2]++;
            if (self.currentScenePos[2] > self.currentRow.length - 1) {
                self.currentScenePos[2] = 0;
            }
            updateLocation();
            avatar.info.pos.x -= gameWidth;
        } else if (avatar.bounds.bottom < 0) { // Character moves to the above scene
            self.currentScenePos[1]--;
            if (self.currentScenePos[1] < 0) {
                self.currentScenePos[1] = self.allRows.length - 1;
            }
            updateLocation();
            avatar.info.pos.y += gameHeight;
        } else if (avatar.bounds.top > gameHeight) { // Character moves to the below scene
            self.currentScenePos[1]++;
            if (self.currentScenePos[1] > self.allRows.length - 1) {
                self.currentScenePos[1] = 0;
            }
            updateLocation();
            avatar.info.pos.y -= gameHeight;
        }
    }

    function checkAvatarCollisions() {
        var collision = {
            found: false,
            direction: 'none',
            type: 'none'
        };
        avatar.info.collisionMap.forEach(function(avatarSquare) { // Loop through all the avatar squares
            var avatarLeft = avatarSquare.x + avatar.info.pos.x;
            var avatarRight = avatarSquare.x + avatarSquare.width + avatar.info.pos.x;
            var avatarTop = avatarSquare.y + avatar.info.pos.y;
            var avatarBottom = avatarSquare.y + avatarSquare.height + avatar.info.pos.y;
            if (background) {
                background.info.collisionMap.forEach(function(bgSquare) { // Loop through all the background's squares
                    var bgLeft = bgSquare.x;
                    var bgRight = bgSquare.x + bgSquare.width;
                    var bgTop = bgSquare.y;
                    var bgBottom = bgSquare.y + bgSquare.height;
                    // Pattern: check the left, right, top, and bottom edges of the current avatar square against the right, left, bottom, and top edges of the current bg square (in those exact orders).
                    if (avatarLeft <= bgRight && avatarRight >= bgLeft && avatarTop <= bgBottom && avatarBottom >= bgTop) {
                        collision.found = true;
                        collision.type = 'wall';
                        if (avatar.info.speed.x > 0) {
                            collision.direction = 'right';
                        } else if (avatar.info.speed.x < 0) {
                            collision.direction = 'left';
                        } else if (avatar.info.speed.y < 0) {
                            collision.direction = 'up';
                        } else if (avatar.info.speed.y > 0) {
                            collision.direction = 'down';
                        }
                    }
                });
            }
            if (objects) {
                objects.forEach(function(object) {
                    // Find the bounds of the object, if it has any
                    if (object.info.collisionMap[0]) {
                      var left = object.info.collisionMap[0].x;
                      var right = object.info.collisionMap[0].x + object.info.collisionMap[0].width;
                      var top = object.info.collisionMap[0].y;
                      var bottom = object.info.collisionMap[0].y + object.info.collisionMap[0].height;
                      object.info.collisionMap.forEach(function(square) {
                          if (square.x < left) {
                              left = square.x;
                          }
                          if (square.x + square.width > right) {
                              right = square.x + square.width;
                          }
                          if (square.y < top) {
                              top = square.y;
                          }
                          if (square.y + square.height > bottom) {
                              bottom = square.y + square.height;
                          }
                      });
                      object.bounds = {
                          left: left + object.info.pos.x,
                          right: right + object.info.pos.x,
                          top: top + object.info.pos.y,
                          bottom: bottom + object.info.pos.y,
                          width: right - left,
                          height: bottom - top
                      };
                    }
                    object.info.collisionMap.forEach(function(objSquare) { // Loop through all the scene object's squares
                      var objLeft = objSquare.x + object.info.pos.x;
                      var objRight = objSquare.x + objSquare.width + object.info.pos.x;
                      var objTop = objSquare.y + object.info.pos.y;
                      var objBottom = objSquare.y + objSquare.height + object.info.pos.y;
                      // Pattern: check the left, right, top, and bottom edges of the current avatar square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
                      if (avatarLeft <= objRight && avatarRight >= objLeft && avatarTop <= objBottom && avatarBottom >= objTop) {
                          collision.found = true;
                          collision.type = 'wall';
                          if (avatar.info.speed.x > 0) {
                              collision.direction = 'right';
                          } else if (avatar.info.speed.x < 0) {
                              collision.direction = 'left';
                          } else if (avatar.info.speed.y < 0) {
                              collision.direction = 'up';
                          } else if (avatar.info.speed.y > 0) {
                              collision.direction = 'down';
                          }
                      }
                  });
              });
            }
            if (entities) {
              entities.forEach(function(entity) {
                  // Find the bounds of the entity, if it has any
                  if (entity.info.currentFrame.collisionMap[0]) {
                    var left = entity.info.currentFrame.collisionMap[0].x;
                    var right = entity.info.currentFrame.collisionMap[0].x + entity.info.currentFrame.collisionMap[0].width;
                    var top = entity.info.currentFrame.collisionMap[0].y;
                    var bottom = entity.info.currentFrame.collisionMap[0].y + entity.info.currentFrame.collisionMap[0].height;
                    entity.info.currentFrame.collisionMap.forEach(function(square) {
                        if (square.x < left) {
                            left = square.x;
                        }
                        if (square.x + square.width > right) {
                            right = square.x + square.width;
                        }
                        if (square.y < top) {
                            top = square.y;
                        }
                        if (square.y + square.height > bottom) {
                            bottom = square.y + square.height;
                        }
                    });
                    entity.bounds = {
                        left: left + entity.info.pos.x,
                        right: right + entity.info.pos.x,
                        top: top + entity.info.pos.y,
                        bottom: bottom + entity.info.pos.y,
                        width: right - left,
                        height: bottom - top
                    };
                  }
                  entity.info.currentFrame.collisionMap.forEach(function(entSquare) { // Loop through all the scene entity's squares
                    var entLeft = entSquare.x + entity.info.pos.x;
                    var entRight = entSquare.x + entSquare.width + entity.info.pos.x;
                    var entTop = entSquare.y + entity.info.pos.y;
                    var entBottom = entSquare.y + entSquare.height + entity.info.pos.y;
                    // Pattern: check the left, right, top, and bottom edges of the current avatar square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
                    if (avatarLeft <= entRight && avatarRight >= entLeft && avatarTop <= entBottom && avatarBottom >= entTop) {
                        collision.found = true;
                        collision.type = 'wall';
                        if (avatar.info.speed.x > 0) {
                            collision.direction = 'right';
                        } else if (avatar.info.speed.x < 0) {
                            collision.direction = 'left';
                        } else if (avatar.info.speed.y < 0) {
                            collision.direction = 'up';
                        } else if (avatar.info.speed.y > 0) {
                            collision.direction = 'down';
                        }
                    }
                });
              });
            }
        });
        if (collision.found) {
          console.log("Avatar Collided!");
            switch (collision.type) {
                case 'wall':
                    avatar.collide(collision.direction);
                    break;
            }
            collision = {
                found: false,
                direction: 'none',
                type: 'none'
            };
        }
    }

    function checkEntityCollisions() {
      if (entities) {
        entities.forEach(function(entity) {
          var collision = {
              found: false,
              direction: 'none',
              type: 'none'
          };
          entity.info.currentFrame.collisionMap.forEach(function(entitySquare) { // Loop through all the entity squares
              var entityLeft = entitySquare.x + entity.info.pos.x;
              var entityRight = entitySquare.x + entitySquare.width + entity.info.pos.x;
              var entityTop = entitySquare.y + entity.info.pos.y;
              var entityBottom = entitySquare.y + entitySquare.height + entity.info.pos.y;
              if (background) {
                  background.info.collisionMap.forEach(function(bgSquare) { // Loop through all the background's squares
                      var bgLeft = bgSquare.x;
                      var bgRight = bgSquare.x + bgSquare.width;
                      var bgTop = bgSquare.y;
                      var bgBottom = bgSquare.y + bgSquare.height;
                      // Pattern: check the left, right, top, and bottom edges of the current entity square against the right, left, bottom, and top edges of the current bg square (in those exact orders).
                      if (entityLeft <= bgRight && entityRight >= bgLeft && entityTop <= bgBottom && entityBottom >= bgTop) {
                          collision.found = true;
                          collision.type = 'wall';
                          if (entity.info.speed.x > 0) {
                              collision.direction = 'right';
                          } else if (entity.info.speed.x < 0) {
                              collision.direction = 'left';
                          } else if (entity.info.speed.y < 0) {
                              collision.direction = 'up';
                          } else if (entity.info.speed.y > 0) {
                              collision.direction = 'down';
                          }
                      }
                  });
              }
              if (objects) {
                  objects.forEach(function(object) {
                      // Find the bounds of the object, if it has any
                      if (object.info.collisionMap[0]) {
                        var left = object.info.collisionMap[0].x;
                        var right = object.info.collisionMap[0].x + object.info.collisionMap[0].width;
                        var top = object.info.collisionMap[0].y;
                        var bottom = object.info.collisionMap[0].y + object.info.collisionMap[0].height;
                        object.info.collisionMap.forEach(function(square) {
                            if (square.x < left) {
                                left = square.x;
                            }
                            if (square.x + square.width > right) {
                                right = square.x + square.width;
                            }
                            if (square.y < top) {
                                top = square.y;
                            }
                            if (square.y + square.height > bottom) {
                                bottom = square.y + square.height;
                            }
                        });
                        object.bounds = {
                            left: left + object.info.pos.x,
                            right: right + object.info.pos.x,
                            top: top + object.info.pos.y,
                            bottom: bottom + object.info.pos.y,
                            width: right - left,
                            height: bottom - top
                        };
                      }
                      object.info.collisionMap.forEach(function(objSquare) { // Loop through all the scene object's squares
                        var objLeft = objSquare.x + object.info.pos.x;
                        var objRight = objSquare.x + objSquare.width + object.info.pos.x;
                        var objTop = objSquare.y + object.info.pos.y;
                        var objBottom = objSquare.y + objSquare.height + object.info.pos.y;
                        // Pattern: check the left, right, top, and bottom edges of the current entity square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
                        if (entityLeft <= objRight && entityRight >= objLeft && entityTop <= objBottom && entityBottom >= objTop) {
                            collision.found = true;
                            collision.type = 'wall';
                            if (entity.info.speed.x > 0) {
                                collision.direction = 'right';
                            } else if (entity.info.speed.x < 0) {
                                collision.direction = 'left';
                            } else if (entity.info.speed.y < 0) {
                                collision.direction = 'up';
                            } else if (entity.info.speed.y > 0) {
                                collision.direction = 'down';
                            }
                        }
                    });
                });
              }
              /* Not checking for collisions with other entities
              if (entities) {
                entities.forEach(function(otherEntity) {
                  // Don't check the entity with itself
                  if (entity !== otherEntity) {
                    // Find the bounds of the entity, if it has any
                    if (otherEntity.info.currentFrame.collisionMap[0]) {
                      var left = otherEntity.info.currentFrame.collisionMap[0].x;
                      var right = otherEntity.info.currentFrame.collisionMap[0].x + otherEntity.info.currentFrame.collisionMap[0].width;
                      var top = otherEntity.info.currentFrame.collisionMap[0].y;
                      var bottom = otherEntity.info.currentFrame.collisionMap[0].y + otherEntity.info.currentFrame.collisionMap[0].height;
                      otherEntity.info.currentFrame.collisionMap.forEach(function(square) {
                          if (square.x < left) {
                              left = square.x;
                          }
                          if (square.x + square.width > right) {
                              right = square.x + square.width;
                          }
                          if (square.y < top) {
                              top = square.y;
                          }
                          if (square.y + square.height > bottom) {
                              bottom = square.y + square.height;
                          }
                      });
                      otherEntity.bounds = {
                          left: left + otherEntity.info.pos.x,
                          right: right + otherEntity.info.pos.x,
                          top: top + otherEntity.info.pos.y,
                          bottom: bottom + otherEntity.info.pos.y,
                          width: right - left,
                          height: bottom - top
                      };
                    }
                    otherEntity.info.currentFrame.collisionMap.forEach(function(entSquare) { // Loop through all the scene entity's squares
                      var entLeft = entSquare.x + otherEntity.info.pos.x;
                      var entRight = entSquare.x + entSquare.width + otherEntity.info.pos.x;
                      var entTop = entSquare.y + otherEntity.info.pos.yotherEntity
                      var entBottom = entSquare.y + entSquare.height + otherEntity.info.pos.y;
                      // Pattern: check the left, right, top, and bottom edges of the current entity square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
                      if (entityLeft <= entRight && entityRight >= entLeft && entityTop <= entBottom && entityBottom >= entTop) {
                          collision.found = true;
                          collision.type = 'wall';
                          if (entity.info.speed.x > 0) {
                              collision.direction = 'right';
                          } else if (entity.info.speed.x < 0) {
                              collision.direction = 'left';
                          } else if (entity.info.speed.y < 0) {
                              collision.direction = 'up';
                          } else if (entity.info.speed.y > 0) {
                              collision.direction = 'down';
                          }
                      }
                    });
                  }
                });
              }
              */
            });
            if (collision.found) {
                switch (collision.type) {
                    case 'wall':
                        entity.collide(collision.direction);
                        break;
                }
                collision = {
                    found: false,
                    direction: 'none',
                    type: 'none'
                };
            }
        });
      }
    }

    function updateLocation() {
        self.currentMap = allMaps[self.currentScenePos[0]];
        self.allRows = self.currentMap.scenes;
        self.currentRow = self.allRows[self.currentScenePos[1]];
        self.currentScene = self.currentRow[self.currentScenePos[2]];
        background = self.currentScene.background;
        objects = self.currentScene.objects;
        loadEntities();
    }

    function loadEntities() {
      entities = [];
      var oldEntities = self.currentScene.entities;
      oldEntities.forEach(function(entity) {
        var newEntity = new Entity(entity);
        entities.push(newEntity);
      });
      entitiesLoaded = true;
    }

    function updateAvatar() {
            avatar.updatePos();
        }

    function updateEntities() {
      entities.forEach(function(entity) {
        entity.updatePos();
      });
    }

    // NOTE: these frame index variables should probably belong to the individual avatar, object, or entity in the factory
    // var currentAvatarFrameIndex = 0;
    function checkAvatarAction() {
      avatar.info.currentFrameIndex = avatar.info.currentFrameIndex || 0;
        if (avatar.action === 'walkLeft' || avatar.action === 'walkUp' || avatar.action === 'walkRight' || avatar.action === 'walkDown') {
            if (avatar.info.currentFrameIndex > avatar.info.animate[avatar.action].length - 1) {
                avatar.info.currentFrameIndex = 0;
            }
            avatar.info.currentFrame = avatar.info.animate[avatar.action][avatar.info.currentFrameIndex];
            avatar.info.currentFrameIndex++;
        } else {
            // Do nothing, or set frame to a given specific frame.
            // avatar.info.currentFrame = avatar.info.animate.walkLeft[0];
        }
    }

    // Not currently animating objects
    // var currentSceneObjFrameIndex = 0;
    // function checkSceneObjectAction() {
    //   // Animate the object.
    //   if (currentSceneObjFrameIndex > sceneObject.info.animate[sceneObject.allActions[0]].length - 1) {
    //     currentSceneObjFrameIndex = 0;
    //   }
    //   sceneObject.info.currentFrame = sceneObject.info.animate[sceneObject.allActions[0]][currentSceneObjFrameIndex];
    //   currentSceneObjFrameIndex++;
    // }

    function drawAvatar() {
        // Save the drawing context
        gameCtx.save();
        // Translate the canvas origin to be the top left of the avatar
        gameCtx.translate(avatar.info.pos.x, avatar.info.pos.y);
        // Draw the squares from the avatar's current frame
        avatar.info.currentFrame.forEach(function(square) {
            gameCtx.fillStyle = square.color;
            gameCtx.fillRect(square.x, square.y, square.width, square.height);
        });
        gameCtx.globalAlpha = 0.2;
        // Draw the avatar's collision map (purely for testing)
        avatar.info.collisionMap.forEach(function(square) {
            gameCtx.fillStyle = square.color;
            gameCtx.fillRect(square.x, square.y, square.width, square.height);
        });
        gameCtx.restore();
    }

    function drawBackground() {
        if (background) {
            // Save the drawing context
            gameCtx.save();
            // Draw the squares from the background object.
            gameCtx.globalCompositeOperation = "destination-over";
            for (var index = background.info.image.length - 1; index >= 0; index--) {
                var square = background.info.image[index];
                gameCtx.fillStyle = square.color;
                gameCtx.fillRect(square.x, square.y, square.width, square.height);
            }
            gameCtx.globalCompositeOperation = "source-over";
            gameCtx.globalAlpha = 0.2;
            // Draw the background's collision map (purely for testing)
            background.info.collisionMap.forEach(function(square) {
                gameCtx.fillStyle = square.color;
                gameCtx.fillRect(square.x, square.y, square.width, square.height);
            });
            gameCtx.restore();
        } else {
            self.warning = "This scene has no background yet!";
            setTimeout(function() {
                self.warning = '';
            }, 2000);
        }
        $scope.$apply();
    }

    function drawObjects(type) {
        // objects.sort(function(objectA, objectB) {
        //   if (!objectA.bounds) {
        //     objectA.bounds.bottom = null;
        //   }
        //   if (!objectB.bounds) {
        //     objectB.bounds.bottom = null;
        //   }
        //   if (objectA.bounds.bottom < objectB.bounds.bottom) {
        //     return 1;
        //   } else {
        //     return -1;
        //   }
        // });
        // console.log(objects);
        objects.forEach(function(object) {

            // Save the drawing context
            gameCtx.save();
            // Translate the canvas origin to be the top left of the object
            gameCtx.translate(object.info.pos.x, object.info.pos.y);
            // If object has collision map bounds, check avatar location. Otherwise, draw behind character by default.
            // if (object.bounds) {
            //   if (avatar.bounds.top > object.bounds.bottom) {
            //     gameCtx.globalCompositeOperation = "destination-over";  // If object is behind character.
            //   } else {
            //     gameCtx.globalCompositeOperation = "source-over"; // If object is in front of character.
            //   }
            // } else {
            //   gameCtx.globalCompositeOperation = "destination-over";  // If object is behind character.
            // }
            if ( (avatar.bounds.top > object.bounds.bottom && type === 'background') || (avatar.bounds.top < object.bounds.bottom && type === 'foreground') ) {
              // Draw the squares from the object's current frame
              object.info.image.forEach(function(square) {
                  gameCtx.fillStyle = square.color;
                  gameCtx.fillRect(square.x, square.y, square.width, square.height);
              });
              gameCtx.globalAlpha = 0.2;
              // Draw the object's collision map (purely for testing)
              object.info.collisionMap.forEach(function(square) {
                  gameCtx.fillStyle = square.color;
                  gameCtx.fillRect(square.x, square.y, square.width, square.height);
              });
            }
            gameCtx.restore();
        });
    }

    function drawEntities(type) {
      entities.forEach(function(entity) {
          entity.checkAction();
          // Save the drawing context
          gameCtx.save();
          // Translate the canvas origin to be the top left of the entity
          gameCtx.translate(entity.info.pos.x, entity.info.pos.y);
          // If entity has collision map bounds, check avatar location. Otherwise, draw behind character by default.
          // if (entity.bounds) {
          //   if (avatar.bounds.top > entity.bounds.bottom) {
          //     gameCtx.globalCompositeOperation = "destination-over";  // If entity is behind character.
          //   } else {
          //     gameCtx.globalCompositeOperation = "source-over"; // If entity is in front of character.
          //   }
          // } else {
          //   gameCtx.globalCompositeOperation = "destination-over";  // If entity is behind character.
          // }
          if (entity.bounds) {
            if ( (avatar.bounds.top > entity.bounds.bottom && type === 'background') || (avatar.bounds.top < entity.bounds.bottom && type === 'foreground') ) {
              // Draw the squares from the entity's current frame
              entity.info.currentFrame.image.forEach(function(square) {
                  gameCtx.fillStyle = square.color;
                  gameCtx.fillRect(square.x, square.y, square.width, square.height);
              });
              gameCtx.globalAlpha = 0.2;
              // Draw the entity's collision map (purely for testing)
              entity.info.currentFrame.collisionMap.forEach(function(square) {
                  gameCtx.fillStyle = square.color;
                  gameCtx.fillRect(square.x, square.y, square.width, square.height);
              });
            }
          } else if (type === 'background'){
            // Draw the squares from the entity's current frame
            entity.info.currentFrame.image.forEach(function(square) {
                gameCtx.fillStyle = square.color;
                gameCtx.fillRect(square.x, square.y, square.width, square.height);
            });
            gameCtx.globalAlpha = 0.2;
            // Draw the entity's collision map (purely for testing)
            entity.info.currentFrame.collisionMap.forEach(function(square) {
                gameCtx.fillStyle = square.color;
                gameCtx.fillRect(square.x, square.y, square.width, square.height);
            });
          }
          gameCtx.restore();
      });
    }

    function clearCanvas() {
            gameCtx.clearRect(0, 0, gameWidth, gameHeight);
        }

    this.startGame = function() {
        self.currentScenePos = [1, 0, 0]; // NOTE: Initial character start position, need to get from editor
        updateLocation();
        loadMainCharacter();
        self.gameStarted = true;
    };

    function runGame() {
        if (self.gameStarted) {
            clearCanvas();
            if (avatarLoaded) {
                checkAvatarBounds();
                checkAvatarCollisions();
                checkEntityCollisions();
                updateAvatar();
                updateEntities();
                drawEntities('background');
                drawObjects('background');
                drawAvatar();
                drawEntities('foreground');
                drawObjects('foreground');
                drawBackground();
            }
        }
        requestAnimationFrame(runGame);
    }
    requestAnimationFrame(runGame);

  // Socket functionality
  var socketId;
  var allPlayers = [];

  // Tell server I've come to the landing page
  socket.emit('game joined');

  // Get my socket id from the Node server and send my player information to existing players. Then send updates after.
  var loopHandle;
  socket.off('create character');
  socket.on('create character', function(id) {  // Use this immediate response from the server to get my own socket id
    socketId = id;
    var charInfo = {   // My player info

    };
    allPlayers.push(charInfo); // Put myself in the array of players?
    socket.emit('send new player', charInfo); // Send my player information to other users
    loopHandle = setInterval(function() { // Send frequent updates to other players
      playerUpdate = {  // My updated info to be sent to all other players
      }
      allPlayers.forEach(function(player, index) {  // Update myself in the array?
        if (player.id === id) {
          allPlayers[index] = playerUpdate;
        }
      });
      socket.emit('player update', playerUpdate);
    }, 20);
  });

  // Receive an existing player's information if I just join a game
  socket.off('old player found');
  socket.on('old player found', function(oldCharInfo) {
    console.log("Found old player");
    // Add old player to array of players
    allPlayers.push(oldCharInfo);
  });

  // Receive a new player's information if I'm already playing when they join
  socket.off('new player joining');
  socket.on('new player joining', function(newCharInfo) {
    var response = {
      oldCharInfo: charInfo,
      id: newCharInfo.id
    };
    // Add new player to array of players
    allPlayers.push(newCharInfo);
    // Send my response back to the new player to let them know I was already here.
    socket.emit('send old player', response);
  });

  // Update an existing player's information (received at constant interval from every player)
  socket.off('updating player');
  socket.on('updating player', function(playerUpdate) {
    // Find the player who is being updated in the array, and update their details
  });

  // Notify me if a player leaves the game
  socket.off('player left');
  socket.on('player left', function(playerId) {
    console.log("Player left!");
    allPlayers.forEach(function(player, index) {
      if (player.id === playerId) {
        //Remove player from array here
      }
    });
  });

  $scope.$on("$destroy", function(){
    socket.emit('game left'); // Let others know that I left the game if the controller ceases (closing browser, etc)
    clearInterval(loopHandle);
  });

  // Send a text message to the server, to be broadcast to everyone.
  $('.chat-submit').submit(function(){
    socket.emit('chat message', $('.message').val());
    $('.message').val('');
    return false;   // Prevent default page refresh
  });
  // Receieve any broadcast message, and display it in the chat window.
  socket.off('chat message');
  socket.on('chat message', function(msg){
    $('.chat-messages').append($('<li>').text(playerInfo.userId + ': ' + msg));
  });

});
