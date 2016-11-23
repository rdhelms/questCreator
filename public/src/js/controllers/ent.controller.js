angular.module('questCreator').controller('entCtrl', function($state, $scope, EditorService) {
  var self = this;      // To help with scope issues
  var drawHandle = -1;  // Interval handle for drawing rate
  var moveHandle = -1;  // Interval handle for movement of mouse (possibly does not need to be global)
  var mouseX = 0;
  var mouseY = 0;
  var mouseMoveEvent;       // Global variable to track mouse movement events
  var touchMoveEvent;       // Global variable to track touch movement events
  var mobileWidth = 850;    // Width for mobile screen sizes
  var tabletWidth = 1100;   // Width for tablet screen sizes
  var tabletScale = 1.4;
  var mobileScaleX = 2.5;
  var mobileScaleY = 1.6;
  var moveType = '';    // Either mouse or touch
  var moved = false;    // Whether mouse has moved or not
  var moving = {        // Direction that the main character should be moving.
    left: false,
    right: false,
    up: false,
    down: false
  };
  var drawing = {       // Type of object being drawn. Default: background.
    // mobile: false,
    // static: false,
    background: true
  };
  var pixelWidth = $scope.editor.currentPixelSize;
  var pixelHeight = $scope.editor.currentPixelSize;
  var undoBackgroundArray = [];   //Array to keep track of background objects that were undone.
  var undoCollisionArray = [];
  // var undoObstacleArray = [];   //Array to keep track of obstacle objects that were undone.
  // var undoCharacterArray = [];   //Array to keep track of character objects that were undone.
  this.speedRange = 5;     // How fast mobile objects should move.
  // this.radiusRange = 5;  // Value of radius input in draw.html
  // this.widthRangeBackground = 50;   // Value of width input in draw.html
  // this.heightRangeBackground = 50;  // Value of height input in draw.html
  // this.widthRangeObstacle = 50;     // Value of width input in draw.html
  // this.heightRangeObstacle = 50;    // Value of height input in draw.html
  this.currentColor = $scope.editor.currentColor;    // Value of color input in draw.html
  // this.currentScene = Scenes.fetchCurrentScene() || {}; // Scene selected from scenes controller
  // this.currentBackground = Backgrounds.fetchCurrentBackground() || {};  // Background selected from scenes controller
  this.myCanvas = document.getElementById('ent-canvas');  // Canvas html element
  this.canvasPos = {    // Canvas top and left coordinates on page
    x: self.myCanvas.getBoundingClientRect().left,
    y: self.myCanvas.getBoundingClientRect().top
  };
  this.draw = this.myCanvas.getContext('2d'); // Canvas context
  // this.sceneName =  this.currentScene.name || '';       // Current selected Scene name
  // this.allMobileCircles = this.currentScene.mobileArr || [];  // Array of all mobile objects in current scene
  // this.allObstacleSquares = this.currentScene.staticArr || [];  // Array of all static objects in current scene
  // this.backgroundName = this.currentBackground.name || '';  // Current selected Background name
  // this.allBackgroundSquares = this.currentBackground.staticArr || []; // Array of all static objects in current background
  this.allCollisionSquares = [];
  this.allBackgroundSquares = [];

  /*
  *   Rectangle object constructor
  *   @params
  *     x: horizontal coord of top left corner
  *     y: vertical coord of top left corner
  *     width: width of rectangle
  *     height: height of rectangle
  *     color: color of rectangle
  *   @methods
  *     draw: draw the rectangle on the canvas using its position, size, and color.
  */
  function Square(x, y, width, height, color, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
  }

  Square.prototype.draw = function() {
    self.draw.fillStyle = this.color;
    if (window.innerWidth <= mobileWidth) { // Mobile size
      self.draw.fillRect(this.x * mobileScaleX, this.y * mobileScaleY, this.width, this.height);
    } else if (window.innerWidth <= tabletWidth) { // Tablet size
      self.draw.fillRect(this.x * tabletScale, this.y / tabletScale, this.width, this.height);
    } else {  // Desktop size
      self.draw.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  $scope.$on('redrawEntity', function(event, imageArr, collisionArray) {
    canvasWidth = self.myCanvas.width;
    canvasHeight = self.myCanvas.height;
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    self.allBackgroundSquares = [];
    self.allCollisionSquares = [];
    var undoBackgroundArray = [];
    var undoCollisionArray = [];
    self.allBackgroundSquares = imageArr;
    self.allCollisionSquares = collisionArray;
    drawBackgroundSquares();
    drawCollisionSquares();
  });

  // /*
  // *   Circle object constructor
  // *   @params
  // *     x: horizontal coord of center of circle
  // *     y: vertical coord of center of circle
  // *     radius: radius of circle
  // *     color: color of circle
  // *   @methods
  // *     draw: draw the circle on the canvas using its position, size, and color.
  // */
  // function Circle(x, y, radius, color) {
  //   this.x = x;
  //   this.y = y;
  //   this.radius = radius;
  //   this.color = color;
  //   this.draw = function() {
  //     self.draw.beginPath();
  //     self.draw.fillStyle = this.color;
  //     if (window.innerWidth <= mobileWidth) { // Mobile size
  //       self.draw.arc(this.x * mobileScaleX, this.y * mobileScaleY, this.radius, 0, 2 * Math.PI);
  //     } else if (window.innerWidth <= tabletWidth) { // Tablet size
  //       self.draw.arc(this.x * tabletScale, this.y / tabletScale, this.radius, 0, 2 * Math.PI);
  //     } else {
  //       self.draw.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  //     }
  //     self.draw.fill();
  //     // Example for future reference: Can also draw using an image. Image should first be loaded on the page.
  //     // draw.drawImage(imgElem, this.x, this.y, this.radius, this.radius);
  //   }
  // }

  // Called when the mouse button is pressed.
  // Starts the interval to run every 100ms while the mouse button is still held down.
  // Only start the interval if it is not already running.
  function mouseDown(event) {
    if (drawHandle === -1) {
      drawHandle = setInterval(mousePressed, 100);
    }
  }

  // Called when the mouse button is released.
  // If the interval is running, then clear it and reset it.
  function mouseUp(event) {
    if (drawHandle !== -1) {
      clearInterval(drawHandle);
      drawHandle = -1;
    }
  }

  // Runs every 100ms after the mouse button is pressed until it is released.
  // Purpose is to draw the object that the user has chosen every 100ms AND if the mouse has moved from its previous location.
  function mousePressed() {
      self.canvasPos = {  // Get the most recent canvas position in case the window has been resized.
        x: self.myCanvas.getBoundingClientRect().left,
        y: self.myCanvas.getBoundingClientRect().top
      };
      // if (moved && drawing.mobile) { // Create, draw, and record a new mobile object
      //   var radius = parseInt(self.radiusRange);
      //   var color = self.currentColor;
      //   if (moveType === 'mouse') {
      //     var newCircle = new Circle(mouseMoveEvent.clientX - self.canvasPos.x, mouseMoveEvent.clientY - self.canvasPos.y, radius, color);
      //     newCircle.draw();
      //     self.allMobileCircles.push(newCircle);
      //   } else if (moveType === 'touch') {
      //     var newCircle = new Circle(touchMoveEvent.clientX - self.canvasPos.x, touchMoveEvent.clientY - self.canvasPos.y, radius, color);
      //     newCircle.draw();
      //     self.allMobileCircles.push(newCircle);
      //   }
      //   moved = false;
      // } else if (moved && drawing.static) {  // Create, draw, and record a new static object
      //   var width = parseInt(self.widthRangeObstacle);
      //   var height = parseInt(self.heightRangeObstacle);
      //   var color = self.currentColor;
      //   if (moveType === 'mouse') {
      //     var newSquare = new Square(mouseMoveEvent.clientX - width / 2 - self.canvasPos.x, mouseMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allObstacleSquares.push(newSquare);
      //   } else if (moveType === 'touch') {
      //     var newSquare = new Square(touchMoveEvent.clientX - width / 2 - self.canvasPos.x, touchMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allObstacleSquares.push(newSquare);
      //   }
      //   moved = false;
      // } else if (moved && drawing.background) { // Create, draw, and record a new background object
      //   var width = parseInt(self.widthRangeBackground);
      //   var height = parseInt(self.heightRangeBackground);
      //   var color = self.currentColor;
      //   if (moveType === 'mouse') {
      //     var newSquare = new Square(mouseMoveEvent.clientX - width / 2 - self.canvasPos.x, mouseMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allBackgroundSquares.push(newSquare);
      //   } else if (moveType === 'touch') {
      //     var newSquare = new Square(touchMoveEvent.clientX - width / 2 - self.canvasPos.x, touchMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color);
      //     newSquare.draw();
      //     self.allBackgroundSquares.push(newSquare);
      //   }
      //   moved = false;
      // }
    if ($scope.editor.erasing) {
      var newSquareX = mouseX - self.canvasPos.x;
      var newSquareY = mouseY - self.canvasPos.y;
      if (!$scope.editor.drawingCollision) {
        var toRemove = [];
        self.allBackgroundSquares.forEach(function(square) {
          if ( Math.abs(square.x - newSquareX) < 10 && Math.abs(square.y - newSquareY) < 10 ) {
            toRemove.push(self.allBackgroundSquares.indexOf(square));
          }
        });
        toRemove.forEach(function(index) {
          self.allBackgroundSquares.splice(index, 1);
        });
      } else if ($scope.editor.drawingCollision) {
        var toRemove = [];
        self.allCollisionSquares.forEach(function(square) {
          if ( Math.abs(square.x - newSquareX) < 10 && Math.abs(square.y - newSquareY) < 10 ) {
            toRemove.push(self.allBackgroundSquares.indexOf(square));
          }
        });
        toRemove.forEach(function(index) {
          self.allCollisionSquares.splice(index, 1);
        });
      }
      self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
      drawBackgroundSquares();
      drawCollisionSquares();
    }
    if (moved && drawing.background && !$scope.editor.erasing) { // Create, draw, and record a new background object
      var width = $scope.editor.currentPixelSize;
      var height = $scope.editor.currentPixelSize;
      var color = $scope.editor.drawingCollision ? 'rgba(100, 100, 100, 0.5)' : $scope.editor.currentColor;
      if (moveType === 'mouse') {
        var newSquareX = mouseX - self.canvasPos.x;
        var newSquareY = mouseY - self.canvasPos.y;
        var exists = false;
        if ($scope.editor.drawingCollision) {
          self.allCollisionSquares.forEach(function(square) {
            if (square.x === newSquareX && square.y === newSquareY) {
              exists = true;
            }
          });
        } else if (!$scope.editor.drawingCollision) {
          self.allBackgroundSquares.forEach(function(square) {
            if (square.x === newSquareX && square.y === newSquareY) {
              exists = true;
            }
          });
        }
        if (!exists) {
          var type = $scope.editor.drawingCollision ? 'collision' : 'normal';
          var newSquare = new Square(mouseX - self.canvasPos.x, mouseY - self.canvasPos.y, width, height, color, type);
          newSquare.draw();
          if ($scope.editor.drawingCollision) {
            self.allCollisionSquares.push(newSquare);
          } else {
            self.allBackgroundSquares.push(newSquare);
          }
        }
      } else if (moveType === 'touch') {
        var type = $scope.editor.drawingCollision ? 'collision' : 'normal';
        var newSquare = new Square(touchMoveEvent.clientX - width / 2 - self.canvasPos.x, touchMoveEvent.clientY - height / 2 - self.canvasPos.y, width, height, color, type);
        newSquare.draw();
        if ($scope.editor.drawingCollision) {
          self.allCollisionSquares.push(newSquare);
        } else {
          self.allBackgroundSquares.push(newSquare);
        }
      }
      moved = false;
    }
  }

  // // Check for collisions between all of the mobile objects and all of the obstacle objects.
  // // The collision is categorized according to which direction the obstacle is found.
  // function findCollisions() {
  //   var foundCollision = {  // By default, there is no collision found in any direction.
  //     left: false,
  //     right: false,
  //     up: false,
  //     down: false
  //   };
  //   self.allMobileCircles.forEach(function(circle) {  // Loop through all the mobile objects
  //     self.allObstacleSquares.forEach(function(square) {  // Loop through all the obstacle objects
  //       // Pattern: check the left, right, top, and bottom edges of the current mobile object against the right, left, bottom, and top edges of the current obstacle (in those exact orders).
  //       if (circle.x - circle.radius <= square.x + square.width && circle.x - circle.radius >= square.x && circle.y >= square.y && circle.y <= square.y + square.height) {
  //         foundCollision.left = true;
  //         moving.left = false;
  //       }
  //       if (circle.x + circle.radius <= square.x + square.width && circle.x + circle.radius >= square.x && circle.y >= square.y && circle.y <= square.y + square.height) {
  //         foundCollision.right = true;
  //         moving.right = false;
  //       }
  //       if (circle.x <= square.x + square.width && circle.x >= square.x && circle.y - circle.radius >= square.y && circle.y - circle.radius <= square.y + square.height) {
  //         foundCollision.up = true;
  //         moving.up = false;
  //       }
  //       if (circle.x <= square.x + square.width && circle.x >= square.x && circle.y + circle.radius >= square.y && circle.y + circle.radius <= square.y + square.height) {
  //         foundCollision.down = true;
  //         moving.down = false;
  //       }
  //     });
  //     // Check for collisions with the canvas border as well. Take resizing screen sizes into account.
  //     var canvasEdgeRight;
  //     var canvasEdgeBottom;
  //     if (window.innerWidth <= mobileWidth) {
  //       canvasEdgeRight = self.myCanvas.width / mobileScaleX;
  //       canvasEdgeBottom = self.myCanvas.height / mobileScaleY;
  //     } else if (window.innerWidth <= tabletWidth) {
  //       canvasEdgeRight = self.myCanvas.width / tabletScale;
  //       canvasEdgeBottom = self.myCanvas.height * tabletScale;
  //     } else {
  //       canvasEdgeRight = self.myCanvas.width;
  //       canvasEdgeBottom = self.myCanvas.height;
  //     }
  //     if (circle.x <= 0) {
  //       foundCollision.left = true;
  //       moving.left = false;
  //     }
  //     if (circle.x >= canvasEdgeRight) {
  //       foundCollision.right = true;
  //       moving.right = false;
  //     }
  //     if (circle.y <= 0) {
  //       foundCollision.up = true;
  //       moving.up = false;
  //     }
  //     if (circle.y >= canvasEdgeBottom) {
  //       foundCollision.down = true;
  //       moving.down = false;
  //     }
  //   });
  //   return foundCollision;
  // }

  // // Called when any key is pressed.
  // function handleKeyDown(event) {
  //   // If the user presses the left, right, up, or down arrow keys, toggle the movement direction accordingly
  //   if (event.keyCode === 37) { // Left Key
  //     event.preventDefault();
  //     moving = {
  //       left: !moving.left,
  //       up: false,
  //       right: false,
  //       down: false
  //     };
  //   } else if (event.keyCode === 38) { // Up Key
  //     event.preventDefault();
  //     moving = {
  //       left: false,
  //       up: !moving.up,
  //       right: false,
  //       down: false
  //     };
  //   } else if (event.keyCode === 39) { // Right Key
  //     event.preventDefault();
  //     moving = {
  //       left: false,
  //       up: false,
  //       right: !moving.right,
  //       down: false
  //     };
  //   } else if (event.keyCode === 40) { // Down Key
  //     event.preventDefault();
  //     moving = {
  //       left: false,
  //       up: false,
  //       right: false,
  //       down: !moving.down
  //     };
  //   } else {    // For all other keys, stop all movement.
  //     moving = {
  //       left: false,
  //       up: false,
  //       right: false,
  //       down: false
  //     }
  //   }
  //   // If any of the arrow keys have been pressed, run the moveMobileCircles function every 20ms.
  //   // Otherwise, stop running the moveMobileCircles function.
  //   if ( moving.left || moving.up || moving.right || moving.down ) {
  //     clearInterval(moveHandle);
  //     moveHandle = setInterval(moveMobileCircles, 20);
  //   } else {
  //     clearInterval(moveHandle);
  //   }
  // }

  // // Runs every 20ms after an arrow key has been pressed.
  // function moveMobileCircles() {
  //   // Depending on movement direction and collision detection, do the following:
  //   // 1) Clear the canvas.
  //   // 2) Redraw background and obstacle objects.
  //   // 3) Shift the circles in the corresponding direction.
  //   // 4) Redraw the circles.
  //   // Note: Checking collision detection and checking movement direction may be redundant.
  //   if (moving.left && !findCollisions().left) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.x -= parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   } else if (moving.right && !findCollisions().right) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.x += parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   } else if (moving.up && !findCollisions().up) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.y -= parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   } else if (moving.down && !findCollisions().down) {
  //     self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //     drawBackgroundSquares();
  //     drawObstacleSquares();
  //     self.allMobileCircles.forEach(function(circle) {
  //       circle.y += parseInt(self.speedRange);
  //       circle.draw();
  //     });
  //   }
  // }

  // Loop through the array of background objects and draw them all.
  function drawBackgroundSquares() {
    for (var index = 0; index < self.allBackgroundSquares.length; index++) {
      var square = self.allBackgroundSquares[index];
      self.draw.fillStyle = square.color;
      self.draw.fillRect(square.x, square.y, square.width, square.height);
    }
  }
  function drawCollisionSquares() {
    for (var index = 0; index < self.allCollisionSquares.length; index++) {
      var square = self.allCollisionSquares[index];
      self.draw.fillStyle = square.color;
      self.draw.fillRect(square.x, square.y, square.width, square.height);
    }
  }

  // // Loop through the array of obstacle objects and draw them all.
  // function drawObstacleSquares() {
  //   for (var index = 0; index < self.allObstacleSquares.length; index++) {
  //     var square = self.allObstacleSquares[index];
  //     square.draw();
  //   }
  // }

  // // Loop through the array of mobile objects and draw them all.
  // function drawMobileCircles() {
  //   for (var index = 0; index < self.allMobileCircles.length; index++) {
  //     var circle = self.allMobileCircles[index];
  //     circle.draw();
  //   }
  // }

  // // When the Draw Character button is clicked, change the drawing setting to mobile.
  // $('.characterDraw').click(function() {
  //   drawing = {
  //     mobile: true,
  //     static: false,
  //     background: false
  //   };
  //   $('.option').removeClass('active');
  //   $(this).addClass('active');
  // });

  // // When the Draw Obstacles button is clicked, change the drawing setting to static.
  // $('.objectDraw').click(function() {
  //   drawing = {
  //     mobile: false,
  //     static: true,
  //     background: false
  //   }
  //   $('.option').removeClass('active');
  //   $(this).addClass('active');
  // });

  // // When the Draw Background button is clicked, change the drawing setting to background.
  // $('.backgroundDraw').click(function() {
  //   drawing = {
  //     mobile: false,
  //     static: false,
  //     background: true
  //   }
  //   $('.option').removeClass('active');
  //   $(this).addClass('active');
  // });

  // When the user clicks the undo button, remove the last element from the object array and push it to the undo array, based on current drawing type. Then redraw canvas.
  $('#undoEntity').click(function() {
    // if (drawing.mobile && self.allMobileCircles.length > 0) {
    //   var lastObj = self.allMobileCircles.pop();
    //   undoCharacterArray.push(lastObj);
    // } else if (drawing.static && self.allObstacleSquares.length > 0) {
    //   var lastObj = self.allObstacleSquares.pop();
    //   undoObstacleArray.push(lastObj);
    // } else if (drawing.background && self.allBackgroundSquares.length > 0) {
    //   var lastObj = self.allBackgroundSquares.pop();
    //   undoBackgroundArray.push(lastObj);
    // }
    if (!$scope.editor.drawingCollision && self.allBackgroundSquares.length > 0) {
      var lastObj = self.allBackgroundSquares.pop();
      undoBackgroundArray.push(lastObj);
    } else if ($scope.editor.drawingCollision && self.allCollisionSquares.length > 0) {
      var lastObj = self.allCollisionSquares.pop();
      undoCollisionArray.push(lastObj);
    }
    self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    drawBackgroundSquares();
    drawCollisionSquares();
    // drawObstacleSquares();
    // drawMobileCircles();
  });

  // When the user clicks the redo button, remove the last element from the undo array and push it to the object array, based on current drawing type. Then redraw canvas.
  $('#redoEntity').click(function() {
    // if (drawing.mobile && undoCharacterArray.length > 0) {
    //   var lastObj = undoCharacterArray.pop();
    //   self.allMobileCircles.push(lastObj);
    // } else if (drawing.static && undoObstacleArray.length > 0) {
    //   var lastObj = undoObstacleArray.pop();
    //   self.allObstacleSquares.push(lastObj);
    // } else if (drawing.background && undoBackgroundArray.length > 0) {
    //   var lastObj = undoBackgroundArray.pop();
    //   self.allBackgroundSquares.push(lastObj);
    // }
    if (!$scope.editor.drawingCollision && undoBackgroundArray.length > 0) {
      var lastObj = undoBackgroundArray.pop();
      self.allBackgroundSquares.push(lastObj);
    } else if ($scope.editor.drawingCollision && undoCollisionArray.length > 0) {
      var lastObj = undoCollisionArray.pop();
      self.allCollisionSquares.push(lastObj);
    }
    self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    drawBackgroundSquares();
    drawCollisionSquares();
    // drawObstacleSquares();
    // drawMobileCircles();
  });

  // When the Clear Canvas button is clicked, make the current Background and current Scene empty objects and reload the view.
  // Note: may need extra testing here.
  $('#clearEntity').click(function() {
    canvasWidth = self.myCanvas.width;
    canvasHeight = self.myCanvas.height;
    // self.allObstacleSquares = [];
    // self.allMobileCircles = [];
    self.draw.clearRect(0, 0, canvasWidth, canvasHeight);
    self.allBackgroundSquares = [];
    self.allCollisionSquares = [];
    var undoBackgroundArray = [];
    var undoCollisionArray = [];
    // var undoObstacleArray = [];
    // var undoCharacterArray = [];
    // Scenes.selectScene({})
    // Backgrounds.selectBackground({});
    // $state.reload();
  });

  // // When the Save Scene button is clicked:
  // // 1) Clear the canvas and redraw only the Obstacles and Character. (ensures thumbnail is scene ONLY)
  // // 2) Create and store a new scene object and make it the current Scene.
  // // 3) Clear the canvas again and this time redraw Background, Obstacles, and Character.
  // $('.saveScene').click(function() {
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   var newScene = Scenes.create({
  //     name: self.sceneName,
  //     staticArr: self.allObstacleSquares,
  //     mobileArr: self.allMobileCircles,
  //     thumbnail: self.myCanvas.toDataURL()
  //   });
  //   Scenes.selectScene(newScene);
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawBackgroundSquares();
  //   drawObstacleSquares();
  //   drawMobileCircles();
  // });

  // // When the Publish Scene button is clicked, post it to the database.
  // $('.publishScene').click(function() {
  //   // Trying to decide whether to save AND publish or just publish...
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   var newScene = Scenes.create({
  //     name: self.sceneName,
  //     staticArr: self.allObstacleSquares,
  //     mobileArr: self.allMobileCircles,
  //     thumbnail: self.myCanvas.toDataURL()
  //   });
  //   Scenes.selectScene(newScene);
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawBackgroundSquares();
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   Scenes.publishScene(newScene);
  // });

  // When the Save Background button is clicked:
  // 1) Clear the canvas and redraw only the Background. (ensures thumbnail is background ONLY)
  // 2) Create and store a new background object and make it the current Background.
  // 3) Finally, draw the Obstacles and Character.
  $('#saveEntity').click(function() {
    EditorService.saveEntity(self.allBackgroundSquares, self.allCollisionSquares, $scope.editor.currentEntity, $scope.editor.selectedAnimation, $scope.editor.currentFrameIndex, self.myCanvas.toDataURL()).done(function(entity) {
      console.log("After save:", entity);
    });
    // self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    // drawBackgroundSquares();
    // var newBackground = Backgrounds.create({
    //   name: self.backgroundName,
    //   staticArr: self.allBackgroundSquares,
    //   thumbnail: self.myCanvas.toDataURL()
    // });
    // Backgrounds.selectBackground(newBackground);
    // drawObstacleSquares();
    // drawMobileCircles();
  });

  // Copy and Paste buttons
  $('#copyEntity').click(function() {
    EditorService.copy(self.allBackgroundSquares, self.allCollisionSquares);
  });


  $('#pasteEntity').click(function() {
    if (!$scope.editor.drawingCollision) {
      var copiedImage = EditorService.paste('image');
      self.allBackgroundSquares.push.apply(self.allBackgroundSquares, copiedImage);
    } else if ($scope.editor.drawingCollision) {
      var copiedCollisionMap = EditorService.paste('collision');
      self.allCollisionSquares.push.apply(self.allCollisionSquares, copiedCollisionMap);
    }
    self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
    drawBackgroundSquares();
    drawCollisionSquares();
  });

  // // When the Publish Background button is clicked, post it to the database.
  // $('.publishBackground').click(function() {
  //   // Trying to decide whether to save AND publish or just publish...
  //   self.draw.clearRect(0, 0, self.myCanvas.width, self.myCanvas.height);
  //   drawBackgroundSquares();
  //   var newBackground = Backgrounds.create({
  //     name: self.backgroundName,
  //     staticArr: self.allBackgroundSquares,
  //     thumbnail: self.myCanvas.toDataURL()
  //   });
  //   Backgrounds.selectBackground(newBackground);
  //   drawObstacleSquares();
  //   drawMobileCircles();
  //   Backgrounds.publishBackground(newBackground);
  // });

  // When a key is pressed, run the handleKeyDown function.
  // $(document).on('keydown', handleKeyDown);

  // When the mouse is pressed, released, moved, or leaves the canvas, run the corresponding function.
  $(self.myCanvas).on('mousedown', mouseDown);
  $(self.myCanvas).on('mouseup', mouseUp);
  $(self.myCanvas).on('mouseleave', mouseUp);
  $(self.myCanvas).on('mousemove', function(event) {
    newMouseX = Math.round((event.clientX - $scope.editor.currentPixelSize / 2) / $scope.editor.currentPixelSize) * $scope.editor.currentPixelSize;
    newMouseY = Math.round((event.clientY - $scope.editor.currentPixelSize / 2) / $scope.editor.currentPixelSize) * $scope.editor.currentPixelSize;
    if (newMouseX !== mouseX || newMouseY !== mouseY) {
      mouseX = newMouseX;
      mouseY = newMouseY;
      moveType = 'mouse';
      mouseMoveEvent = event;
      moved = true;
    }
  });

  // // Construct initial full background objects (including methods) from the retrieved partial objects.
  // // Idea - offload object methods to prototype? Possibly make this step unnecessary?
  // function constructBackgroundSquares() {
  //   var oldBackgroundSquares = self.allBackgroundSquares;
  //   var newBackgroundSquares = [];
  //   oldBackgroundSquares.forEach(function(square) {
  //     var newBackgroundSquare = new Square(square.x, square.y, square.width, square.height, square.color);
  //     newBackgroundSquares.push(newBackgroundSquare);
  //   });
  //   self.allBackgroundSquares = newBackgroundSquares;
  // }
  // // Construct mobile objects just like background objects.
  // function constructCircles() {
  //   var oldCircles = self.allMobileCircles;
  //   var newCircles = [];
  //   oldCircles.forEach(function(circle) {
  //     var newCircle = new Circle(circle.x, circle.y, circle.radius, circle.color);
  //     newCircles.push(newCircle);
  //   });
  //   self.allMobileCircles = newCircles;
  // }
  // // Construct static objects just like background and mobile objects.
  // function constructSquares() {
  //   var oldSquares = self.allObstacleSquares;
  //   var newSquares = [];
  //   oldSquares.forEach(function(square) {
  //     var newSquare = new Square(square.x, square.y, square.width, square.height, square.color);
  //     newSquares.push(newSquare);
  //   });
  //   self.allObstacleSquares = newSquares;
  // }

  // Call all object constructing functions.
  // constructBackgroundSquares();
  // constructCircles();
  // constructSquares();
  // Draw all the objects now that they have been made.
  // drawBackgroundSquares();
  // drawMobileCircles();
  // drawObstacleSquares();

  // Experimental touch screen support
  // When the mouse is pressed, released, moved, or leaves the canvas, run the corresponding function.
  $(self.myCanvas).on('touchstart', mouseDown);
  $(self.myCanvas).on('touchend', mouseUp);
  $(self.myCanvas).on('touchcancel', mouseUp);
  $(self.myCanvas).on('touchmove', function(event) {
    moveType = 'touch';
    event.preventDefault();
    touchMoveEvent = event.touches[0];
    moved = true;
  });
});
