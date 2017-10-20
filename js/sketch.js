var dookieCount = 0;
var dookieCountAllTime = 0;
var dookiePerSecond = 0;
var dificulty = 1.05;
var xspeed = 0;
var gravity = 0.6;
var lift = -15;
var velocity = 0;
var movementSpeed = 2;

var canvasWidth = 400;
var canvasHeight = 600;
var xpos = canvasWidth/2;
var ypos = canvasHeight;
var playerSize = 20;
var wallSize = 10;
var level;

var turds = [];
var turdMultiplier = 1;
var buyablesCount = [0, 0, 0];
var upgradesCount = [];

function setup() {   
  var canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('sketch-holder');
  turds.push(new Turd());
  level = random(levels);
  createUpgrades();
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
  for (var h = 0; h < level.length; h++){
	for (var j = 0; j < level[h].length; j++){
		var segment = level[h][j];
		if (segment == 1){
			fill('black');
			rect(h*wallSize, j*wallSize, wallSize, wallSize);
		}
    }
  }
}

function isWall(x, y){
  for (var h = 0; h < level.length; h++){
	for (var j = 0; j < level[h].length; j++){
		var segment = level[h][j];
		if(segment == 1){
			xwall = h*wallSize;
			ywall = j*wallSize;
			hitWall = dist(x, y, xwall-wallSize/2, ywall-wallSize/2);
			if(hitWall < 15){
				return ywall;
			}
		}
	}
  }
}

function drawPlayer() {
	xpos = xpos + xspeed;
	ypos += velocity;
	
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
	
	hitWall = isWall(xpos, ypos);
	if(hitWall){
		if(velocity >= 0){
			velocity = 0;
			ypos = hitWall-20;
		}else{
			velocity = 0;
			ypos = hitWall+10;
		}
	}else{
		velocity += gravity;
		velocity *= 0.9;		
	}

	
	fill("white");
	rect(xpos, ypos, playerSize, playerSize, 10);
	for (var i = 0; i < turds.length; i++) {
		if(turds[i].touched(xpos, ypos)){
			addDookie(turds[i].dookie * turdMultiplier);
			turds.splice(i, 1);
			turds.push(new Turd());
		}
	}
}

function addDookie(amount){
	dookieCount += amount;
	dookieCountAllTime += amount;
}

function keyPressed() {
	//console.log(keyCode);
	if(keyCode == 87){
		velocity += lift;
	}
	if(keyCode == 65){
		xspeed = -movementSpeed;
	}
	if(keyCode == 68){
		xspeed = movementSpeed;
	}
}

function keyReleased() {
	if(keyCode == 65){
		xspeed = 0;
	}
	if(keyCode == 68){
		xspeed = 0;
	}
}

function clickButton () {
  addDookie(1);
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

function upgrade(id) {
  var hasUpgrade = upgradesCount[id];
  var itemCost = upgrades[id].cost;
  var itemType = upgrades[id].type;
  var itemElementName = upgrades[id].elementName;
  var itemAmount = upgrades[id].amount;

  if(hasUpgrade == 0){
	  if (itemCost <= dookieCount){
		upgradesCount[id] = 1;
		dookieCount = dookieCount - itemCost;
		$('#' + itemElementName).remove();
		if(itemType == "speed"){
			movementSpeed += itemAmount;
		}else if(itemType == "turdIncrease"){
			turdMultiplier += itemAmount;
		}else if(itemType == "dpsToAll"){
			for(var x = 0; x < buyables.length; x++){
				buyables[x].dps += itemAmount;
			}
		}
	  }
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
  addDookie(dookiePerSecond / 60);
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
	$('#' + itemName + 'DPS').html(buyables[i].dps);
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

function createUpgrades(){
	var upgradeDiv = $('#upgrades');
	for (var x = 0; x < upgrades.length; x++){
		upgradesCount.push(0);
		var html = '<div id="' + upgrades[x].elementName + '" class="upgrade tooltip2" title="' + upgrades[x].description + '" onClick="upgrade(' + x + ')"><p>' + upgrades[x].name + '</p><p>' + upgrades[x].cost + ' Dooks</p></div>'
		upgradeDiv.append(html);
	}
	$('.tooltip2').tooltipster();
}