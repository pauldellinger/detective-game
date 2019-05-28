
var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");
var dx = 5;
var dy = 10;
var rightPressed = false;
var leftPressed = false;
var xbound = window.innerWidth;
var ybound = window.innerHeight;
var cx = xbound/2;
var cy = ybound/4;
var y2 = window.innerHeight;
var y3 = ybound;
var heights = [];
var i;
var j;
var pos = [];
var obstacleCount = 10;
var lives = 3;


var windowheights=[];
var windowpositions=[];
var windowheight = 0;
var position = 20;
for (i=0;i<12; i++){
  if (i%3===0&&i!=0){
    windowheight+= ybound/4+20;
    position = 20;
  }
  windowheights[i] = windowheight;
  windowpositions[i] = position;
  position+=80;

}
var windowheight = 0;
var position = 4*xbound/5+20;
for (i=12;i<24; i++){
  if (i%3===0&&i!=12){
    windowheight+= ybound/4+20;
    position =4*xbound/5+20;
  }
  windowheights[i] = windowheight;
  windowpositions[i] = position;
  position+=80;
}
function resetObstacles(){
  var height = ybound+500;
  for (i = 0; i < obstacleCount; i++) {
    heights[i] = height;
    height+=100;
    var min= xbound/5+30;
    var max=4*xbound/5-30;
    var random =Math.floor(Math.random() * (+max - +min)) + +min;
    pos[i] = random;
  }
  var rightPressed = false;
  var leftPressed = false;
  var cx = xbound/2;
  var cy = ybound/4;
  drawObstacles();
  drawCarmen();

}
resetObstacles();


function draw(){
  drawBackground();
  //drawBackground();
  drawCarmen();
//Draw Square

  if(rightPressed && cx < 4*xbound/5-20) {
    cx += 7;
  }
  else if(leftPressed && cx > xbound/5+2) {
    cx -= 7;
  }
  drawObstacles();
  if (collisionDetection()){
    lives --;
    collide();
    cx = xbound/2;

  }
  requestAnimationFrame(draw);
  }draw();
function collide(){
  ctx.globalAlpha=1;
  alpha = ctx.globalAlpha;
  impactx= cx;
  impacty =cy;
  var j;
  var k;
  dartxes =[];
  dartys=[];
  for (j=1; j<10;j+=2){
    ctx.fillStyle = "red";
    k = j;
    impactx = cx-5*k;
    while (k!=0){
      ctx.fillRect(impactx,impacty,5,5);
      dartxes[j]=impactx;
      dartys[j]=impacty;
      impactx +=10;
      k--;
      alpha-=0.2;
    }
    impactx=cx;
    impacty-=5;

  }


  //cx = xbound/2;
}
function drawBackground(){
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.fillRect(0,0, xbound,ybound);

  ctx.fillStyle = "#0A1322";
  ctx.fillRect(0,0, xbound/5,ybound);
  ctx.fillRect(4*xbound/5,0, xbound,ybound);

  var grd = ctx.createLinearGradient(0,1.5*ybound, 0, 0);
  grd.addColorStop(0, "#3B67BF");
  grd.addColorStop(1, "transparent");
  ctx.fillStyle = grd;
  ctx.fillRect(xbound/5,0, 3*xbound/5,ybound);


  for (i = 0; i < 24; i++) {
    if (windowheights[i]+80<0){
      windowheights[i] = ybound;
    }
    ctx.fillStyle = "#F6F7FB";
    ctx.globalAlpha = 0.6;
    ctx.fillRect(windowpositions[i],windowheights[i], 50,80);
    ctx.fillStyle = "#37375B";
    ctx.fillRect(windowpositions[i],windowheights[i]-10, 50,10);
    ctx.fillRect(windowpositions[i]-10,windowheights[i],10,80);
    ctx.fillRect(windowpositions[i]+50,windowheights[i],10,80);
    ctx.fillRect(windowpositions[i],windowheights[i]+80,50,10);
    ctx.globalAlpha = 1;
    windowheights[i]-=dy;

  }



  ctx.closePath();

}

function collisionDetection(){
  for (i =0; i<obstacleCount; i++){
    var x = pos[i];
    var y = heights[i];
    if (cx<x+30 &&cx>x && cy<y+30 &&cy>y){
      return true;
    }
  }
}
function drawCarmen(){
  ctx.beginPath();
  ctx.fillStyle = "green";
  ctx.fillRect(cx,cy,20,20);
  ctx.closePath();
}
function drawObstacles(){
  var i;
  for (i = 0; i < obstacleCount; i++) {
    if (heights[i]<0){
      var min= xbound/5;
      var max=4*xbound/5-30;
      var random =Math.floor(Math.random() * (+max - +min)) + +min;
      pos[i] = random;
      heights[i] = ybound;
    }
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(pos[i], heights[i], 30,30);
    ctx.closePath();
    heights[i]-=dy;
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}
