// Define Game object
var Game = {
  // State variables
  dookieCount: 0,
  dookieCountAllTime: 0,
  dookiePerSecond: 0,
  difficulty: 1.05,
  xspeed: 0, // Player's horizontal speed
  gravity: 0.6,
  lift: -15,
  velocity: 0, // Player's vertical velocity
  movementSpeed: 2, // Base horizontal movement speed

  // Canvas and game dimensions
  canvasWidth: 400,
  canvasHeight: 600,
  xpos: 0, // Player's x position
  ypos: 0, // Player's y position
  playerSize: 20,
  wallSize: 10,
  
  // Game elements
  currentLevelData: null, // Renamed from 'level'
  turds: [],
  turdMultiplier: 1,
  
  // Buyables and Upgrades
  buyablesData: [], // To be populated from buyables.js
  buyablesCount: [], // Initialized in init
  upgradesData: [],   // To be populated from upgrades.js
  upgradesCount: [],  // Initialized in init

  init: function() {
    // Ensure the sketch-holder div exists before trying to create canvas in it
    if ($('#sketch-holder').length === 0) {
      console.error("Fatal Error: sketch-holder DOM element not found. Cannot initialize game.");
      // Optionally, display a message to the user on the page itself
      // document.body.innerHTML = '<div style="text-align: center; padding-top: 50px;"><h1>Error</h1><p>Game canvas could not be initialized. Missing HTML element.</p></div>';
      return; // Stop initialization
    }
    var canvas = createCanvas(this.canvasWidth, this.canvasHeight);
    canvas.parent('sketch-holder');

    this.xpos = this.canvasWidth / 2;
    this.ypos = this.canvasHeight; // Start at bottom

    // Initialize buyablesCount based on buyablesData length (after it's loaded)
    if (this.buyablesData && this.buyablesData.length > 0) {
        this.buyablesCount = new Array(this.buyablesData.length).fill(0);
    } else {
        // Fallback if buyablesData isn't loaded yet, though script order should handle this
        this.buyablesCount = [0,0,0]; // Assuming 3 buyables if data not ready
    }


    this.turds.push(new Turd(this.canvasWidth, this.canvasHeight, this.playerSize)); // Pass necessary info
    if (this.levelsData && this.levelsData.length > 0) {
        this.currentLevelData = random(this.levelsData);
    } else {
        console.error("Levels data not loaded!");
        // Potentially load a default level or handle error
        this.currentLevelData = [[]]; // Empty level
    }
    this.createUpgradesDOM(); // Renamed
  },

  mainDraw: function() { // Renamed from draw to avoid p5.js global conflict
    background(220);
    $('#dookieCount').html(Math.round(this.dookieCount));
    this.drawItemInfoDOM(); // Renamed
    this.calculateDPS();
    this.drawPlayer();

    for (var i = this.turds.length - 1; i >= 0; i--) { // Iterate backwards for safe removal
      this.turds[i].render();
      this.turds[i].update();
      if (this.turds[i].timeout <= 0) {
        this.turds.splice(i, 1);
        this.turds.push(new Turd(this.canvasWidth, this.canvasHeight, this.playerSize));
      }
    }

    if (this.currentLevelData) {
      for (var h = 0; h < this.currentLevelData.length; h++) {
        for (var j = 0; j < this.currentLevelData[h].length; j++) {
          var segment = this.currentLevelData[h][j];
          if (segment == 1) {
            fill('black');
            rect(h * this.wallSize, j * this.wallSize, this.wallSize, this.wallSize);
          }
        }
      }
    }
  },

  isWall: function(x, y) {
    // Checks if the player at position (x,y) is colliding with a wall segment.
    // TODO: Future optimization: Instead of checking all cells, convert player's x,y 
    // to grid coordinates (e.g., gridX = Math.floor(x / this.wallSize)) and 
    // check only the cell the player is in and its immediate neighbors.
    if (!this.currentLevelData) return undefined;
    for (var h = 0; h < this.currentLevelData.length; h++) {
      for (var j = 0; j < this.currentLevelData[h].length; j++) {
        var segment = this.currentLevelData[h][j];
        if (segment == 1) { // 1 represents a wall segment
          var xwall = h * this.wallSize;
          var ywall = j * this.wallSize;
          // Simple AABB (Axis-Aligned Bounding Box) collision detection
           if (x < xwall + this.wallSize &&    // Player's left edge vs wall's right edge
               x + this.playerSize > xwall && // Player's right edge vs wall's left edge
               y < ywall + this.wallSize &&    // Player's top edge vs wall's bottom edge
               y + this.playerSize > ywall) { // Player's bottom edge vs wall's top edge
            return ywall; // Return y-coordinate of the wall for collision response
          }
        }
      }
    }
    return undefined; // No collision
  },

  drawPlayer: function() {
    // Handles player movement, boundary checks, and wall collision response.
    this.xpos += this.xspeed;
    this.ypos += this.velocity;

    // Boundary checks
    if (this.xpos < 0) this.xpos = 0;
    if (this.xpos > (this.canvasWidth - this.playerSize)) this.xpos = (this.canvasWidth - this.playerSize);
    if (this.ypos < 0) { // Prevent going through ceiling
        this.ypos = 0;
        if (this.velocity < 0) this.velocity = 0; // Stop upward movement if hit ceiling
    }
    if (this.ypos > (this.canvasHeight - this.playerSize)) {
        this.ypos = (this.canvasHeight - this.playerSize);
        if (this.velocity > 0) this.velocity = 0; // Stop downward movement if hit ground
    }
    
    var wallCollisionY = this.isWall(this.xpos, this.ypos);
    if (wallCollisionY !== undefined) {
        if (this.velocity >= 0 && this.ypos + this.playerSize > wallCollisionY && this.ypos < wallCollisionY + this.wallSize) { // Hitting top of a wall
            this.velocity = 0;
            this.ypos = wallCollisionY - this.playerSize;
        } else if (this.velocity < 0 && this.ypos < wallCollisionY + this.wallSize && this.ypos + this.playerSize > wallCollisionY) { // Hitting bottom of a wall
            this.velocity = 0;
            this.ypos = wallCollisionY + this.wallSize;
        }
    } else {
        this.velocity += this.gravity;
    }
    this.velocity *= 0.9; // Air resistance / damping

    fill("white");
    rect(this.xpos, this.ypos, this.playerSize, this.playerSize, 10);

    for (var i = this.turds.length - 1; i >= 0; i--) {
      if (this.turds[i].touched(this.xpos, this.ypos)) {
        this.addDookie(this.turds[i].dookie * this.turdMultiplier);
        this.turds.splice(i, 1);
        this.turds.push(new Turd(this.canvasWidth, this.canvasHeight, this.playerSize));
      }
    }
  },

  addDookie: function(amount) {
    this.dookieCount += amount;
    this.dookieCountAllTime += amount;
  },

  handleKeyPressed: function(kCode) { 
    if (kCode == 87) { // W key for Jump
      this.velocity += this.lift;
    }
    if (kCode == 65) { // A key for Move Left
      this.xspeed = -this.movementSpeed;
    }
    if (kCode == 68) { // D key for Move Right
      this.xspeed = this.movementSpeed;
    }
  },

  handleKeyReleased: function(kCode) { 
    if (kCode == 65) { // A key
      if (this.xspeed < 0) this.xspeed = 0; // Stop if moving left due to A key release
    }
    if (kCode == 68) { // D key
      if (this.xspeed > 0) this.xspeed = 0; // Stop if moving right due to D key release
    }
  },

  clickButton: function() {
    this.addDookie(1);
  },

  canAfford: function(cost) {
    return this.dookieCount >= cost;
  },

  buyBuyableItem: function(id) { // Renamed to be more specific
    if (!this.buyablesData || id < 0 || id >= this.buyablesData.length) return;
    
    var itemCount = this.buyablesCount[id];
    var itemData = this.buyablesData[id];
    var realCost = (itemData.cost * (itemCount * itemData.incrament) + itemData.cost);

    if (this.canAfford(realCost)) {
      this.buyablesCount[id] += 1;
      this.dookieCount -= realCost;
    }
  },

  buyUpgradeItem: function(id) { // Renamed
    if (!this.upgradesData || id < 0 || id >= this.upgradesData.length) return;

    var hasUpgrade = this.upgradesCount[id];
    var upgradeData = this.upgradesData[id];

    if (hasUpgrade === 0) {
      if (this.canAfford(upgradeData.cost)) {
        this.upgradesCount[id] = 1;
        this.dookieCount -= upgradeData.cost;
        $('#' + upgradeData.elementName).remove(); // DOM manipulation
        
        if (upgradeData.type == "speed") {
          this.movementSpeed += upgradeData.amount;
        } else if (upgradeData.type == "turdIncrease") {
          this.turdMultiplier += upgradeData.amount;
        } else if (upgradeData.type == "dpsToAll") {
          for (var x = 0; x < this.buyablesData.length; x++) {
            this.buyablesData[x].dps += upgradeData.amount;
          }
        }
      }
    }
  },

  calculateDPS: function() {
    var dps = 0;
    if (this.buyablesData) {
        for (var i = 0; i < this.buyablesData.length; i++) {
            if(this.buyablesCount[i] === undefined) this.buyablesCount[i] = 0; // Ensure defined
            var itemCount = this.buyablesCount[i];
            var itemDPS = this.buyablesData[i].dps;
            dps += (itemCount * itemDPS);
        }
    }
    this.dookiePerSecond = dps;
    $('#dps').html(this.dookiePerSecond);
    if (this.dookiePerSecond > 0) { // Only add if DPS is positive
        this.addDookie(this.dookiePerSecond / 60); // Accumulate DPS per frame, assuming 60 FPS from p5.js draw loop
    }
  },

  drawItemInfoDOM: function() { // Renamed
    if (!this.buyablesData) return;
    for (var i = 0; i < this.buyablesData.length; i++) {
      if(this.buyablesCount[i] === undefined) this.buyablesCount[i] = 0; // Ensure defined
      var itemCount = this.buyablesCount[i];
      var itemData = this.buyablesData[i];
      var realCost = (itemData.cost * (itemCount * itemData.incrament) + itemData.cost);
      var name = itemData.name;
      var itemName = name.toLowerCase();

      $('#' + itemName + 'Count').html(this.buyablesCount[i]);
      $('#' + itemName + 'Cost').html(Math.round(realCost));
      $('#' + itemName + 'DPS').html(itemData.dps);
      
      var itemElement = $('#' + itemName); // Cache jQuery object
      if (this.dookieCount >= realCost) {
        if (itemElement.hasClass("notBuyable")) {
          itemElement.removeClass("notBuyable");
        }
      } else {
        if (!itemElement.hasClass("notBuyable")) {
          itemElement.addClass("notBuyable");
        }
      }
    }
  },

  createUpgradesDOM: function() { // Renamed
    var upgradeDiv = $('#upgrades');
    upgradeDiv.empty(); // Clear previous upgrades if any
    this.upgradesCount = []; // Reset upgrades count

    if (!this.upgradesData) return;
    for (var x = 0; x < this.upgradesData.length; x++) {
      this.upgradesCount.push(0); // Initialize count for this upgrade
      // IMPORTANT: onClick needs to call Game.buyUpgradeItem
      var html = '<div id="' + this.upgradesData[x].elementName + '" class="upgrade tooltip2" title="' + this.upgradesData[x].description + '" onClick="Game.buyUpgradeItem(' + x + ')"><p>' + this.upgradesData[x].name + '</p><p>' + this.upgradesData[x].cost + ' Dooks</p></div>';
      upgradeDiv.append(html);
    }
    if ($.fn.tooltipster) { // Check if tooltipster is loaded
        $('.tooltip2').tooltipster();
    } else {
        console.warn("Tooltipster not loaded, tooltips for upgrades will not work.");
    }
  }
};

// Global p5.js functions, delegating to Game object
function setup() {
  // Game object and its data properties should be defined before this by script load order
  // Buyables, Upgrades, Levels data should be attached to Game by their respective files.
  Game.init();
}

function draw() {
  Game.mainDraw();
}

function keyPressed() {
  Game.handleKeyPressed(keyCode);
}

function keyReleased() {
  Game.handleKeyReleased(keyCode);
}

// Keep global functions for HTML onClick attributes if they are simple wrappers
// or change HTML to call Game.clickButton() etc. directly if possible.
// For now, these will call the Game methods.
function clickButton() {
  Game.clickButton();
}
function buyItem(id) { // This is called from HTML, so it needs to be global
  Game.buyBuyableItem(id);
}
function upgrade(id) { // This is called from HTML, so it needs to be global
  Game.buyUpgradeItem(id);
}