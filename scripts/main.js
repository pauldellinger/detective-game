//var soundtrack = new Audio('music/soundtrack.mp3');
var canvas = document.getElementById("c");
var ctx = canvas.getContext("2d");
var dx = 5;
var dy = 0;//5;
var rightPressed = false;
var leftPressed = false;
var xbound = window.innerWidth;
var ybound = window.innerHeight;
var cx = xbound/2;
var cy = ybound/4;
var dkiller = ybound/4+60001;//ybound/4+60000;
var ground = 70000;
var collision = false;
var max_speed = 0;
var terminal = ybound/60;
var alerts = [];
var alertOffset = 3;
var invulnerable = true;
var noNew =false;
var pause = false;
function getRandom(min, max) {
  return Math.random() * (max - min) + min;
};
//a = getRandom(3,5);

function Carmen(){
  this.x = xbound/2;
  this.y = ybound;
  this.xvel = 0;
  this.yvel = 0;
  this.sidestep = 0;
  this.frame =0;
  this.drag = 0.9;
  if (ybound<=720){
  this.res = ybound/720;
  }
  else{
    this.res = ybound/1080;
  }
  this.width = 80*this.res;
  this.height = 80*this.res;

  this.resize = function(){
    if (ybound<=720){
    this.res = ybound/720;
    }
    else{
      this.res = ybound/1080;
    }
    this.width = 80*this.res;
    this.height = 80*this.res;
  };
  this.draw = function(){
    if(this.y>ybound/4){
      this.y-=5;
      //resetObstacles();
      invulnerable = true;
      if(this.y<ybound+50){
        // /dy=temp;
        resetObstacles();


      }
      if(this.frame ==1) return;
    }
    else if (!cheat){
      invulnerable = false;
    }
    if (deaths==3) return;


    var img = document.getElementById("isabella");
    if(this.sidestep<0) offset = 100;
    if(this.sidestep>0) offset = 300;
    if(this.sidestep<-3) offset = 0;
    if(this.sidestep>3) offset =400;
    if (this.sidestep==0){
       offset = 200;


      if (this.frame==0){
        ctx.drawImage(img, offset,100*this.frame,100,100, this.x, this.y, this.width, this.height);

      }
      else if(this.frame==1){
        ctx.drawImage(img, offset,100*this.frame,100,100, this.x, this.y, this.width, this.height);
      }
      else if(this.frame==2){
        ctx.drawImage(img, offset,100*this.frame,100,100, this.x, this.y, this.width, this.height);

      }
    }
    else{
    ctx.drawImage(img, offset,0,100,100, this.x, this.y, this.width, this.height);
    }
  };
  this.update = function(){
    if ((this.x+this.xvel)+40 < 4*xbound/5&& (this.x+this.xvel) > xbound/5+2){
    this.x +=this.xvel;
    }
    this.xvel *= this.drag;
    if (step>5){
      if (izzy.frame===2){
        izzy.frame=0;
      }
      else{
        izzy.frame ++;
      }
      step=0;
    }
    step++;


  //Draw Square
    //drawKiller();
    if(rightPressed && izzy.x+40 < 4*xbound/5&&!(rightPressed&&leftPressed)) {
      izzy.sidestep++;
      if (izzy.sidestep>4)izzy.sidestep=4;
      izzy.xvel+=xbound/1280;
    }
    else if(leftPressed && izzy.x > xbound/5+2&&!(rightPressed&&leftPressed)) {
      izzy.sidestep--;
      if (izzy.sidestep<-4)izzy.sidestep=-4;
      izzy.xvel -= xbound/1280;
    }
    else{
      if(izzy.sidestep>0) izzy.sidestep--;
      if(izzy.sidestep<0)izzy.sidestep++;
    }
  };

}



