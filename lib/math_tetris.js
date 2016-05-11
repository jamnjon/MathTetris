var Game = require("./game");
var GameView = require("./gameView");

document.addEventListener("DOMContentLoaded", function(){
  var canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  var ctx = canvasEl.getContext("2d");
  var game = new Game();
  canvasEl.addEventListener('click', function(event){
    game.handleClick(event);
  }, false);
  new GameView(game, ctx).start();
});


// var BinaryToDec = function(num){
//   var numString = num.toString();
//   var sum = 0;
//   var pow = 0;
//   while(numString.length > 0){
//     var curNum = numString[numString.length - 1];
//     if(parseInt(curNum)){
//       sum+= Math.pow(2,pow);
//     }
//     pow++;
//     numString = numString.slice(0,numString.length - 1);
//   }
//   return sum;
// };
