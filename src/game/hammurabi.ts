import Constants  from './Constants';
import type { GameState, YearRecord, PlayerDecisions } from './types';

export function initializeGame(): GameState {
  const initialLandPrice = calculateLandPrice();
  
  return {
    year: 0,
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

// Calculate how much grain is needed to feed the population
export function grainNeededToFeed(population: number): number {
  return population * Constants.ANNUAL_PERSON_CONSUMPTION;
}

// Calculate random land price between 17 and 26 bushels per acre
export function calculateLandPrice(): number {
  const diff = Constants.MAX_LAND_PRICE - Constants.MIN_LAND_PRICE;
  return Math.floor(Math.random() * diff) + Constants.MIN_LAND_PRICE;
}

// Calculate harvest yield (1-6 bushels per acre)
export function calculateHarvest(): number {
  return Math.floor(Math.random() * Constants.MAX_GRAIN_YIELD_PER_ACRE) 
      + Constants.MIN_GRAIN_YIELD_PER_ACRE;
}

// Determine if plague occurs 
export function checkPlague(): boolean {
  return Math.random() < Constants.CHANCE_OF_PLAGUE;
}

// Calculate grain lost to rats (0-10% chance, with 0-30% of grain lost)
export function calculateRatLoss(grain: number): number {
  if (Math.random() < Constants.CHANCE_RATS_EAST_GRAIN) {
    const ratPercentage = Math.random() * Constants.MAX_RAT_CONSUMPTION;
    return Math.floor(grain * ratPercentage);
  }
  return 0;
}

// Calculate new immigrants (based on land and grain)
export function calculateNewcomers(land: number, grain: number, starvationRate: number): number {
  if (starvationRate > 0) return 0;
  
  // Otherwise, a random number of people arrive based on available land and food
  const potential = Math.floor((land + grain / Constants.ANNUAL_PERSON_CONSUMPTION) / 100);
  return Math.max(0, Math.floor(Math.random() * 5) + potential);
}

// Calculate number of people who starve
export function calculateStarvation(population: number, grainFed: number): number {
  const canFeed = Math.floor(grainFed / Constants.ANNUAL_PERSON_CONSUMPTION);
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
  
  newState.year += 1;
  // Check game over conditions (40% starved in a single year or population reaches 0)
  if (starvationRate > Constants.MAX_STARVATION_RATE || newState.population <= 0 || newState.year > Constants.MAX_YEARS) {
    newState.gameOver = true;
  }
  
  newState.landPrice = calculateLandPrice();
  
  // Add to history
  newState.history = [...state.history, yearRecord];
  
  return newState;
}

