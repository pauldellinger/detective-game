var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var xbound = window.innerWidth;
var ybound = window.innerHeight;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, xbound, ybound);
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

var g = 9.8;
var ground = ybound;
function Sprite(){
  this.x = xbound/2;
  this.y = ybound/2;
  this.width = 100;
  this.height = 100;
  this.xvel = 0;
  this.yvel = 0;
  this.drag = 0.1;
  this.frame = 0;
  this.step = 0;
  this.flip = false;
}
Sprite.prototype.update = function(){
  this.step ++;
  if (this.step>13-Math.abs(this.xvel)){
    this.step =0;
    if(!this.flip){
      this.frame++;
      if (this.frame>17) this.frame =0;
    }
    if(this.flip){
       this.frame--;
       if (this.frame<0) this.frame =17;
    }
    if (Math.round(100*this.xvel)/100 ==0)this.frame = 3;
  }
  this.x +=this.xvel;
  if(!(rightPressed ||leftPressed))this.xvel*=this.drag;
  if((this.y+this.yvel)>ground){
    this.y = ground-this.height;
    this.yvel=0;
  }
  else{
    this.y +=this.yvel; //update y based on yvel
  }
  if(this.y+this.height<ground){
    this.yvel +=g; //gravity
  }
  if(upPressed){
      this.yvel-=20;
    }

  if(rightPressed){
    if (this.xvel<10)this.xvel +=1.3;
  }
  if(leftPressed){
    if (this.xvel>-10)this.xvel -=1.3;
  }


};
Sprite.prototype.render = function(){
    var img = document.getElementById("running");
    ctx.save();
    if (this.xvel>=0)this.flip = false;
    else {
      this.flip =true;
      //ctx.translate(xbound, 0);
      //ctx.scale(-1, 1);
    }
    if (this.flip) var offset =1;
    else var offset =0;
    ctx.drawImage(img, 100*this.frame, 100*offset,100,100, this.x, this.y, this.width, this.height);
    ctx.restore();

};

izzy = new Sprite();
function draw(){
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, xbound, ybound);
  izzy.render();
  izzy.update();



  requestAnimationFrame(draw);

}draw();
//draw();


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    if(e.key ==38) {
        upPressed = true;
    }
    else if(e.key ==40) {
        downPressed = true;
    }
    else if(e.key == "a") {
        leftPressed = true;
    }
    else if(e.key == "d") {
        rightPressed = true;
    }

}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    if(e.key ==38) {
        upPressed = false;
    }
    else if(e.key ==40) {
        downPressed = false;
    }
    else if(e.key == "a") {
        leftPressed = false;
    }
    else if(e.key == "d") {
        rightPressed = false;
    }


}
