// Ensure Game object is defined by sketch.js loading first
if (typeof Game === 'undefined') {
  console.error("Game object is not defined. Make sure sketch.js is loaded before buyables.js");
  // Fallback or throw error, for now, we'll proceed assuming Game exists for diff tool
}

Game.buyablesData = [
	{
		name:'Bartle',
		cost: 10,
		dps: 1,
		incrament: 0.8
	},
	{
		name:'Blicker',
		cost: 100,
		dps: 5,
		incrament: 1.6
	},
	{
		name:'Smork',
		cost: 1250,
		dps: 15,
		incrament: 2.2
	}
	];