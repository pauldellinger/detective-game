
var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");
var dx = 5;
var dy = 5;//5;
var rightPressed = false;
var leftPressed = false;
var xbound = window.innerWidth;
var ybound = window.innerHeight;
var cx = xbound/2;
var cy = ybound/4;
var dkiller = ybound/4+60000;//ybound/4+60000;
var ground = 70000;

function Obstacle(x, y, offset, step, frame, flip) {
  this.x = x;
  this.y = y;
  this.offset = offset;
  this.step = step;
  this.frame = frame;
  this.flip = flip;
  this.draw = function () {
    var img = document.getElementById("obstacle");
    ctx.drawImage(img, this.frame*100,this.offset, 90, 50, this.x,this.y, 90,50);
};
}
var obstacles = [];

var y2 = window.innerHeight;
var y3 = ybound;
var heights = [];
var ob_step = [];
var ob_frame = [];
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

    var min= xbound/5+30;
    var max=4*xbound/5-30;
    var random =Math.floor(Math.random() * (+max - +min)) + +min;
    frame = i%4;
    step = 0;
    var offset = i%3*50;
    var random_boolean = Math.random() >= 0.5;
    var flip = Math.random() >= 0.5;
    var ob = new Obstacle(random, height, offset, step, frame, flip);
    obstacles[i] = ob;
    height+=500;
  }
  var rightPressed = false;
  var leftPressed = false;
  var cx = xbound/2;
  var cy = ybound/4;
  drawObstacles();
  //drawCarmen();

}
resetObstacles();

