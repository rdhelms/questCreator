angular.module('questCreator').controller('playCtrl', function(socket, Avatar, Background, SceneObject, Entity, UserService, GameService, $state, $scope) {
    var fullPlayer = {
      id: null,
      game: null,
      scenePos: null,
      avatar: null,
      socketId: null
    };
    var allPlayers = [];
    var self = this;
    var playerInfo = {
        id: UserService.get().id,
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

    this.gameName = GameService.getGameDetail().name;
    var gameInfo = null;
    var startPos = null;
    var allMaps = null;
    var currentGame = null;
    this.currentMap = null;
    this.allRows = null;
    this.currentRow = null;
    this.currentScene = null;
    this.currentScenePos = [0, 0, 0];
    this.gameLoaded = false;
    var events = null;

    this.gameStarted = false;

    $('body').off('keyup').on('keyup', function(event) {
            var keyCode = event.which;
            if (keyCode === 37) {
                avatar.action = (avatar.action === 'walkLeft')
                    ? 'stand'
                    : 'walkLeft';
                avatar.speed.x = (avatar.speed.x === -1 * avatar.speed.mag)
                    ? 0
                    : -1 * avatar.speed.mag;
                avatar.speed.y = 0;
            } else if (keyCode === 38) {
                avatar.action = (avatar.action === 'walkUp')
                    ? 'stand'
                    : 'walkUp';
                avatar.speed.x = 0;
                avatar.speed.y = (avatar.speed.y === -1 * avatar.speed.mag)
                    ? 0
                    : -1 * avatar.speed.mag;
            } else if (keyCode === 39) {
                avatar.action = (avatar.action === 'walkRight')
                    ? 'stand'
                    : 'walkRight';
                avatar.speed.x = (avatar.speed.x === avatar.speed.mag)
                    ? 0
                    : avatar.speed.mag;
                avatar.speed.y = 0;
            } else if (keyCode === 40) {
                avatar.action = (avatar.action === 'walkDown')
                    ? 'stand'
                    : 'walkDown';
                avatar.speed.x = 0;
                avatar.speed.y = (avatar.speed.y === avatar.speed.mag)
                    ? 0
                    : avatar.speed.mag;
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
            } else if (keyCode === 32 && !$(".message").is(":focus")) {
                // Space
                if (!typing.show) {
                    typing.phrase = '>';
                    typing.show = true;
                    $('.typing').text(typing.phrase).show();
                }
            }
        });


    function checkTyping(phrase) {
      // phrase = "look window";
      // events = {
      //   typing: [
      //     {
      //       words: [ ['look'], ['window'] ],
      //       response: [
      //         {
      //           type: 'text',
      //           value: "You are standing in Uncle Vernon's and Aunt Petunia's kitchen."
      //         }
      //       ]
      //     },
      //     {
      //       words: [ ['look'] ],
      //       response: [
      //         {
      //           type: 'text',
      //           value: 'The window looks out to the very small back yard.'
      //         }
      //       ]
      //     }
      //   ]
      // };
      var existingMatch = false;
      events.typing.forEach(function(typingEvent) {
        if (!existingMatch) {
          var matchFound = true;
          typingEvent.words.forEach(function(wordSet) {
              var possibleMatch = false;
              wordSet.forEach(function(word) {
                if ( phrase.includes(word) ) {
                  possibleMatch = true;
                }
              });
              if (!possibleMatch) {
                matchFound = false;
                responding.phrase = 'I have literally no idea what you just said.';
              }
          });
          if (matchFound) {
            existingMatch = true;
            responding.phrase = typingEvent.response[0].value;
          }
        }
      });
        $('.dialog').text(responding.phrase).show();
        responding.show = true;
        pause = true;
    }

    function checkAvatarBounds() {
        var left = avatar.info.currentFrame.collisionMap[0].x;
        var right = avatar.info.currentFrame.collisionMap[0].x + avatar.info.currentFrame.collisionMap[0].width;
        var top = avatar.info.currentFrame.collisionMap[0].y;
        var bottom = avatar.info.currentFrame.collisionMap[0].y + avatar.info.currentFrame.collisionMap[0].height;
        avatar.info.currentFrame.collisionMap.forEach(function(square) {
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
        avatar.info.currentFrame.collisionMap.forEach(function(avatarSquare) { // Loop through all the avatar squares
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
                        if (avatar.speed.x > 0) {
                            collision.direction = 'right';
                        } else if (avatar.speed.x < 0) {
                            collision.direction = 'left';
                        } else if (avatar.speed.y < 0) {
                            collision.direction = 'up';
                        } else if (avatar.speed.y > 0) {
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
                          if (avatar.speed.x > 0) {
                              collision.direction = 'right';
                          } else if (avatar.speed.x < 0) {
                              collision.direction = 'left';
                          } else if (avatar.speed.y < 0) {
                              collision.direction = 'up';
                          } else if (avatar.speed.y > 0) {
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
                    var entLeft = (entSquare.x + entity.info.pos.x) * entity.scale;
                    var entRight = (entSquare.x + entSquare.width + entity.info.pos.x) * entity.scale;
                    var entTop = (entSquare.y + entity.info.pos.y) * entity.scale;
                    var entBottom = (entSquare.y + entSquare.height + entity.info.pos.y) * entity.scale;
                    // Pattern: check the left, right, top, and bottom edges of the current avatar square against the right, left, bottom, and top edges of the current scene object square (in those exact orders).
                    if (avatarLeft <= entRight && avatarRight >= entLeft && avatarTop <= entBottom && avatarBottom >= entTop) {
                        collision.found = true;
                        collision.type = 'wall';
                        if (avatar.speed.x > 0) {
                            collision.direction = 'right';
                        } else if (avatar.speed.x < 0) {
                            collision.direction = 'left';
                        } else if (avatar.speed.y < 0) {
                            collision.direction = 'up';
                        } else if (avatar.speed.y > 0) {
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
              var entityLeft = (entitySquare.x + entity.info.pos.x) * entity.scale;
              var entityRight = (entitySquare.x + entitySquare.width + entity.info.pos.x) * entity.scale;
              var entityTop = (entitySquare.y + entity.info.pos.y) * entity.scale;
              var entityBottom = (entitySquare.y + entitySquare.height + entity.info.pos.y) * entity.scale;
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
        fullPlayer.scenePos = self.currentScenePos;
        self.currentMap = allMaps[self.currentScenePos[0]];
        self.allRows = self.currentMap.scenes;
        self.currentRow = self.allRows[self.currentScenePos[1]];
        self.currentScene = self.currentRow[self.currentScenePos[2]];
        background = self.currentScene.background;
        // Expected location of events
        // events = self.currentScene.events;
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
      fullPlayer.avatar = avatar;
      socket.emit('update player', fullPlayer);
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

    function drawAvatar(avatarToDraw) {
        // Save the drawing context
        gameCtx.save();
        // Translate the canvas origin to be the top left of the avatarToDraw
        gameCtx.translate(avatarToDraw.info.pos.x, avatarToDraw.info.pos.y);
        // Draw the squares from the avatarToDraw's current frame
        avatarToDraw.info.currentFrame.image.forEach(function(square) {
            gameCtx.fillStyle = square.color;
            gameCtx.fillRect(square.x, square.y, square.width, square.height);
        });
        gameCtx.globalAlpha = 0.2;
        // Draw the avatarToDraw's collision map (purely for testing)
        avatarToDraw.info.currentFrame.collisionMap.forEach(function(square) {
            gameCtx.fillStyle = square.color;
            gameCtx.fillRect(square.x, square.y, square.width, square.height);
        });
        gameCtx.restore();
    }

    function drawAllPlayers() {
      allPlayers.forEach(function(player) {
        if (player.scenePos[0] === fullPlayer.scenePos[0] && player.scenePos[1] === fullPlayer.scenePos[1] && player.scenePos[2] === fullPlayer.scenePos[2]) {
          drawAvatar(player.avatar);
        }
      });
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
      if (objects) {
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
            if (object.bounds) {
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
            } else if (type === 'background'){
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
    }

    function drawEntities(type) {
      // Check for entities existence
      if (entities) {
        entities.forEach(function(entity) {
            entity.checkAction();
            // Save the drawing context
            gameCtx.save();
            // Translate the canvas origin to be the top left of the entity
            gameCtx.translate(entity.info.pos.x, entity.info.pos.y);
            gameCtx.scale(entity.scale, entity.scale);
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
    }

    function clearCanvas() {
        gameCtx.clearRect(0, 0, gameWidth, gameHeight);
    }

    currentGame = GameService.loadGame(self.gameName).done(function(response) {
        self.gameLoaded = true;
        gameInfo = response.info;
        allMaps = gameInfo.maps;
        self.currentMap = allMaps[0];
        self.allRows = self.currentMap.scenes;
        self.currentRow = self.allRows[0];
        self.currentScene = self.currentRow[0];
        background = self.currentScene.background;
        objects = self.currentScene.objects;
        loadEntities();
        // Expected location of events
        // events = self.currentScene.events;
        events = {
          typing: [
            {
              words: [ ['look'], ['window'] ],
              response: [
                {
                  type: 'text',
                  value: 'The window looks out to the very small back yard.'
                }
              ]
            },
            {
              words: [ ['look'] ],
              response: [
                {
                  type: 'text',
                  value: "You are standing in Uncle Vernon's and Aunt Petunia's kitchen."
                }
              ]
            }
          ]
        };
        drawEntities('background');
        drawObjects('background');
        drawBackground();
        startPos = {    // Eventually will come from game object
          map: 1,
          row: 0,
          column: 0,
          x: 100,
          y: 250
        };
        $scope.$apply();
    });

    function loadMainCharacter() {
        UserService.getPlayerAvatar().done(function(playerAvatar) {
          avatar = new Avatar(playerAvatar);
          avatar.info.pos.x = startPos.x;
          avatar.info.pos.y = startPos.y;
          avatar.info.currentFrame = avatar.info.animate.walkLeft[0];
          avatarLoaded = true;
          fullPlayer.avatar = avatar;
          socket.emit('game joined', fullPlayer);
          setInterval(checkAvatarAction, 75);
        });
    }


    this.startGame = function() {
        // Tell the server that I joined this game
        fullPlayer.id = playerInfo.id;
        fullPlayer.game = self.gameName;
        self.currentScenePos = [startPos.map, startPos.row, startPos.column];
        fullPlayer.scenePos = self.currentScenePos;
        updateLocation();
        loadMainCharacter();
        self.gameStarted = true;
    };

    function runGame() {
      // Any loading animation would happen here
      // Play button and appears when game is loaded and disappears when clicked
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
                drawAvatar(avatar);
                drawAllPlayers();
                drawEntities('foreground');
                drawObjects('foreground');
                drawBackground();
            }
        }
        requestAnimationFrame(runGame);
    }
    requestAnimationFrame(runGame);

  // Socket functionality
  // Get my own information
  socket.off('self info');
  socket.on('self info', function(id) {
    fullPlayer.socketId = id;
  });

  // Notify me in the chat window that another player joined the game.
  socket.off('new player');
  socket.on('new player', function(playerBasic) {
    var msg = "Player " + playerBasic.id + ' is playing ' + playerBasic.game;
    $('.chat-messages').append($('<li>').text(msg));
  });

  socket.off('draw new player');
  socket.on('draw new player', function(newPlayer) {
    allPlayers.push(newPlayer);
    var response = {
      data: fullPlayer,
      dest: newPlayer.socketId
    };
    socket.emit('draw old player', response);
  });

  socket.off('draw old player');
  socket.on('draw old player', function(oldPlayer) {
    console.log("Old player received!");
    allPlayers.push(oldPlayer);
  });

  socket.off('update player');
  socket.on('update player', function(player) {
    for (var index = 0; index < allPlayers.length; index++) {
      if (allPlayers[index].id === player.id) {
        allPlayers[index] = player;
      }
    }
  });

  // When I submit a chat message, send it to the server along with the game I'm playing
  $('.chat-submit').submit(function(){
    var msgInfo = {
      msg: playerInfo.id + ': ' + $('.message').val(),
      gameName: self.gameName
    };
    socket.emit('chat message', msgInfo);
    $('.message').val('');
    return false;   // Prevent default page refresh
  });

  // When a message has been received, display it on the screen
  socket.off('chat message');
  socket.on('chat message', function(msg){
    $('.chat-messages').append($('<li>').text(msg));
  });

  // Notify me if a player leaves the game
  socket.off('player left');
  socket.on('player left', function(leavingPlayer) {
    console.log("Player " + leavingPlayer.id + " left!");
    var msg = "Player " + leavingPlayer.id + ' left ' + leavingPlayer.game;
    $('.chat-messages').append($('<li>').text(msg));
  });

  // Let others know that I left the game if the controller ceases (closing browser, etc)
  $scope.$on("$destroy", function(){
    var leavingPlayer = {
      id: playerInfo.id,
      game: self.gameName
    };
    socket.emit('game left', leavingPlayer);
  });
});
