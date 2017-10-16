var dookieCount = 0;
var dookiePerSecond = 0;
var dificulty = 1.05;
var xpos = 200;
var ypos = 200;
var xspeed = 0;
var yspeed = 0;
var canvasWidth = 400;
var canvasHeight = 400;
var playerSize = 20;

var turds = [];
var buyablesCount = [0, 0, 0]

function setup() {   
  var canvas = createCanvas(400, 400);
  canvas.parent('sketch-holder');
  turds.push(new Turd());
} 

function draw() {
  background(220);
  $('#dookieCount').html(Math.round(dookieCount));
  drawItemInfo();
  calculateDPS();
  drawPlayer();
  for (var i = 0; i < turds.length; i++) {
    turds[i].render();
    turds[i].update();
	if(turds[i].timeout <= 0){
		turds.splice(i, 1);
		turds.push(new Turd());		
	}
  }
}

function drawPlayer() {
	xpos = xpos + xspeed;
	ypos = ypos + yspeed;
	
	if(xpos < 0){
		xpos = 0;
	}
	if(xpos > (canvasWidth-playerSize)){
		xpos = (canvasWidth-playerSize);
	}
	if(ypos < 0){
		ypos = 0;
	}
	if(ypos > (canvasHeight-playerSize)){
		ypos = (canvasHeight-playerSize);
	}
	
	fill("white");
	rect(xpos, ypos, playerSize, playerSize, 10);
	for (var i = 0; i < turds.length; i++) {
		if(turds[i].touched(xpos, ypos)){
			dookieCount += turds[i].dookie;
			turds.splice(i, 1);
			turds.push(new Turd());
		}
	}
}

function keyPressed() {
	if(keyCode == 87){
		yspeed = -2;
	}
	if(keyCode == 83){
		yspeed = 2;
	}
	if(keyCode == 65){
		xspeed = -2;
	}
	if(keyCode == 68){
		xspeed = 2;
	}
}

function keyReleased() {
	if(keyCode == 87){
		yspeed = 0;
	}
	if(keyCode == 83){
		yspeed = 0;
	}
	if(keyCode == 65){
		xspeed = 0;
	}
	if(keyCode == 68){
		xspeed = 0;
	}
}

function clickButton () {
  dookieCount = dookieCount + 1;
}

function buyItem(id) {
  var itemCount = buyablesCount[id];
  var itemCost = buyables[id].cost;
  var itemIncrament = buyables[id].incrament;
  var realCost = (itemCost * (itemCount * itemIncrament) + itemCost);
  
  if (realCost <= dookieCount){
	buyablesCount[id] += 1;
	dookieCount = dookieCount - realCost;
  }
}

function calculateDPS(){
  var dps = 0;
  for(var i = 0; i < buyables.length; i++){
	var itemCount = buyablesCount[i];
	var itemDPS = buyables[i].dps;
	dps  += (itemCount * itemDPS);
  }
  dookiePerSecond = dps;
  $('#dps').html(dookiePerSecond); 
  dookieCount += dookiePerSecond / 60;  
}

function drawItemInfo(){
  for(var i = 0; i < buyables.length; i++){
	var itemCount = buyablesCount[i];
	var itemCost = buyables[i].cost;
	var itemIncrament = buyables[i].incrament;
	var realCost = (itemCost * (itemCount * itemIncrament) + itemCost);
	var name = buyables[i].name	
	var itemName = name.toLowerCase();

	$('#' + itemName + 'Count').html(buyablesCount[i]); 
	$('#' + itemName + 'Cost').html(Math.round(realCost));
	if(dookieCount >= realCost){
	 if($('#' + itemName).hasClass("notBuyable")){
		$('#' + itemName).removeClass("notBuyable");
	 }
	}else{
	 if(!$('#' + itemName).hasClass("notBuyable")){
		$('#' + itemName).addClass("notBuyable");
	 }
	}
  }
}