function Alert(type){
  this.y = ybound/8;
  if (type == "life") this.y *=.5;
  this.x = xbound/5-450;
  this.type = type;
  //this.text = text;
  //this.offset =0;
  this.scroll = true;
  if (type == "altitude")this.offset = alertOffset *100;
  if (type == "life") this.offset = 500 +100*deaths;



  this.draw = function (){
    if (this.scroll){
      //resetObstacles();
      var img = document.getElementById("alerts");
      ctx.drawImage(img, 0,this.offset, 700, 95, this.x, this.y, 700, 95);

    }
    };
  this.update = function(){
    if (this.x<4*xbound/5){
       this.x+= 5;
    }
    else{
      this.scroll=false;
      if (deaths==3)window.location.reload(false);
    }
  };

};
function Obstacle(x, y, offset, step, frame, flip) {
  this.x = x;
  this.y = y;
  if (ybound<=720){
  this.res = ybound/720;
  }
  else{
    this.res = ybound/1080;
  }
  this.width = 90*this.res;
  this.height = 50*this.res;
  this.offset = offset;
  this.step = step;
  this.frame = frame;
  this.flip = flip;
  this.splatter = [];
  this.yvel = dy;
  this.colliding = false;


  if (flip) this.xvel=.5;
  if(!flip) this.xvel =-.5;
  this.resize = function(){
    if (ybound<=720){
    this.res = ybound/720;
    }
    else{
      this.res = ybound/1080;
    }
    this.width = 90*this.res;
    this.height = 50*this.res;
  };
  this.draw = function () {
    var img = document.getElementById("obstacle");
    ctx.drawImage(img, this.frame*100,this.offset, 90, 50, this.x,this.y, 90,50);
};

};
Obstacle.prototype.explode = function() {
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




Obstacle.prototype.displaySplatter = function(ctx) {
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
var deaths = -2;
var step = 0;
var carmenStatus= 0;

var endgame = false;
var ky = ybound +200;

function Window(x,y){
  this.x = x;
  this.y = y;
  if (Math.random() >= 0.9) this.lit = true;
  this.update = function(){
    if (this.y+80<0){
      this.y = ybound;
      if (Math.random() >= 0.9) this.lit = true;
      else{
        this.lit = false;
      }
    }
    else {
      this.y -=dy;
    }
  };
  this.draw = function(){
    if (this.lit){
      var img = document.getElementById("window_lit");
    }
    else{
    var img = document.getElementById("window_unlit");
    }
    ctx.globalAlpha = .8;
    ctx.drawImage(img, this.x, this.y+i, 80, 100);
    /*
    ctx.globalAlpha = (1/(dy));
    for (var i=0;i<(dy+1);++i){
      ctx.drawImage(img, this.x, this.y+i, 80, 100);
    }
    */
    ctx.globalAlpha = 1.0;

  };
};


var windowheights=[];
var windowpositions=[];
var windows = [];
function clearWindows(){
  windows = [];
}
function genWindows(){
var windowheight = 0;

var position = xbound/5/10;
for (i=0;i<12; i++){
  if (i%3===0&&i!=0){
    windowheight+= ybound/4+20;
    position = xbound/5/10;
  }
  windows.push(new Window(position, windowheight));

  position+= 3*xbound/5/10;

}
var windowheight = 0;
var position = 4*xbound/5+xbound/5/10;
for (i=12;i<24; i++){
  if (i%3===0&&i!=12){
    windowheight+= ybound/4+20;
    position = 4*xbound/5+xbound/5/10;
  }
  windows.push(new Window(position, windowheight));
  position+= 3*xbound/5/10;
}
}
genWindows();
function resizeObstacles(){
  for (i=0; i<obstacles.length; i++){
    obstacles[i].resize();
  }
}
function resetObstacles(){
  var height = ybound+500;
  for (i = 0; i < obstacleCount; i++) {

    var min= xbound/5+30;
    var max=4*xbound/5-30;
    var random =Math.floor(Math.random() * (+max - +min)) + +min;
    frameO = i%4;
    stepO = 0;
    var offset =  Math.floor(Math.random() * Math.floor(6))*50;
    var random_boolean = Math.random() >= 0.5;
    var flip = Math.random() >= 0.5;
    var ob = new Obstacle(random, height, offset, stepO, frameO, flip);
    obstacles[i] = ob;
    height+=ybound/2;
  }
  //var rightPressed = false;
  //var leftPressed = false;
  //var cx = xbound/2;
  //var cy = ybound/4;
  //drawObstacles();
  //drawCarmen();

}


resetObstacles();

var text1 = ybound;
var text2 =3* ybound-200;
var text3 = ybound+200+100;
function drawText(a){
  resetObstacles();
  var img1 = document.getElementById("freefall");
  var img3 = document.getElementById("bolt");
  var img2 = document.getElementById("freefall");
  if(text1>0|| a){
  ctx.drawImage(img1, xbound/5, text1, xbound*.6, ybound);
  text1-=5;
  text2-=5;
  text3-=5;
  }
  else{
    ctx.drawImage(img2, xbound/5, text1, xbound*.6, ybound);
  }
  if (text2-200<ybound){
    ctx.textAlign = "center";
    ctx.font = "42px Iceberg";
    ctx.fillStyle = "white";
    ctx.fillText("Use Arrowkeys to Avoid Cars", xbound/2, text2-100);
    ctx.fillText("Press Space to Pause", xbound/2, text2);
    ctx.textAlign = "start";
  }
}



cy = ybound;
var sidestep=0;
var izzy = new Carmen();

windowParticles =[];
windowParticles2 =[];
var max_velW = 80;
var max_radW = 20;
for (var i = 0; i < getRandom(50, 100); i++) {
  x = xbound/5;
  y = ybound/4 +80+ getRandom(-50, 50);
  //dir = Math.atan(yvel/xvel);
  //speed = Math.sqrt(yvel*yvel + xvel*xvel);
  //(x, y, dir, speed, rad, min_rad, scale_speed, drag, fill)
  p = new Particle(x, y, 2*Math.Pi, getRandom(0, max_velW), getRandom(5, max_radW), 50, getRandom(0.85, 0.90), getRandom(0.97, 0.992), 'silver');
  //p = new Particle(0, 0, 0, 0, 0, 0, 0, 0, 0);
  windowParticles.push(p);
  windowParticles2.push(p);
}

var malevolent = new Carmen();
malevolent.x = xbound/5;
malevolent.y = ybound/4;
malevolent.xvel =10;
malevolent.yvel=0;
var hero = new Carmen();
hero.x = -800;
hero.y = ybound/4;
hero.xvel =10;
hero.yvel=0;
var parachute = new Carmen();
parachute.x = xbound*.6;
parachute.y = ybound/4;


function drawOutro(){
  dy=0;
  if (izzy.y<ybound){
    izzy.y = 2*ybound;
  }
  resetObstacles();
  if (parachute.res>0){
    parachute.res-=.005;
    parachute.y-=.01;
  }
  else{
    window.location.reload(false);
  }
  var img = document.getElementById("rescue");
  ctx.drawImage(img, parachute.x-200, parachute.y-200, 500*parachute.res, 500*parachute.res);

}
function drawIntro(){

  dy= 0;
  //ctx.globalCompositeOperation ='screen';

	for (var i = 0; i < windowParticles.length; i++) {
		var particle = windowParticles[i];

		ctx.fillStyle = particle.fill;

		ctx.beginPath();
		ctx.arc(particle.x, particle.y, particle.rad * particle.scale, 0, Math.PI * 2);
    //ctx.arc(this.x, this.y,5, 0, Math.PI * 2);
		ctx.fill();
    particle.update();
    if(particle.rad*particle.scale<5) windowParticles.splice(i, 1);

	}
	ctx.globalCompositeOperation = 'source-over';

  if (malevolent.y <ybound){
    malevolent.yvel +=.5;

    malevolent.y+= malevolent.yvel;
    malevolent.x += malevolent.xvel;
  }
  var img = document.getElementById("killer");
  ctx.drawImage(img, malevolent.x, malevolent.y, 100, 100);

  if(hero.y<ybound&&hero.x>xbound/5-40){
    for (var i = 0; i < windowParticles2.length; i++) {
  		var particle = windowParticles2[i];

  		ctx.fillStyle = particle.fill;

  		ctx.beginPath();
  		ctx.arc(particle.x, particle.y, particle.rad * particle.scale, 0, Math.PI * 2);
      //ctx.arc(this.x, this.y,5, 0, Math.PI * 2);
  		ctx.fill();
      particle.update();
      if(particle.rad*particle.scale<5) windowParticles2.splice(i, 1);

  	}
    hero.yvel +=.5;

    hero.y+= hero.yvel;
  }
  hero.x += hero.xvel;
  var img = document.getElementById("hero");
  ctx.drawImage(img, hero.x, hero.y, hero.width, hero.height);
  ctx.fillStyle = "#0A1322";
  ctx.fillRect(0,0, xbound/5,ybound);
  ctx.fillRect(4*xbound/5,0, xbound,ybound);

  drawWindows();
  if (hero.y>ybound) intro = true;
}
var intro = false;


var a = 1 + 3;
var b;
var start =false;
if (performance.now<6000){
  drawBackground();
  drawSpeed();

}
//soundtrack.play();
function draw(){
  if(!pause){
  drawBackground();
  drawSpeed();
  if (performance.now()<3000){
    dy=0;

  }
  else if (intro ==false){
    drawIntro();

  }
  else if (text2+100>0){
    dy=5;
    if (performance.now()>11000){
      drawText(true);
    }
    else{
      drawText(false);
    }
  }
  else if (endgame){
    drawOutro();
  }

  else{

  //drawCarmen();
  izzy.update();
  izzy.draw();
  /*
  else if(upPressed && cy > 0) {
    cy -= 7;
  }
  else if(upPressed && cy < ybound) {
    cy += 7;
  }
  */
  if (collisionDetection(izzy)){
    collision = true;
    var temp = dy;
    deaths++;
    deathNotice = new Alert("life");
    alerts.push(deathNotice);


    //resetObstacles();
  }

    //cx = xbound/2;



  if (dy<terminal&&dy>4.9&&dy>=max_speed){
    dy+=.001;
    if(dy>max_speed) max_speed = dy;
  }
  if(max_speed>dy&&!(izzy.y>ybound/4)){
    dy+=.1;
  }

  if (dy>terminal){
    if (drawKiller()){
      //window.location.reload(false);
      endgame = true;
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
  if (Math.round(dkiller/20) == 3000 &&alertOffset==3){
    p = new Alert("altitude");
    alerts.push(p);
    alertOffset--;
  }
  if (Math.round(dkiller/20) == 1200 &&alertOffset==2){
    p = new Alert("altitude");
    alerts.push(p);
    alertOffset--;
  }
  if (Math.round(dkiller/20) == 600 &&alertOffset==1){
    p = new Alert("altitude");
    alerts.push(p);
    alertOffset--;
  }
  updateAlerts();



  if (dkiller<ybound+200){
    dkiller=ky;
  }
  if ((dkiller)<ybound){
    noNew=true;
  }
  //drawSpeed();
}
}
  requestAnimationFrame(draw);

}draw();

function updateAlerts(){
  for (i=0; i<alerts.length; i++){
    alerts[i].update();

    if (alerts[i].scroll == false){
    alerts.splice(i,1);
    }

  }
}
function drawAlerts(){
  for (i=0; i<alerts.length; i++){
    alerts[i].draw();
  }
}
function drawSpeed(){
    ctx.font = "16px Iceberg";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Speed: "+dy, xbound/2, 20);
    ctx.fillText("Time: "+performance.now(), xbound/2-200, 20);
    ctx.fillText("killer height: "+noNew, xbound/5, 20);


    ctx.fillStyle= "black";
    //ctx.fillRect(4*xbound/5,4.20*ybound/5,xbound/5, ybound/5);
    var grd = ctx.createRadialGradient(4*xbound/5,4*ybound/5, 5, 4*xbound/5,4*ybound/5, 70);
    grd.addColorStop(0, "blue");
    grd.addColorStop(1, "white");
    // Fill with gradient
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    // ctx.strokeRect(4*xbound/5,4.20*ybound/5, ybound/5, ybound/5);


    ctx.font = "42px Iceberg";
    ctx.fillStyle = "Red";
    //ctx.fillText(""+('000' + Math.round((dkiller-ybound/3.8125)/20)).slice(-4), 4*xbound/5+5, 4.5*ybound/5);
    ctx.font = "30px Iceberg";
    ctx.fillStyle = "Red";
    //ctx.fillText(""+('m'), 4.33*xbound/5+5, 4.5*ybound/5);
    ctx.font = "24px Iceberg";
    ctx.fillStyle = "Red";
    //ctx.fillText(""+('TO CATCH'), 4*xbound/5+5, 4.7*ybound/5);
    //ctx.fillText(""+('THE KILLER'), 4*xbound/5+5, 4.9*ybound/5);

    ctx.font = "42px Iceberg";
    ctx.fillStyle = "Red";
    //ctx.fillText(""+('000' + Math.round((ground)/20)).slice(-4), 4.5*xbound/5+5, 4.5*ybound/5);
    ctx.font = "30px Iceberg";
    ctx.fillStyle = "Red";
    //ctx.fillText(""+('m'), 4.83*xbound/5+5, 4.5*ybound/5);
    ctx.font = "24px Iceberg";
    ctx.fillStyle = "Red";
    //ctx.fillText(""+('TO HIT THE'), 4.5*xbound/5+5, 4.7*ybound/5);
    //ctx.fillText(""+('GROUND'), 4.5*xbound/5+5, 4.9*ybound/5);
}
//you're gonna have to fill out a form
//have you considered looking for a summer internship? it's a great way to start your career
function drawKiller(){
  kx = 3*xbound/5;
  img = document.getElementById("killer");
  ctx.drawImage(img, kx, ky, 100, 100);
  if (ky>ybound/4){
    ky-=1;
  }
  if(kx<izzy.x+25&&kx+30>izzy.x&&ky<izzy.y+50&&ky+30>izzy.y){
    return true;
  }
}
function collide(){
  for (i=0;i<obstacleCount;i++){
    for(j=0;j<obstacles[i].splatter[j].length; j++){
      particle = obstacles[i].splatter[j];
      obstacles[i].displaySplatter();


    }
  }
  //cx = xbound/2;
}
function drawBackground(){
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.fillRect(0,0, xbound,ybound);



  var grd = ctx.createLinearGradient(0,0, 0, 2*ybound/3);
  grd.addColorStop(0, "#3B67BF");
  grd.addColorStop(1, "transparent");
  ctx.fillStyle = grd;
  ctx.fillRect(xbound/5,0, 3*xbound/5,ybound);

  drawAlerts();
  drawObstacles();


  ctx.fillStyle = "#0A1322";
  ctx.fillRect(0,0, xbound/5,ybound);
  ctx.fillRect(4*xbound/5,0, xbound,ybound);

  drawWindows();
  /*
  for (i = 0; i < 24; i++) {
    if (windowheights[i]+80<0){
      windowheights[i] = ybound;
    }
    if (i%5===0){
      var img = document.getElementById("window_lit");
      ctx.drawImage(img, windowpositions[i], windowheights[i], 80, 100);

      ctx.fillStyle = "#FFEE93";
      ctx.globalAlpha = 0.6;
      ctx.fillRect(windowpositions[i],windowheights[i], 50,80);

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

  }
    windowheights[i]-=dy;
  }
  */



  ctx.closePath();

}




function collisionDetection(izzy){
  for (i =0; i<obstacleCount; i++){
    var x = obstacles[i].x;
    var y = obstacles[i].y;

    if (izzy.x < obstacles[i].x + obstacles[i].width &&
     izzy.x + izzy.width/2 > obstacles[i].x &&
     izzy.y < obstacles[i].y + obstacles[i].height &&
     izzy.y + izzy.height > obstacles[i].y &&
     !invulnerable){
      //obstacles[i].xvel=0;
      obstacles[i].explode();
      //obstacles[i].displaySplatter(ctx);
      dy=0;
      obstacles[i].colliding =true;
      obstacles[i].y +=ybound;

      izzy.y =ybound+500;
      izzy.x = xbound/2;
      return true;

      }
    obstacles[i].displaySplatter(ctx);
  }
}

function updateWindows(){
  for (i=0;i<windows.length; i++){
    windows[i].update();
  }
}
function drawWindows(){
  for (i=0;i<windows.length; i++){
    windows[i].update();
    windows[i].draw();
  }
}
function drawCarmen(){

  if(cy>ybound/4){
    cy-=5;
    //resetObstacles();
    invulnerable = true;
    if(cy<ybound+50){
      // /dy=temp;
      resetObstacles();


    }
    if(carmenStatus ==1) return;
  }
  else if (!cheat){
    invulnerable = false;
  }
  if (deaths==3) return;


  var img = document.getElementById("isabella");
  if(sidestep<0) offset = 100;
  if(sidestep>0) offset = 300;
  if(sidestep<-3) offset = 0;
  if(sidestep>3) offset =400;
  if (sidestep==0){
     offset = 200;


    if (carmenStatus==0){
      ctx.drawImage(img, offset,100*carmenStatus,100,100, cx, cy, 80, 80);

    }
    else if(carmenStatus==1){
      ctx.drawImage(img, offset,100*carmenStatus,100,100, cx, cy, 80, 80);
    }
    else if(carmenStatus==2){
      ctx.drawImage(img, offset,100*carmenStatus,100,100, cx, cy, 80, 80);

    }
  }
  else{
  ctx.drawImage(img, offset,0,100,100, cx, cy, 80, 80);
}
/*
  if (rightPressed){
    var img = document.getElementById("right");
    ctx.drawImage(img, 0,0,100,100, cx, cy, 80, 80);
  }
  else if (leftPressed){
    var img = document.getElementById("left");
    ctx.drawImage(img, 0,0,100,100, cx, cy, 80, 80);
  }
  */



};

function drawObstacles(){
  var i;

  for (i = 0; i < obstacleCount; i++) {
    var ob = obstacles[i];
    obstacles[i].x += obstacles[i].xvel;
    obstacles[i].y-=dy;

    if (obstacles[i].y+500<0 &&!noNew){
      var min= xbound/5;
      var max=4*xbound/5-90;
      var random =Math.floor(Math.random() * (+max - +min)) + +min;
      obstacles[i].x= random;
      obstacles[i].y = ybound+getRandom(0,ybound/2);
      obstacles[i].offset = Math.floor(Math.random() * Math.floor(6))*50;

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
    /*
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(pos[i], heights[i], 30,30);
    ctx.closePath();
    */

    var img = document.getElementById("obstacle");
    if (obstacles[i].flip==1){
    //if (cy<ybound+50 &&(obstacles[i].frame==0 || obstalces[i].frame==3))return;
    ctx.drawImage(img, obstacles[i].frame*100,obstacles[i].offset+300, 90, 50, obstacles[i].x,obstacles[i].y, obstacles[i].width,obstacles[i].height);


    }
    //ctx.drawImage(img, obstacles[i].frame*100,obstacles[i].offset, 90, 40, obstacles[i].x,obstacles[i].y, 90*1.25,50*1.25);
    else{
      //if (cy<ybound+50 &&(obstacles[i].frame==0 || obstalces[i].frame==3))return;
      ctx.drawImage(img, obstacles[i].frame*100,obstacles[i].offset, 90, 50, obstacles[i].x,obstacles[i].y, obstacles[i].width,obstacles[i].height);

    }



  }
}
var cheat = false;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if(e.key == "s") {
        invulnerable = true;
        cheat = true;
    }
    else if(e.key == "a") {
        leftPressed = true;
    }
    else if(e.key == "d") {
        rightPressed = true;
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
    else if(e.key == "a") {
        leftPressed = false;
    }
    else if(e.key == "d") {
        rightPressed = false;
    }
    else if(e.key == "s") {
        invulnerable = false;
        cheat = false;
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
function togglePause()
{
    if (!pause)
    {
        pause = true;
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "black";
        ctx.fillRect(0,0, xbound,ybound);
        ctx.globalAlpha =1;
        ctx.textAlign = "center";
        ctx.font = "42px Iceberg";
        ctx.fillStyle = "white";
        ctx.fillText("PRESS [SPACE] TO RESUME", xbound/2, ybound/2);
        ctx.textAlign = "start";

    } else if (pause)
    {
       pause= false;
    }

}

window.addEventListener('keydown', function (e) {
var key = e.keyCode;
if (key === 32)// spacebar
{
    togglePause();
}
});
function reportWindowSize() {
  ybound = window.innerHeight;
  xbound = window.innerWidth;
  terminal = ybound/60;
  clearWindows();
  genWindows();
  izzy.resize();
  resizeObstacles();
}

window.onresize = reportWindowSize;
