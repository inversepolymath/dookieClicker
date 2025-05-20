// Ensure Game object is defined by sketch.js loading first
if (typeof Game === 'undefined') {
  console.error("Game object is not defined. Make sure sketch.js is loaded before upgrades.js");
}

Game.upgradesData = [
	{
	 name: "Better Dookies",
	 elementName: "betterDookies",
	 description: "Increase all dookies by 1 DPS",
	 cost: 1,
	 type: "dpsToAll",
	 amount: 1
	},
	{
	 name: "Move Faster",
	 elementName: "moveFaster",
	 description: "Increase speed by 2",
	 cost: 1,
	 type: "speed",
	 amount: 2
	},
	{
	 name: "Incrase Turd Value",
	 elementName: "turdValue",
	 description: "Increase turd value by 50%",
	 cost: 1,
	 type: "turdIncrease",
	 amount: 0.5
	},
	{
	 name: "Incrase Turd Value",
	 elementName: "turdValue2",
	 description: "Increase turd value by 50%",
	 cost: 10,
	 type: "turdIncrease",
	 amount: 0.5
	}
];