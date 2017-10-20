function Turd(){
	this.size = 20;
	this.x = random(canvasWidth-this.size);
	this.y = random(canvasHeight-this.size);
	this.dookie = 2;
	this.timeout = 5;
	this.color = "#442301";
	if(round(random(0,10)) == 2){
		this.dookie *= 3;
		this.color = "black";
		this.timeout = 3;
	}
	
	this.update = function(){
		this.timeout -= 1 / 60;
	}
	
	this.render = function(){
		fill(this.color);
		rect(this.x, this.y, this.size, this.size);
		fill("white");
		//terrible way to place the text
		text(round(this.timeout), this.x + 8, this.y + 15);
	}
	
	this.touched = function(px, py){
		var d = dist(px, py, this.x, this.y);
		if (d <= playerSize){
			return true;
		}else{
			return false;
		}
	}
}