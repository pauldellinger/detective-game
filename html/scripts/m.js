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

var g = 1;
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
  if((this.y+this.height+this.yvel)>ground){
    this.y = ground-this.height;
    this.yvel=0;
  }
  else{
    this.y +=this.yvel; //update y based on yvel
  }
  if(this.y+this.height<ground){
    this.yvel+=g;
  }
  if(upPressed&& this.y+this.height ==ground){
      this.yvel-=15;
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


function Missile(sprite){
  this.x = 0;
  this.y = 0;
  this.speed = 3;
  this.type = "red";
  this.direction = Math.atan2(sprite.y+50-this.y, sprite.x+50-this.x);
  this.height = 100;
  this.width =100;
  this.splatter=[];
  this.update = function(sprite){
    this.x += this.speed * Math.cos(this.direction);
    this.y += this.speed * Math.sign(this.direction);
    this.direction = Math.atan2(sprite.y+50-this.y, sprite.x+50-this.x);
    //if (collision(sprite,this))
  };
  this.render = function(){
    var img = document.getElementById(this.type);
    this.displaySplatter;
    ctx.save();
    ctx.translate(this.x+90, this.y+20);
    ctx.rotate(this.direction);
    ctx.translate(-1*(this.x+50), -1*(this.y+50));
    ctx.drawImage(img, this.x, this.y, 100, 100);
    ctx.restore();

  };
};
Missile.prototype.explode = function(){
  this.splatter =[];
  var max_vel = 20;
  var max_rad = this.height * 0.2;
  for (var i = 0; i < getRandom(50, 100); i++) {
    x = this.x + getRandom(-this.width, this.width);
    y = this.y + getRandom(-this.height, this.height);
    xvel  = max_vel * Math.sin(getRandom(-Math.PI, Math.PI));
    yvel =  max_vel * Math.sin(getRandom(-Math.PI, Math.PI));
    dir = Math.atan(yvel/xvel);
    speed = Math.sqrt(yvel*yvel + xvel*xvel);

    p = new Particle(x, y, getRandom(0,Math.PI), getRandom(-max_vel, max_vel), getRandom(5, max_rad*2), 50, getRandom(0.85, 0.90), getRandom(0.97, 0.992), 'red');
    //p = new Particle(0, 0, 0, 0, 0, 0, 0, 0, 0);
    this.splatter.push(p);
    //q = new Particle(x, y, getRandom(0,Math.PI), getRandom(-max_vel, max_vel), getRandom(5, max_rad), 50, getRandom(0.96, 0.99), getRandom(0.97, 0.992), '#ffffff');
    // /this.splatter.push(q);
    r = new Particle(x, y, getRandom(0,Math.PI), getRandom(-max_vel, max_vel), getRandom(5, max_rad), 50, getRandom(0.85, 0.90), getRandom(0.97, 0.992), 'orange');
    this.splatter.push(r);
    s = new Particle(x, y, getRandom(0,Math.PI), getRandom(-max_vel, max_vel), getRandom(5, max_rad), 50, getRandom(0.85, 0.90), getRandom(0.97, 0.992), 'yellow');
    this.splatter.push(s);
  }
};
function Particle(x, y, dir, speed, rad, min_rad, scale_speed, drag, fill) {
	this.x = x;
  this.y =y;
  this.direction = 0;
  this.speed = 3;
  this.wander =1;
  this.rad = rad;
  this.scale = 1;
  this.scale_speed = scale_speed;
  this.drag = drag;
  this.min_rad = min_rad;
  this.fill = fill;
  this.update = function(){
    this.scale *= this.scale_speed;
    this.speed *= this.drag;
    this.x += this.speed * Math.cos(this.direction);
    this.y += this.speed * Math.sign(this.direction);
    this.direction += (Math.random() * 2 - 1) * this.wander;

  };
};
Missile.prototype.displaySplatter = function() {
  /*
  ctx.beginPath();
  ctx.arc(this.x, this.y,this.splatter.length, 0, Math.PI * 2);
  ctx.fill();
  */

	ctx.globalCompositeOperation ='screen';

	for (var i = 0; i < this.splatter.length; i++) {
		var particle = this.splatter[i];

		ctx.fillStyle = particle.fill;

		ctx.beginPath();
		ctx.arc(particle.x, particle.y, particle.rad * particle.scale, 0, Math.PI * 2);
    //ctx.arc(this.x, this.y,5, 0, Math.PI * 2);
		ctx.fill();
    particle.update();
    if(particle.rad*this.scale<30) this.splatter.splice(i, 1);

	}
	ctx.globalCompositeOperation = 'source-over';


};

izzy = new Sprite();
test = new Missile(izzy);
function draw(){
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, xbound, ybound);

  izzy.render();
  izzy.update();
  test.render();
  test.update(izzy);



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
    if(e.key ==38||e.key == "ArrowUp") {
        upPressed = true;
    }
    else if(e.key ==40||e.key == "ArrowDown") {
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
    if(e.key ==38|| e.key == "ArrowUp") {
        upPressed = false;
    }
    else if(e.key ==40 ||e.key == "ArrowDown") {
        downPressed = false;
    }
    else if(e.key == "a") {
        leftPressed = false;
    }
    else if(e.key == "d") {
        rightPressed = false;
    }


}
