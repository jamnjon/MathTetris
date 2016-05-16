var Block = function(num, idx){
  this.height = 98;
  this.width = 123;
  this.color = Block.COLORS[Math.floor(Math.random() * Block.COLORS.length)];
  this.pos = [Math.floor(Math.random() * 8) * 125,97];
  this.maxHeight = 600;
  this.num = num;
  this.highlighted = false;
  this.idx = idx;
};

Block.COLORS = ["#FF0000", "#FF00E0", "#2C9C96", "#00FF00", "#0000FF"];

Block.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;

  ctx.beginPath();
  ctx.rect(
    this.pos[0], this.pos[1],this.width, this.height);
  ctx.fill();
  if(this.highlighted){
    ctx.lineWidth = 5;
    ctx.stroke();
  }


  ctx.font="30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(this.num, this.pos[0] + 55, this.pos[1] + 50);

};

Block.prototype.highlight = function () {
  if(this.highlighted){
    this.highlighted = false;
  } else{
    this.highlighted = true;
  }
};

Block.prototype.isCollidedWith = function (otherBlock) {
  if(otherBlock.pos[0] === this.pos[0]){
    if(this.pos[1] + 100 === otherBlock.pos[1]){
      return true;
    }
  }
  return false;
};

Block.prototype.collideWith = function (otherBlock) {
    this.maxHeight = otherBlock.pos[1] - 2;
  // }
};

Block.prototype.unCollideWith = function () {
  this.maxHeight = 600;
};

Block.prototype.move = function () {
  if(this.pos[1] < this.maxHeight - this.height){
    this.pos[1] += 1;
  }
};

module.exports = Block;
