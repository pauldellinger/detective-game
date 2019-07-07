var c = document.getElementById("myCanvas");
var resizeScale = 1080/window.innerHeight;
var ctx = c.getContext("2d");
var xbound = window.innerWidth;
var ybound = window.innerHeight;
var count = 0;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, xbound, ybound);
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

var g = 1;
var ground = ybound;
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
};
//a = ge
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
  this.x = getRandom(0, xbound);
  this.y = 0;
  this.speed = 5;
  this.type = "red";
  this.direction = Math.atan2(sprite.y-this.y, sprite.x-this.x);
  this.height = 25;
  this.width =50;
  this.splatter=[];
  this.xvel =0;
  this.yvel = 0;
  this.turn = .5;
  this.max = 10;
  this.update = function(sprite){
    if(!this.blown){
    dx=(sprite.x-50)- this.x;
    dy=(sprite.y+50)-this.y;
    distance = Math.sqrt(dx*dx+dy*dy); //get distance to target
    dx/=distance;
    dy/=distance; //baby vectors in the right proportion

    this.xvel+=dx*this.turn; //multiply vector by turning speed
    this.yvel+=dy*this.turn;

    velocity=Math.sqrt((this.xvel*this.xvel)+(this.yvel*this.yvel)); //magnitude speed

    if (velocity>this.max) //cap at max speed
    {
    	this.xvel=(this.xvel*this.max)/velocity;
    	this.yvel=(this.yvel*this.max)/velocity;
    }

    this.direction = Math.atan2(this.yvel,this.xvel);

    this.x += this.xvel;
    this.y +=this.yvel;

    /*
    this.x += this.speed * Math.cos(this.direction);
    this.y += this.speed * Math.sign(this.direction);
    this.direction = Math.atan2((sprite.y+20)-(this.y-this.height), (sprite.x)-(this.x-this.width));
    */
    if ((collision(sprite,this)||this.y-20>ground)  &&!this.blown){
      this.explode();
      test.push(new Missile(izzy));

    }
    }
  };
  this.render = function(){
    var img = document.getElementById(this.type);
    ctx.save();
    ctx.translate(this.x+100, this.y+25);
    ctx.rotate(this.direction);
    ctx.translate(-1*(this.x+100), -1*(this.y+25));
    this.displaySplatter();
    ctx.restore();
    if (!this.blown){
    ctx.save();
    ctx.translate(this.x+100, this.y+25);
    ctx.rotate(this.direction);
    ctx.translate(-1*(this.x+100), -1*(this.y+25));
    ctx.drawImage(img, this.x, this.y, 100, 100);
    this.displaySplatter();
    ctx.restore();
  }

  };
};
Missile.prototype.explode = function(){
  this.blown =true;
  this.splatter =[];
  var max_vel = 10;
  var max_rad = this.height * 0.3;
  for (var i = 0; i < getRandom(50, 100); i++) {
    x = this.x + getRandom(-this.width, this.width);
    y = this.y + getRandom(-this.height, this.height);
    xvel  = max_vel * Math.sin(getRandom(-Math.PI, Math.PI));
    yvel =  max_vel * Math.sin(getRandom(-Math.PI, Math.PI));
    dir = Math.atan(yvel/xvel);
    speed = Math.sqrt(yvel*yvel + xvel*xvel);

    p = new Particle(x, y, getRandom(-Math.PI,Math.PI), getRandom(-max_vel, max_vel), getRandom(5, max_rad*2), 50, getRandom(0.85, 0.95), getRandom(0.97, 0.992), 'red');
    //p = new Particle(0, 0, 0, 0, 0, 0, 0, 0, 0);
    this.splatter.push(p);
    //q = new Particle(x, y, getRandom(0,Math.PI), getRandom(-max_vel, max_vel), getRandom(5, max_rad), 50, getRandom(0.96, 0.99), getRandom(0.97, 0.992), '#ffffff');
    // /this.splatter.push(q);
    r = new Particle(x, y, getRandom(-Math.PI,Math.PI), getRandom(-max_vel, max_vel), getRandom(5, max_rad), 50, getRandom(0.85, 0.95), getRandom(0.97, 0.992), 'orange');
    this.splatter.push(r);
    s = new Particle(x, y, getRandom(-Math.PI,Math.PI), getRandom(-max_vel, max_vel), getRandom(5, max_rad), 50, getRandom(0.85, 0.95), getRandom(0.97, 0.992), 'yellow');
    this.splatter.push(s);
  }
};
function Particle(x, y, dir, speed, rad, min_rad, scale_speed, drag, fill) {
	this.x = x;
  this.y =y;
  this.direction =dir;
  this.speed = speed;
  this.wander =.5;
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

	//ctx.globalCompositeOperation ='screen';

	for (var i = 0; i < this.splatter.length; i++) {
		var particle = this.splatter[i];

		ctx.fillStyle = particle.fill;

		ctx.beginPath();
		ctx.arc(particle.x, particle.y, particle.rad * particle.scale, 0, Math.PI * 2);
    //ctx.arc(this.x, this.y,5, 0, Math.PI * 2);
		ctx.fill();
    particle.update();
    if((particle.rad*particle.scale)<.001){
      this.splatter.splice(i, 1);
      count ++;
    }

	}

	ctx.globalCompositeOperation = 'source-over';


};

function Background(layer, sprite){
  this.layer = layer;
  this.x = 0;
  this.img = "layer"+layer;
  this.update = function(){
    this.x = sprite.x;
  };
  this.render = function(){
    var img = document.getElementById(this.img);
    ctx.drawImage(img, this.x/(15/this.layer),0, 1280 ,720, 0,0, 1280, 720);
  };
}


izzy = new Sprite();
test = [];

i=1;
while (i--){
  test.push(new Missile(izzy));
}
layer1 = new Background(1, izzy);
layer2 = new Background(2, izzy);
function draw(){
  ctx.fillStyle = "white";
  //ctx.fillRect(0, 0, xbound, ybound);
  ground = window.innerHeight;

  layer1.update();
  layer1.render();
  //layer2.update();
  //layer2.render();
  izzy.render();
  izzy.update();
  for (i=0; i<test.length;i++){
    test[i].render();
    test[i].update(izzy);
    if (test[i].splatter.length ==1){
      test.splice(i,1);
    }

    ctx.font = "16px Iceberg";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("missiles active: "+test.length, xbound/2, 20);
    ctx.fillText("particles removed: "+ground, xbound/3, 20);
  }




  requestAnimationFrame(draw);

}draw();
//draw();

function collision(sprite, missile){
  if (sprite.x+50 < missile.x + missile.width &&
   sprite.x + sprite.width> missile.x &&
   sprite.y+80 < missile.y + missile.height &&
   sprite.y + sprite.height > missile.y ){
     return true;
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
function reportWindowSize() {
  ybound = window.innerHeight;
  xbound = window.innerWidth;
  ground = window.innerHeight;
  izzy.y = ground;
  if (window.innerWidth/window.innerHeight === 16/9){
    resizeScale = 1080/ window.innerHeight;
  }


}

window.onresize = reportWindowSize;
