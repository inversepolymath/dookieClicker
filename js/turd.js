function Turd(gameCanvasWidth, gameCanvasHeight, gamePlayerSize){
	this.size = 20;
	// Use passed-in dimensions for positioning
	this.x = random(gameCanvasWidth - this.size);
	this.y = random(gameCanvasHeight - this.size);
	this.dookie = 2;
	this.timeout = 5; // seconds
	this.color = "#442301";

	// Golden turd logic
	if(round(random(0,10)) == 2){ // approx 10% chance
		this.dookie *= 3;
		this.color = "gold"; // Changed from "black" for better visual cue
		this.timeout = 3; // Shorter timeout for golden turds
	}
	
	this.update = function(){
		// Assuming draw is called 60 times per second (p5.js default)
		this.timeout -= (1 / 60); 
	}
	
	this.render = function(){
		fill(this.color);
		rect(this.x, this.y, this.size, this.size);
		
		// Display timeout, centered on the turd
		fill("white");
		textAlign(CENTER, CENTER); // p5.js text alignment
		text(round(this.timeout), this.x + this.size / 2, this.y + this.size / 2);
		textAlign(LEFT, BASELINE); // Reset to default
	}
	
	this.touched = function(px, py){
		// Simple distance check (center to center of player and turd).
		// Assumes player and turd are roughly circular/square for this collision.
		// gamePlayerSize is the full width/height of the player.
		var d = dist(
			px + gamePlayerSize / 2, // Player's center X
			py + gamePlayerSize / 2, // Player's center Y
			this.x + this.size / 2,  // Turd's center X
			this.y + this.size / 2   // Turd's center Y
		);
		// If distance between centers is less than sum of their half-sizes, they are touching.
		if (d < (gamePlayerSize / 2 + this.size / 2)){
			return true;
		}else{
			return false;
		}
	}
}