var text1 = ybound;
var text2 = ybound-100;
var text3 = ybound+100;
function drawText(a){
  resetObstacles();
  var img1 = document.getElementById("chiara");
  var img3 = document.getElementById("malevolent");
  var img2 = document.getElementById("freefall");
  if(text1>ybound/5|| a){
  ctx.drawImage(img1, xbound/5, text1, xbound*.3, ybound/2);

  ctx.drawImage(img2, xbound/5, text2, xbound*.6, ybound);

  ctx.drawImage(img3, 2.5*xbound/5, text3, xbound*.3, ybound/2);
  text1-=5;
  text2-=5;
  text3-=5;
}
  else{
    ctx.drawImage(img1, xbound/5, text1, xbound*.3, ybound/2);

    ctx.drawImage(img2, xbound/5, text2, xbound*.6, ybound);

    ctx.drawImage(img3, 2.5*xbound/5, text3, xbound*.3, ybound/2);
  }
}
cy = ybound;
function draw(){

  //ctx.clearRect(0, 0, xbound, ybound);

  drawBackground();
  drawSpeed();
  if (text3+400>0){
    if (performance.now()>6000){
      drawText(true);
    }
    else{
      drawText(false);
    }
  }

  else{
  if (step>5){
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
  if(rightPressed && cx+40 < 4*xbound/5) {
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

  if (collisionDetection()){
    lives --;
    resetObstacles();

    collide();

    cx = xbound/2;

  }

  if (dy<12&&dy>4.9){
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

  dkiller-=dy;
  ground -=dy;
  if (dkiller<ybound+200){
    dkiller=ky;
  }
  drawSpeed();
}
  requestAnimationFrame(draw);
}draw();
function drawSpeed(){
    ctx.font = "16px Iceberg";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Speed: "+dy, xbound/2, 20);
    ctx.fillText("Time: "+performance.now(), xbound/2-200, 20);
    ctx.fillText("killer height: "+xbound, xbound/5, 20);


    ctx.fillStyle= "black";
    ctx.fillRect(4*xbound/5,4.20*ybound/5,xbound/5, ybound/5);
    var grd = ctx.createRadialGradient(4*xbound/5,4*ybound/5, 5, 4*xbound/5,4*ybound/5, 70);
    grd.addColorStop(0, "blue");
    grd.addColorStop(1, "white");
    // Fill with gradient
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    // ctx.strokeRect(4*xbound/5,4.20*ybound/5, ybound/5, ybound/5);


    ctx.font = "42px Iceberg";
    ctx.fillStyle = "Red";
    ctx.fillText(""+('000' + Math.round((dkiller-ybound/3.8125)/20)).slice(-4), 4*xbound/5+5, 4.5*ybound/5);
    ctx.font = "30px Iceberg";
    ctx.fillStyle = "Red";
    ctx.fillText(""+('m'), 4.33*xbound/5+5, 4.5*ybound/5);
    ctx.font = "24px Iceberg";
    ctx.fillStyle = "Red";
    ctx.fillText(""+('TO CATCH'), 4*xbound/5+5, 4.7*ybound/5);
    ctx.fillText(""+('THE KILLER'), 4*xbound/5+5, 4.9*ybound/5);

    ctx.font = "42px Iceberg";
    ctx.fillStyle = "Red";
    ctx.fillText(""+('000' + Math.round((ground)/20)).slice(-4), 4.5*xbound/5+5, 4.5*ybound/5);
    ctx.font = "30px Iceberg";
    ctx.fillStyle = "Red";
    ctx.fillText(""+('m'), 4.83*xbound/5+5, 4.5*ybound/5);
    ctx.font = "24px Iceberg";
    ctx.fillStyle = "Red";
    ctx.fillText(""+('TO HIT THE'), 4.5*xbound/5+5, 4.7*ybound/5);
    ctx.fillText(""+('GROUND'), 4.5*xbound/5+5, 4.9*ybound/5);
}
//you're gonna have to fill out a form
//have you considered looking for a summer internship? it's a great way to start your career
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



  var grd = ctx.createLinearGradient(0,0, 0, 1.5*ybound);
  grd.addColorStop(0, "#3B67BF");
  grd.addColorStop(1, "transparent");
  ctx.fillStyle = grd;
  ctx.fillRect(xbound/5,0, 3*xbound/5,ybound);

  drawObstacles();

  ctx.fillStyle = "#0A1322";
  ctx.fillRect(0,0, xbound/5,ybound);
  ctx.fillRect(4*xbound/5,0, xbound,ybound);


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
    var x = obstacles[i].x;
    var y = obstacles[i].y;
    if (leftPressed){
      if(x<cx+28*.8&&x+30>cx&&y<cy+80&&y+-4>cy){
        return true;
      }
    }

    else if (rightPressed){
      if(x<cx+40&&x+14>cx&&y<cy+80&&y+30>cy){
        return true;
      }
    }
    else{
      if(x<cx+40&&x+30>cx&&y<cy+80&&y+30>cy){
        return true;
      }
    }
  }
}


function drawCarmen(){

  if(cy>ybound/4){
    cy-=5;
  }
  if (rightPressed){
    var img = document.getElementById("right");
    ctx.drawImage(img, 0,0,100,100, cx, cy, 80, 80);
  }
  else if (leftPressed){
    var img = document.getElementById("left");
    ctx.drawImage(img, 0,0,100,100, cx, cy, 80, 80);
  }
  else{
  var img = document.getElementById("isabella");

  if (carmenStatus==0){
    ctx.drawImage(img, 0,0,100,100, cx, cy, 80, 80);

  }
  else if(carmenStatus==1){
    ctx.drawImage(img, 0,200,100,100, cx, cy, 80, 80);
  }
  else if(carmenStatus==2){
    ctx.drawImage(img, 0,400,100,100, cx, cy, 80, 80);

  }
}

};

function drawObstacles(){
  var i;
  for (i = 0; i < obstacleCount; i++) {
    var ob = obstacles[i];
    if (obstacles[i].y+500<0){
      var min= xbound/5;
      var max=4*xbound/5-90;
      var random =Math.floor(Math.random() * (+max - +min)) + +min;
      obstacles[i].x= random;
      obstacles[i].y = ybound;

    }
    if (obstacles[i].step ===3){
      obstacles[i].frame +=1;
      obstacles[i].step=0;
    }
    if(obstacles[i].frame>4){
      obstacles[i].frame=0;
    }
    else{
      obstacles[i].step+=1;
    }
<<<<<<< HEAD
    /*
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(pos[i], heights[i], 30,30);
    ctx.closePath();
    */
=======
>>>>>>> a246f7462af5a42ed56267b37fb9d24724f687e3

    var img = document.getElementById("obstacle");
    if (obstacles[i].flip==1){

    ctx.drawImage(img, obstacles[i].frame*100,obstacles[i].offset+150, 90, 40, obstacles[i].x,obstacles[i].y, 90*1.25,50*1.25);
    obstacles[i].x +=.5;

    }
    //ctx.drawImage(img, obstacles[i].frame*100,obstacles[i].offset, 90, 40, obstacles[i].x,obstacles[i].y, 90*1.25,50*1.25);
    else{
      ctx.drawImage(img, obstacles[i].frame*100,obstacles[i].offset, 90, 40, obstacles[i].x,obstacles[i].y, 90*1.25,50*1.25);
      obstacles[i].x -=.5;
    }
    obstacles[i].y-=dy;


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
