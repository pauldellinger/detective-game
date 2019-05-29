
var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");
var dx = 5;
var dy = 11.5;
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
var step = 0;
var carmenStatus= 0;

var endgame = false;
var ky = ybound +200;

var windowheights=[];
var windowpositions=[];
var windowheight = 0;
var position = xbound/5/10;
for (i=0;i<12; i++){
  if (i%3===0&&i!=0){
    windowheight+= ybound/4+20;
    position = xbound/5/10;
  }
  windowheights[i] = windowheight;
  windowpositions[i] = position;
  position+= 3*xbound/5/10;

}
var windowheight = 0;
var position = 4*xbound/5+xbound/5/10;
for (i=12;i<24; i++){
  if (i%3===0&&i!=12){
    windowheight+= ybound/4+20;
    position = 4*xbound/5+xbound/5/10;
  }


  
  windowheights[i] = windowheight;
  windowpositions[i] = position;
  position+= 3*xbound/5/10;
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
  //ctx.clearRect(0, 0, xbound, ybound);
  drawBackground();

  if (step>4){
    if (carmenStatus===2){
      carmenStatus=0;
    }
    else{
      carmenStatus ++;
    }
    step=0;
  }
  step++;
  drawCarmen();

//Draw Square
  //drawKiller();
  if(rightPressed && cx < 4*xbound/5-20) {
    cx += 7;
  }
  else if(leftPressed && cx > xbound/5+2) {
    cx -= 7;
  }
  /*
  else if(upPressed && cy > 0) {
    cy -= 7;
  }
  else if(upPressed && cy < ybound) {
    cy += 7;
  }
  */
  drawObstacles();
  if (collisionDetection()){
    lives --;
    var temp = dy;

    collide();

    cx = xbound/2;

  }

  if (dy<12&&dy>4.9&&performance.now()<10000){
    dy+=.001;
  }

  if (dy>12){
    endgame = true;
    if (drawKiller()){
      ending_sequence();
    }
  }

  /*
  if (performance.now()>10000 && dy>0.1){
    dy-=.1;

  }
  if (dy<=.1){
    endgame = true;
  }
  if (endgame){
    dy = 0;

    // /drawKiller();
  }
  */


  drawSpeed();
  requestAnimationFrame(draw);
}draw();
function drawSpeed(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+dy, xbound/2, 20);
    ctx.fillText("Time: "+performance.now(), xbound/2-200, 20);
    ctx.fillText("killer height: "+xbound/5, xbound/5, 20);

}
function drawKiller(){
  kx = 3*xbound/5;
  ctx.fillStyle = "green";
  ctx.fillRect(kx,ky,50,50);
  if (ky>ybound/4){
    ky-=1;
  }
  if(kx<cx+25&&kx+30>cx&&ky<cy+50&&ky+30>cy){
    return true;
  }
}
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

  var grd = ctx.createLinearGradient(0,0, 0, 1.5*ybound);
  grd.addColorStop(0, "#3B67BF");
  grd.addColorStop(1, "transparent");
  ctx.fillStyle = grd;
  ctx.fillRect(xbound/5,0, 3*xbound/5,ybound);


  for (i = 0; i < 24; i++) {
    if (windowheights[i]+80<0){
      windowheights[i] = ybound;
    }
    if (i%5===0){
      var img = document.getElementById("window_lit");
      ctx.drawImage(img, windowpositions[i], windowheights[i], 80, 100);
      /*
      ctx.fillStyle = "#FFEE93";
      ctx.globalAlpha = 0.6;
      ctx.fillRect(windowpositions[i],windowheights[i], 50,80);
      */
    }
    else{
    var img = document.getElementById("window_unlit");
    ctx.drawImage(img, windowpositions[i], windowheights[i], 80, 100);

    /*
    ctx.fillStyle = "#F6F7FB";
    ctx.globalAlpha = 0.6;
    ctx.fillRect(windowpositions[i],windowheights[i], 50,80);
    }
    ctx.fillStyle = "#37375B";
    ctx.fillRect(windowpositions[i],windowheights[i]-10, 50,10);
    ctx.fillRect(windowpositions[i]-10,windowheights[i],10,80);
    ctx.fillRect(windowpositions[i]+50,windowheights[i],10,80);
    ctx.fillRect(windowpositions[i],windowheights[i]+80,50,10);
    ctx.globalAlpha = 1;
    */
  }
    windowheights[i]-=dy;
  }



  ctx.closePath();

}




function collisionDetection(){
  for (i =0; i<obstacleCount; i++){
    var x = pos[i];
    var y = heights[i];
    if (x<cx+25&&x+30>cx&&y<cy+50&&y+30>cy){
      return true;
    }
  }
}

function drawCarmen(){



  var img = document.getElementById("isabella");

  if (carmenStatus==0){
    ctx.drawImage(img, 0,0,100,100, cx, cy, 80, 80);

  }
  else if(carmenStatus==1){
    ctx.drawImage(img, 0,100,100,100, cx, cy, 80, 80);
  }
  else if(carmenStatus==2){
    ctx.drawImage(img, 0,200,100,100, cx, cy, 80, 80);

  }

};

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
    /*
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(pos[i], heights[i], 30,30);
    ctx.closePath();
    */
    var img = document.getElementById("obstacle");
    ctx.drawImage(img, pos[i],heights[i], 30, 30);
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
    /*
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = true;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = true;
    }
    */
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    /*
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
    else if(e.key == "Down" || e.key == "ArrowDown") {
        downPressed = false;
    }
    */
}
