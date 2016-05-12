var Question = function(){
var operations = ['add', 'subtract', 'multiply', 'divide', 'binary'];
this.operation = operations[Math.floor(Math.random()*4)];
this.firstNum = this.generateFirstNum();
this.secondNum = this.generateSecondNum();
};

Question.prototype.generateFirstNum = function () {
  if(this.operation === 'binary'){
    
  }
  if(this.operation !== 'multiply'){
    return Math.floor(Math.random() * 200 + 1);
  } else {
    return Math.floor(Math.random() * 20);
  }
};

Question.prototype.generateSecondNum = function () {
  if(this.operation === 'multiply'){
    return Math.floor(Math.random() * 20);
  } else if(this.operation === 'subtract'){
    var secNum = 250;
    while(secNum > this.firstNum){
      secNum = Math.floor(Math.random() * 200);
    }
    return secNum;
  } else if(this.operation === 'add'){
    return Math.floor(Math.random() * 200);
  } else if(this.operation === 'binary'){

  }else{
    var denoms = this.findDenoms();
    return denoms[Math.floor(Math.random() * denoms.length)];
  }
};

Question.prototype.findDenoms = function () {
  var denoms = [];
  for(var i = 1; i <= this.firstNum; i++){
    if (this.firstNum % i === 0){
      denoms.push(i);
    }
  }
  return denoms;
};

Question.prototype.draw = function (ctx, Game) {
  var question = "";
  if(this.operation === 'multiply'){
    var op = ' x ';
  } else if(this.operation === 'add'){
    op = ' + ';
  } else if(this.operation === 'subtract'){
    op = ' - ';
  } else{
    op = ' / ';
  }
  question += this.firstNum + op + this.secondNum + " = ";
  ctx.fillStyle = "#000000";
  ctx.fillRect(0,0,Game.DIM_X, 100);
  ctx.font="30px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(question, 450, 60);
};


module.exports = Question;
