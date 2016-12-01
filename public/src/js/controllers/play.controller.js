angular.module('questCreator').controller('playCtrl', function(socket, Avatar, Background, SceneObject, Entity, UserService, EditorService, GameService, $state, $scope, PopupService, StorageService) {
  var self = this;
  UserService.checkLogin().then(function(response) {
    var socketDelay = 50;
    var socketIterator = 0;
    var fullPlayer = {
      id: null,
      game: null,
      scenePos: null,
      avatar: null,
      socketId: null
    };
    var playerUpdate = {
      id: null,
      game: null,
      scenePos: null,
      socketId: null
    };
    var allPlayers = [];
    var playerInfo = {
        id: UserService.get().id,
    };
    var gameCanvas = document.getElementById('play-canvas');
    var gameCtx = gameCanvas.getContext('2d');
    var gameWidth = 700;
    var gameHeight = 500;
    self.warning = '';
    self.typing = {
        show: false,
        phrase: ''
    };
    self.responding = {
        show: false,
        phrase: ''
    };
    self.showingInventory = false;
    var pause = false;

    var avatar = null;
    var background = null;
    var objects = null;
    var entities = null;
    var events = null;

    var avatarLoaded = false;
    var entitiesLoaded = false;

    self.gameName = StorageService.getPlayingGame() || GameService.getGameDetail().name || 'harry potter quest';
    var gameInfo = null;
    var startPos = null;
    var allMaps = null;
    var currentGame = null;
    self.currentMap = null;
    self.allRows = null;
    self.currentRow = null;
    self.currentScene = null;
    self.currentScenePos = [0, 0, 0];
    self.gameLoaded = false;
    self.allSavedGames = StorageService.getSavedGames(self.gameName) || [];
    self.saveInfo = {
      game: '',
      name: '',
      score: 0,
      time: 0,
      inventory: [],
      achievements: [],
      scenePos: [1, 0, 0],
      pos: {
        x: 350,
        y: 250
      }
    };
    self.startTime = new Date();
    self.timeDiff = 0;
    self.displayTime = '';

    self.gameStarted = false;

    self.saveGame = function() {
      self.saveInfo.time = self.timeDiff;
      self.saveInfo.pos = avatar.info.pos;
      var newSave = angular.copy(self.saveInfo);
      self.allSavedGames.push(newSave);
      StorageService.setSavedGames(self.gameName, self.allSavedGames);
      // Call to POST save game to database here
      self.saveInfo.name = '';
    };

    self.restoreGame = function(savedGame) {
      self.saveInfo = angular.copy(savedGame);
      self.startTime = Date.now() - (angular.copy(savedGame.time) * 1000);
      self.currentScenePos = angular.copy(savedGame.scenePos);
      updateLocation();
      avatar.info.pos = angular.copy(savedGame.pos);
    };

    $('body').off('keyup').on('keyup', function(event) {
            var keyCode = event.which;
            if (keyCode === 8) {
              // Backspace
              if (self.typing.phrase.length > 1) {
                self.typing.phrase = self.typing.phrase.substring(0, self.typing.phrase.length - 1);
              } else {
                self.typing.phrase = '';
                self.typing.show = false;
              }
            }
            if (keyCode === 27) {
              // Escape
              if ( $('.option.active').length === 0 ) {
                $('.fileOption').addClass('active');
                $('.save').addClass('active');
                self.pause = true;
              } else {
                $('.option.active').removeClass('active');
                $('.save').removeClass('active');
                self.pause = false;
                runGame();
              }
            }
            if (keyCode === 37) {
                if (self.pause && $('.fileOption.active').length === 0) {
                  $('.option.active').toggleClass('active').prev('.option').toggleClass('active');
                }
                if (!self.pause) {
                  avatar.action = (avatar.action === 'walkLeft') ? 'stand' : 'walkLeft';
                  playerUpdate = {
                    id: angular.copy(fullPlayer.id),
                    game: angular.copy(fullPlayer.game),
                    scenePos: angular.copy(fullPlayer.scenePos),
                    socketId: angular.copy(fullPlayer.socketId),
                    action: angular.copy(avatar.action),
                    pos: angular.copy(avatar.info.pos)
                  };
                  socket.emit('update player', playerUpdate);
                }
            } else if (keyCode === 38) {
                if (self.pause && $('.fileOption.active').length === 1 && $('.save.active').length === 0) {
                   $('.fileOptions li.active').toggleClass('active').prev('li').toggleClass('active');
                }
                if (!self.pause) {
                  avatar.action = (avatar.action === 'walkUp') ? 'stand' : 'walkUp';
                  playerUpdate = {
                    id: angular.copy(fullPlayer.id),
                    game: angular.copy(fullPlayer.game),
                    scenePos: angular.copy(fullPlayer.scenePos),
                    socketId: angular.copy(fullPlayer.socketId),
                    action: angular.copy(avatar.action),
                    pos: angular.copy(avatar.info.pos)
                  };
                  socket.emit('update player', playerUpdate);
                }
            } else if (keyCode === 39) {
                if (self.pause && $('.timeOption.active').length === 0) {
                  $('.option.active').toggleClass('active').next('.option').toggleClass('active');
                }
                if (!self.pause) {
                  avatar.action = (avatar.action === 'walkRight') ? 'stand' : 'walkRight';
                  playerUpdate = {
                    id: angular.copy(fullPlayer.id),
                    game: angular.copy(fullPlayer.game),
                    scenePos: angular.copy(fullPlayer.scenePos),
                    socketId: angular.copy(fullPlayer.socketId),
                    action: angular.copy(avatar.action),
                    pos: angular.copy(avatar.info.pos)
                  };
                  socket.emit('update player', playerUpdate);
                }
            } else if (keyCode === 40) {
                if (self.pause && $('.fileOption.active').length === 1 && $('.restore.active').length === 0) {
                  $('.fileOptions li.active').toggleClass('active').next('li').toggleClass('active');
                }
                if (!self.pause) {
                  avatar.action = (avatar.action === 'walkDown') ? 'stand' : 'walkDown';
                  playerUpdate = {
                    id: angular.copy(fullPlayer.id),
                    game: angular.copy(fullPlayer.game),
                    scenePos: angular.copy(fullPlayer.scenePos),
                    socketId: angular.copy(fullPlayer.socketId),
                    action: angular.copy(avatar.action),
                    pos: angular.copy(avatar.info.pos)
                  };
                  socket.emit('update player', playerUpdate);
                }
            } else if (keyCode === 191) {
              // Forward slash
              if (!self.pause && !self.typing.show && !self.responding.show  && $('.active').length === 0 && !$(".message").is(":focus")) {
                self.pause = true;
                self.showingInventory = true;
              }
            }
        });

    $('body').off('keypress').on('keypress', function(event) {
            var keyCode = event.which;
            if (self.typing.show && keyCode >= 32 && keyCode <= 220 && !self.responding.show && $('.active').length === 0) {
                pause = true;
                var char = String.fromCharCode(keyCode);
                self.typing.phrase += char;
            } else if (keyCode === 13) {
                // Enter
                if (self.typing.show) { // If the user is finishing typing
                    self.typing.show = false;
                    var userPhrase = self.typing.phrase;
                    self.typing.phrase = '';
                    checkTypingEvents(userPhrase);
                } else if (self.responding.show) { // If the user is finished reading a response
                    self.responding.show = false;
                    self.responding.phrase = '';
                } else if (self.showingInventory) { // If the user is finished looking at inventory
                    self.showingInventory = false;
                } else if ($('.invOption.active').length === 1) {
                  self.showingInventory = true;
                  $('.option.active').removeClass('active');
                  runGame(); // once
                } else if ($('.save.active').length === 1) {
                  self.savingGame = true;
                  $('.fileOption').removeClass('active');
                  $('.save.active').removeClass('active');
                  runGame(); // once
                } else if ($('.restore.active').length === 1) {
                  self.restoringGame = true;
                  $('.fileOption').removeClass('active');
                  $('.restore.active').removeClass('active');
                  runGame(); // once
                }
                if (!self.responding.show && !self.showingInventory && $('.active').length === 0) { // Resume the game if all windows have been closed
                    self.pause = false;
                    runGame();
                }
            } else if (keyCode === 32 && !$(".message").is(":focus") && !self.savingGame && !self.restoringGame && !self.showingInventory && !self.typing.show) {
                self.typing.phrase = ':';
                self.typing.show = true;
            }
        });

    function checkTypingEvents(phrase) {
      phrase = phrase.toLowerCase();
      var foundEvent = false; // Whether a typing event has already been triggered
      if (events) {
        events.forEach(function(event) { // Loop through all the typing events
          if (event.category === 'text') {
            var typingEvent = event.info;
            if (!foundEvent) {  // Only continue checking as long as another event has already not been triggered
              var requirementsMet = true;   // Assume that the requirements will be met
              if (typingEvent.requirements.achievements) {
                typingEvent.requirements.achievements.forEach(function(achievement) {  // Loop through all the achievement requirements
                  if (self.saveInfo.achievements.indexOf(achievement) === -1) { // If an achievement is required, check the player's past achievements
                    requirementsMet = false;  // Requirements fail if achievement is not present
                  }
                });
              }
              if (typingEvent.requirements.inventory) {
                typingEvent.requirements.inventory.forEach(function(item) {  // Loop through all the inventory requirements
                  if (self.saveInfo.inventory.indexOf(item) === -1) { // If an inventory item is required, check the player's inventory
                    requirementsMet = false;  // Requirements fail if inventory does not contain necessary item
                  }
                });
              }
              if (requirementsMet) {  // If all the requirements have been met, check the event's triggers
                var triggerSatisfied = true;  // Assume that the trigger conditions will be met
                typingEvent.triggers.forEach(function(wordSet) { // Loop through the sets of words to check
                    var possibleMatch = false;  // Assume that each wordset does not satisfy the requirements
                    wordSet.forEach(function(word) {  // Loop through all the words in the wordSet
                      word = word.toLowerCase();
                      if ( phrase.includes(word) ) {  // If the user typed one of the words in the wordSet, it's a possible match
                        possibleMatch = true;
                      }
                    });
                    if (!possibleMatch) { // If the the entire wordSet was passed through without finding a match, then the entire trigger fails
                      triggerSatisfied = false;
                      self.responding.phrase = 'I have literally no idea what you just said.';  // If the trigger failed, set the response to a standard default
                      self.responding.show = true;
                      self.pause = true;
                    }
                });
                if (triggerSatisfied) {
                  foundEvent = true;
                  typingEvent.results.text.forEach(function(textResult) {
                      self.responding.phrase = textResult;
                      self.responding.show = true;
                      self.pause = true;
                  });
                  typingEvent.results.inventory.forEach(function(inventoryItem) {
                      self.saveInfo.inventory.push(inventoryItem);
                  });
                  typingEvent.results.achievements.forEach(function(achievement) {
                      self.saveInfo.achievements.push(achievement.name);
                      self.saveInfo.score += achievement.points;
                  });
                  if (typingEvent.results.portal.scenePos) {
                      var location = typingEvent.results.portal;
                      self.currentScenePos = angular.copy(location.scenePos);
                      updateLocation();
                      avatar.info.pos = angular.copy(location.pos);
                  }
                }
              }
            }
          }
        });
      } else {
        self.responding.phrase = 'I have literally no idea what you just said.';
        self.responding.show = true;
        self.pause = true;
      }
    }

    function checkLocationEvents(avatarBounds) {
      var foundEvent = false; // Whether a typing event has already been triggered
      if (events) {
        events.forEach(function(event) { // Loop through all the typing events
          if (event.category === 'location') {
            locationEvent = event.info;
            if (!foundEvent) {  // Only continue checking as long as another event has already not been triggered
              var requirementsMet = true;   // Assume that the requirements will be met
              locationEvent.requirements.forEach(function(requirement) {  // Loop through all the requirements
                if (requirement.type === 'achievement' && self.saveInfo.achievements.indexOf(requirement.value) === -1) { // If an achievement is required, check the player's past achievements
                  requirementsMet = false;  // Requirements fail if achievement is not present
                } else if (requirement.type === 'inventory' && self.saveInfo.inventory.indexOf(requirement.value) === -1) { // If an inventory item is required, check the player's inventory
                  requirementsMet = false;  // Requirements fail if inventory does not contain necessary item
                }
              });
              if (requirementsMet) {  // If all the requirements have been met, check the event's triggers
                var triggerSatisfied = false;  // Assume that the trigger conditions will not be met
                locationEvent.triggers.forEach(function(bounds) {  // Compare the avatar's bounds with the locationEvent's trigger bounds
                  if (avatarBounds.left <= bounds.right && avatarBounds.right >= bounds.left && avatarBounds.top <= bounds.bottom && avatarBounds.bottom >= bounds.top) {
                    triggerSatisfied = true;
                  }
                });
                if (triggerSatisfied) {
                  foundEvent = true;
                  locationEvent.results.text.forEach(function(textResult) {
                      self.responding.phrase = textResult;
                      self.responding.show = true;
                      self.pause = true;
                  });
                  locationEvent.results.inventory.forEach(function(inventoryItem) {
                      self.saveInfo.inventory.push(inventoryItem);
                  });
                  locationEvent.results.achievements.forEach(function(achievement) {
                      self.saveInfo.achievements.push(achievement.name);
                      self.saveInfo.score += achievement.points;
                  });
                  if (locationEvent.results.portal.scenePos) {
                      var location = locationEvent.results.portal;
                      self.currentScenePos = angular.copy(location.scenePos);
                      updateLocation();
                      avatar.info.pos = angular.copy(location.pos);
                  }
                }
              }
            }
          }
        });
      }
    }

    function checkAvatarBounds() {
      if (avatar.info.currentFrame.collisionMap[0]) {
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
        checkLocationEvents(avatar.bounds);
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
                    var entLeft = (entSquare.x + entity.info.pos.x) * entity.scale;
                    var entRight = (entSquare.x + entSquare.width + entity.info.pos.x) * entity.scale;
                    var entTop = (entSquare.y + entity.info.pos.y) * entity.scale;
                    var entBottom = (entSquare.y + entSquare.height + entity.info.pos.y) * entity.scale;
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
            switch (collision.type) {
                case 'wall':
                    avatar.collide(collision.direction);
                    playerUpdate = {
                      id: angular.copy(fullPlayer.id),
                      game: angular.copy(fullPlayer.game),
                      scenePos: angular.copy(fullPlayer.scenePos),
                      socketId: angular.copy(fullPlayer.socketId),
                      action: angular.copy(avatar.action),
                      pos: angular.copy(avatar.info.pos)
                    };
                    socket.emit('update player', playerUpdate);
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
        self.saveInfo.scenePos = self.currentScenePos;
        fullPlayer.scenePos = self.currentScenePos;
        self.currentMap = allMaps[self.currentScenePos[0]];
        self.allRows = self.currentMap.scenes;
        self.currentRow = self.allRows[self.currentScenePos[1]];
        self.currentScene = self.currentRow[self.currentScenePos[2]];
        playerUpdate = {
          id: angular.copy(fullPlayer.id),
          game: angular.copy(fullPlayer.game),
          scenePos: angular.copy(fullPlayer.scenePos),
          socketId: angular.copy(fullPlayer.socketId),
          action: angular.copy(avatar.action),
          pos: angular.copy(avatar.info.pos)
        };
        socket.emit('update player', playerUpdate);
        background = self.currentScene.background;
        events = self.currentScene.events;
        objects = self.currentScene.objects;
        loadEntities();
    }

    function loadEntities() {
      entities = [];
      var oldEntities = angular.copy(self.currentScene.entities);
      oldEntities.forEach(function(entity) {
        var newEntity = new Entity(entity);
        entities.push(newEntity);
      });
      entitiesLoaded = true;
    }

    function updateAvatar() {
      avatar.updatePos();
      fullPlayer.avatar = avatar;
      playerUpdate = {
        id: angular.copy(fullPlayer.id),
        game: angular.copy(fullPlayer.game),
        scenePos: angular.copy(fullPlayer.scenePos),
        socketId: angular.copy(fullPlayer.socketId),
        action: angular.copy(avatar.action),
        pos: angular.copy(avatar.info.pos)
      };
      if (socketIterator > socketDelay) {
        socket.emit('update player', playerUpdate);
        socketIterator = 0;
      }
      socketIterator++;
    }

    function updateEntities() {
      entities.forEach(function(entity) {
        entity.updatePos();
      });
    }

    function drawAvatar(avatarToDraw) {
        avatarToDraw.checkAction();
        // Save the drawing context
        gameCtx.save();
        // Translate the canvas origin to be the top left of the avatarToDraw
        gameCtx.translate(avatarToDraw.info.pos.x, avatarToDraw.info.pos.y);
        gameCtx.scale(avatarToDraw.scale, avatarToDraw.scale);
        // Draw the squares from the avatarToDraw's current frame
        avatarToDraw.info.currentFrame.image.forEach(function(square) {
            gameCtx.fillStyle = square.color;
            gameCtx.fillRect(square.x, square.y, square.width, square.height);
        });
        gameCtx.globalAlpha = 0.2;
        // Draw the avatarToDraw's collision map (purely for testing)
        // if (avatarToDraw.info.currentFrame.collisionMap.length > 0) {
        //   avatarToDraw.info.currentFrame.collisionMap.forEach(function(square) {
        //       gameCtx.fillStyle = square.color;
        //       gameCtx.fillRect(square.x, square.y, square.width, square.height);
        //   });
        // }
        gameCtx.restore();
    }

    function drawAllPlayers() {
      allPlayers.forEach(function(player) {
        // player.avatar.updatePos();
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
            // background.info.collisionMap.forEach(function(square) {
            //     gameCtx.fillStyle = square.color;
            //     gameCtx.fillRect(square.x, square.y, square.width, square.height);
            // });
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
        objects.forEach(function(object) {

            // Save the drawing context
            gameCtx.save();
            // Translate the canvas origin to be the top left of the object
            gameCtx.translate(object.info.pos.x, object.info.pos.y);
            if (object.bounds) {
              if ( (avatar.bounds.top > object.bounds.bottom && type === 'background') || (avatar.bounds.top < object.bounds.bottom && type === 'foreground') ) {
                // Draw the squares from the object's current frame
                object.info.image.forEach(function(square) {
                    gameCtx.fillStyle = square.color;
                    gameCtx.fillRect(square.x, square.y, square.width, square.height);
                });
                gameCtx.globalAlpha = 0.2;
                // Draw the object's collision map (purely for testing)
                // object.info.collisionMap.forEach(function(square) {
                //     gameCtx.fillStyle = square.color;
                //     gameCtx.fillRect(square.x, square.y, square.width, square.height);
                // });
              }
            } else if (type === 'background'){
              // Draw the squares from the object's current frame
              object.info.image.forEach(function(square) {
                  gameCtx.fillStyle = square.color;
                  gameCtx.fillRect(square.x, square.y, square.width, square.height);
              });
              gameCtx.globalAlpha = 0.2;
              // Draw the object's collision map (purely for testing)
              // object.info.collisionMap.forEach(function(square) {
              //     gameCtx.fillStyle = square.color;
              //     gameCtx.fillRect(square.x, square.y, square.width, square.height);
              // });
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
            if (entity.bounds) {
              if ( (avatar.bounds.top > entity.bounds.bottom && type === 'background') || (avatar.bounds.top < entity.bounds.bottom && type === 'foreground') ) {
                // Draw the squares from the entity's current frame
                entity.info.currentFrame.image.forEach(function(square) {
                    gameCtx.fillStyle = square.color;
                    gameCtx.fillRect(square.x, square.y, square.width, square.height);
                });
                gameCtx.globalAlpha = 0.2;
                // Draw the entity's collision map (purely for testing)
                // entity.info.currentFrame.collisionMap.forEach(function(square) {
                //     gameCtx.fillStyle = square.color;
                //     gameCtx.fillRect(square.x, square.y, square.width, square.height);
                // });
              }
            } else if (type === 'background'){
              // Draw the squares from the entity's current frame
              entity.info.currentFrame.image.forEach(function(square) {
                  gameCtx.fillStyle = square.color;
                  gameCtx.fillRect(square.x, square.y, square.width, square.height);
              });
              gameCtx.globalAlpha = 0.2;
              // Draw the entity's collision map (purely for testing)
              // entity.info.currentFrame.collisionMap.forEach(function(square) {
              //     gameCtx.fillStyle = square.color;
              //     gameCtx.fillRect(square.x, square.y, square.width, square.height);
              // });
            }
            gameCtx.restore();
        });
      }
    }

    function clearCanvas() {
        gameCtx.clearRect(0, 0, gameWidth, gameHeight);
    }

    function updateTime() {
      var currentTime = new Date();
      self.timeDiff = Math.floor( (currentTime - self.startTime) / 1000 );
      // var self.timeDiff = Math.floor( (currentTime - self.startTime) ); // to test higher times
      var numSeconds = self.timeDiff % 60;
      var numMinutes = Math.floor(self.timeDiff / 60) % 60;
      var numHours = Math.floor(self.timeDiff / 3600);
      // Formatting zeros
      numSeconds = (numSeconds < 10) ? '0'+numSeconds : numSeconds;
      numMinutes = (numMinutes < 10) ? '0'+numMinutes : numMinutes;
      numHours = (numHours < 10) ? '0'+numHours : numHours;
      self.displayTime = numHours + ":" + numMinutes + ":" + numSeconds;
    }

    $scope.assetsToLoad = 0;
    $scope.assetsLoaded = 0;
    PopupService.open('loading-screen', $scope);
    currentGame = GameService.loadGame(self.gameName).done(function(response) {
      // console.log(response);
      response.info.maps.forEach(function(map) {
        map.scenes.forEach(function(row) {
          row.forEach(function(scene) {
            if (scene.background) {
              $scope.assetsToLoad++;
              var backgroundId = scene.background.id;
              // console.log(scene.background.info);
              EditorService.getAssetInfo(backgroundId, 'backgrounds').done(function(info) {  // Get each background's info from the database
                  scene.background.info = info;
                  // console.log("Found background info!", scene.background.info);
                  $scope.assetsLoaded++;
                  $scope.$apply();
              });
            }
            if (scene.entities) {
              $scope.assetsToLoad += scene.entities.length;
              scene.entities.forEach(function(entity) {
                var entityId = entity.id;
                // console.log(entity.info);
                EditorService.getAssetInfo(entityId, 'entities').done(function(info) {  // Get each entity's info from the database
                    entity.info.animate = info.animate;
                    // console.log("Found entity info!", entity.info);
                    $scope.assetsLoaded++;
                    $scope.$apply();
                });
              });
            }
            if (scene.objects) {
              $scope.assetsToLoad += scene.objects.length;
              scene.objects.forEach(function(object) {
                var objectId = object.id;
                // console.log(object.info);
                EditorService.getAssetInfo(objectId, 'objects').done(function(info) {  // Get each object's info from the database
                    object.info.collisionMap = info.collisionMap;
                    object.info.image = info.image;
                    // console.log("Found object info!", object.info);
                    $scope.assetsLoaded++;
                    $scope.$apply();
                });
              });
            }
          });
        });
      });

      var checkGameLoadLoop = setInterval(function() {
        // console.log("Loading " + $scope.assetsToLoad + " assets.");
        // console.log($scope.assetsLoaded + " assets loaded.");
        var finishedLoading = false;
        if ($scope.assetsLoaded >= $scope.assetsToLoad) {
          finishedLoading = true;
        }
        if (finishedLoading) {
          clearInterval(checkGameLoadLoop);
          PopupService.close();
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
          events = self.currentScene.events;
          drawEntities('background');
          drawObjects('background');
          drawBackground();
          startPos = {    // Eventually will come from game object
            map: 1,
            row: 0,
            column: 0,
            x: 300,
            y: 250
          };
          $scope.$apply();
        }
      }, 200);
    });

    function loadMainCharacter() {
        UserService.getPlayerAvatar().done(function(playerAvatar) {
          avatar = new Avatar(playerAvatar);
          avatar.info.pos.x = startPos.x;
          avatar.info.pos.y = startPos.y;
          avatar.info.currentFrame = avatar.info.animate.walkLeft[0];
          avatarLoaded = true;
          fullPlayer.avatar = avatar;
          updateLocation();
          initSocket();
          socket.emit('game joined', fullPlayer);
        });
    }

    self.startGame = function() {
        // Tell the server that I joined this game
        fullPlayer.id = playerInfo.id;
        fullPlayer.game = self.gameName;
        self.currentScenePos = [startPos.map, startPos.row, startPos.column];
        fullPlayer.scenePos = self.currentScenePos;
        loadMainCharacter();
        self.startTime = new Date();
        self.gameStarted = true;
    };

    function runGame() {
      // Any loading animation would happen here
      // Play button and appears when game is loaded and disappears when clicked
        if (self.gameStarted) {
            clearCanvas();
            if (avatarLoaded) {
                updateTime();
                updateAvatar();
                checkAvatarBounds();
                checkAvatarCollisions();
                updateEntities();
                checkEntityCollisions();
                drawEntities('background');
                drawObjects('background');
                drawAvatar(avatar);
                drawAllPlayers();
                drawEntities('foreground');
                drawObjects('foreground');
                drawBackground();
            }
        }
        if (!self.pause) {
          requestAnimationFrame(runGame);
        }
    }
    requestAnimationFrame(runGame);


    function initSocket() {
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
        newPlayer.avatar = new Avatar(newPlayer.avatar);
        allPlayers.push(newPlayer);
        var response = {
          data: fullPlayer,
          dest: newPlayer.socketId
        };
        socket.emit('draw old player', response);
      });

      socket.off('draw old player');
      socket.on('draw old player', function(oldPlayer) {
        oldPlayer.avatar = new Avatar(oldPlayer.avatar);
        allPlayers.push(oldPlayer);
      });

      socket.off('update player');
      socket.on('update player', function(playerUpdate) {
        // playerUpdate = {
        //   id: angular.copy(fullPlayer.id),
        //   game: angular.copy(fullPlayer.game),
        //   scenePos: angular.copy(fullPlayer.scenePos),
        //   socketId: angular.copy(fullPlayer.socketId),
        //   action: avatar.action
        // };
        for (var index = 0; index < allPlayers.length; index++) {
          if (allPlayers[index].id === playerUpdate.id) {
            allPlayers[index].avatar.action = angular.copy(playerUpdate.action);
            allPlayers[index].scenePos = angular.copy(playerUpdate.scenePos);
            allPlayers[index].avatar.info.pos = angular.copy(playerUpdate.pos);
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
        var msg = "Player " + leavingPlayer.id + ' left ' + leavingPlayer.game;
        $('.chat-messages').append($('<li>').text(msg));
        var indexToRemove = null;
        for (var index = 0; index < allPlayers.length; index++) {
          if (allPlayers[index].id === leavingPlayer.id) {
            indexToRemove = index;
          }
        }
        if (indexToRemove !== null) {
          allPlayers.splice(indexToRemove, 1);
        }
      });

      // Let others know that I left the game if the controller ceases (closing browser, etc)
      $scope.$on("$destroy", function(){
        var leavingPlayer = {
          id: playerInfo.id,
          game: self.gameName
        };
        socket.emit('game left', leavingPlayer);
      });
    }
    $scope.$apply();
  });
});
