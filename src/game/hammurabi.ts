// Core game state interface
export interface GameState {
    year: number;
    population: number;
    grain: number;
    land: number;
    landPrice: number;
    peopleStarved: number;
    peopleArrived: number;
    plagueOccurred: boolean;
    gameOver: boolean;
    history: YearRecord[];
  }
  
  // Record of each year's decisions and outcomes
  export interface YearRecord {
    year: number;
    population: number;
    landOwned: number;
    landPrice: number;
    grainHarvested: number;
    grainPerAcre: number;
    grainEatenByRats: number;
    grainInStorage: number;
    peopleStarved: number;
    peopleArrived: number;
    plagueOccurred: boolean;
    acresBought: number;
    acresSold: number;
    grainFed: number;
    acresPlanted: number;
  }
  
  // Player decisions interface
  export interface PlayerDecisions {
    acresToBuy: number;
    acresToSell: number;
    grainToFeed: number;
    acresToPlant: number;
  }
  
  // Initialize a new game state
  export function initializeGame(): GameState {
    // Set an initial land price between 17-26
    const initialLandPrice = calculateLandPrice();
    
    return {
      year: 1,
      population: 100,
      grain: 2800,
      land: 1000,
      landPrice: initialLandPrice,
      peopleStarved: 0,
      peopleArrived: 5,
      plagueOccurred: false,
      gameOver: false,
      history: [],
    };
  }
  
  // Calculate how many acres can be planted with the available population
  export function maxAcresCanPlant(population: number): number {
    // Each person can work 10 acres
    return population * 10;
  }
  
  // Calculate how much grain is needed to feed the population
  export function grainNeededToFeed(population: number): number {
    // Each person needs 20 bushels per year
    return population * 20;
  }
  
  // Calculate random land price between 17 and 26 bushels per acre
  export function calculateLandPrice(): number {
    return Math.floor(Math.random() * 10) + 17;
  }
  
  // Calculate harvest yield (1-6 bushels per acre)
  export function calculateHarvest(): number {
    return Math.floor(Math.random() * 6) + 1;
  }
  
  // Determine if plague occurs (15% chance)
  export function checkPlague(): boolean {
    return Math.random() < 0.15;
  }
  
  // Calculate grain lost to rats (0-10% chance, with 0-30% of grain lost)
  export function calculateRatLoss(grain: number): number {
    if (Math.random() < 0.1) {
      // Up to 30% of grain is lost
      const ratPercentage = Math.random() * 0.3;
      return Math.floor(grain * ratPercentage);
    }
    return 0;
  }
  
  // Calculate new immigrants (based on land and grain)
  export function calculateNewcomers(land: number, grain: number, starvationRate: number): number {
    // No new arrivals if people are starving
    if (starvationRate > 0) return 0;
    
    // Otherwise, a random number of people arrive based on available land and food
    const potential = Math.floor((land + grain / 20) / 100);
    return Math.max(0, Math.floor(Math.random() * 5) + potential);
  }
  
  // Calculate number of people who starve
  export function calculateStarvation(population: number, grainFed: number): number {
    const canFeed = Math.floor(grainFed / 20);
    return Math.max(0, population - canFeed);
  }
  
  // Process player decisions and update game state
  export function processYear(state: GameState, decisions: PlayerDecisions): GameState {
    const newState = { ...state };
    const yearRecord: YearRecord = {
      year: state.year,
      population: state.population,
      landOwned: state.land,
      landPrice: state.landPrice,
      grainHarvested: 0,
      grainPerAcre: 0,
      grainEatenByRats: 0,
      grainInStorage: state.grain,
      peopleStarved: 0,
      peopleArrived: 0,
      plagueOccurred: false,
      acresBought: decisions.acresToBuy,
      acresSold: decisions.acresToSell,
      grainFed: decisions.grainToFeed,
      acresPlanted: decisions.acresToPlant
    };
    
    // Process land transactions
    newState.land += decisions.acresToBuy - decisions.acresToSell;
    newState.grain -= decisions.acresToBuy * state.landPrice;
    newState.grain += decisions.acresToSell * state.landPrice;
    
    // Process feeding the population
    newState.grain -= decisions.grainToFeed;
    
    // Process planting and harvest
    const seedGrain = Math.ceil(decisions.acresToPlant / 2); // 1/2 bushel to plant an acre
    newState.grain -= seedGrain;
    const harvestPerAcre = calculateHarvest();
    const harvestedGrain = decisions.acresToPlant * harvestPerAcre;
    newState.grain += harvestedGrain;
    yearRecord.grainHarvested = harvestedGrain;
    yearRecord.grainPerAcre = harvestPerAcre;
    
    // Process rats
    const grainEatenByRats = calculateRatLoss(newState.grain);
    newState.grain -= grainEatenByRats;
    yearRecord.grainEatenByRats = grainEatenByRats;
    
    // Calculate starvation
    const starved = calculateStarvation(newState.population, decisions.grainToFeed);
    newState.peopleStarved = starved;
    yearRecord.peopleStarved = starved;
    
    // Update population after starvation
    newState.population -= starved;
    
    // Check for plague
    const plague = checkPlague();
    newState.plagueOccurred = plague;
    yearRecord.plagueOccurred = plague;
    
    if (plague) {
      // Half the population dies in a plague
      newState.population = Math.floor(newState.population / 2);
    }
    
    // Calculate new arrivals
    const starvationRate = starved > 0 ? starved / state.population : 0;
    const newArrivals = calculateNewcomers(newState.land, newState.grain, starvationRate);
    newState.peopleArrived = newArrivals;
    yearRecord.peopleArrived = newArrivals;
    
    // Update population with new arrivals
    newState.population += newArrivals;
    
    // Check game over conditions (40% starved in a single year or population reaches 0)
    if (starvationRate > 0.4 || newState.population <= 0) {
      newState.gameOver = true;
    }
    
    // Update for next year
    newState.year += 1;
    newState.landPrice = calculateLandPrice();
    
    // Add to history
    newState.history = [...state.history, yearRecord];
    
    return newState;
  }
  
  // Validate player decisions
  export function validateDecisions(state: GameState, decisions: PlayerDecisions): string[] {
    const errors: string[] = [];
    
    // Validate land transactions
    const costToBuy = decisions.acresToBuy * state.landPrice;
    const maxBuyable = Math.floor(state.grain / state.landPrice);
    
    if (decisions.acresToBuy > 0 && decisions.acresToSell > 0) {
      errors.push("You cannot buy and sell land in the same year.");
    }
    
    if (decisions.acresToBuy > maxBuyable && state.landPrice > 0) {
      errors.push(`You can only afford to buy ${maxBuyable} acres.`);
    }
    
    if (decisions.acresToSell > state.land) {
      errors.push(`You only have ${state.land} acres to sell.`);
    }
    
    // Validate feeding
    if (decisions.grainToFeed > state.grain - costToBuy) {
      errors.push("You don't have enough grain to feed your people after buying land.");
    }
    
    // Validate planting
    const grainReservedForBuyingAndFeeding = costToBuy + decisions.grainToFeed;
    const grainAvailableForPlanting = state.grain - grainReservedForBuyingAndFeeding;
    const maxAcresCanPlantWithGrain = Math.floor(grainAvailableForPlanting * 2); // 1/2 bushel per acre
    const maxAcresBasedOnPopulation = maxAcresCanPlant(state.population);
    const landAfterTransactions = state.land + decisions.acresToBuy - decisions.acresToSell;
    
    if (decisions.acresToPlant > landAfterTransactions) {
      errors.push(`You cannot plant more acres than you own (${landAfterTransactions}).`);
    }
    
    if (decisions.acresToPlant > maxAcresBasedOnPopulation) {
      errors.push(`Your population can only plant up to ${maxAcresBasedOnPopulation} acres.`);
    }
    
    if (decisions.acresToPlant > maxAcresCanPlantWithGrain && grainAvailableForPlanting >= 0) {
      errors.push(`You only have enough grain to plant ${Math.max(0, maxAcresCanPlantWithGrain)} acres.`);
    }
    
    // Handle the case when the player doesn't have enough grain to feed and plant
    if (grainAvailableForPlanting < 0) {
      errors.push("You don't have enough grain for feeding and planting. Please adjust your decisions.");
    }
    
    return errors;
  }
  
  // Generate final score and message
  export function generateFinalScore(state: GameState): { score: number; message: string } {
    // Simple scoring system based on population, land, and grain
    const landScore = state.land / 10;
    const grainScore = state.grain / 100;
    const populationScore = state.population * 10;
    const totalScore = Math.floor(landScore + grainScore + populationScore);
    
    let message = "";
    
    if (state.population <= 0) {
      message = "Your entire population has died. Your rule has ended in disaster!";
      return { score: 0, message };
    }
    
    // Average starvation rate
    const totalStarved = state.history.reduce((sum, year) => sum + year.peopleStarved, 0);
    const avgStarvationRate = totalStarved / (state.year * 100); // Normalized to starting population of 100
    
    if (totalScore > 8000) {
      message = "Your rule was legendary! Songs will be sung of your wisdom for generations!";
    } else if (totalScore > 5000) {
      message = "Your brilliant leadership has made your city-state flourish!";
    } else if (totalScore > 3000) {
      message = "You ruled capably, and your people lived in relative prosperity.";
    } else if (totalScore > 1000) {
      message = "Your rule was adequate, but not particularly memorable.";
    } else {
      message = "Your poor leadership will be remembered as a dark time for your people.";
    }
    
    if (avgStarvationRate > 0.3) {
      message += " However, many people starved during your reign, tarnishing your legacy.";
    }
    
    return { score: totalScore, message };
  }