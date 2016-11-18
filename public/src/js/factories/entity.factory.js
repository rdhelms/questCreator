angular.module('questCreator').factory('Entity', function() {
  function Entity(entityInfo) {
    this.name = entityInfo.name;
    this.obj = entityInfo.obj;
    this.game_id = entityInfo.game_id;
    this.action = 'walkRight';
  };

  Entity.prototype.updatePos = function() {
    this.obj.pos.x += this.obj.speed.x;
    this.obj.pos.y += this.obj.speed.y;
  }

  Entity.prototype.stop = function() {
    this.action = 'stand';
    this.obj.speed.x = 0;
    this.obj.speed.y = 0;
  }

  Entity.prototype.collide = function(direction) {
    this.stop();
    switch (direction) {
      case 'left':
        this.obj.pos.x += this.obj.speed.mag;
        break;
      case 'right':
        this.obj.pos.x -= this.obj.speed.mag;
        break;
      case 'up':
        this.obj.pos.y += this.obj.speed.mag;
        break;
      case 'down':
        this.obj.pos.y -= this.obj.speed.mag;
        break;
    }
  }

  return Entity;
});
