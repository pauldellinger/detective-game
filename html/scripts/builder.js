var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var xbound = 1920;
var ybound = 1080;
var count = 0;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, xbound, ybound);

function drawButtons(){
var button = document.createElement("button");
button.innerHTML = "Do Something";

var images = document.getElementsByTagName("IMG");

for (i=0; i<images.length; i++){
  var button = document.createElement("button");
  button.innerHTML = images[i].id;
// 2. Append somewhere
  var body = document.getElementsByTagName("div")[0];

  body.appendChild(button);
  button.style.top =+100+50*i+"px";
// 3. Add event handler
/*
button.addEventListener ("click", function() {
  */
}
}
document.getElementById("upload").addEventListener("click", drawButtons);
