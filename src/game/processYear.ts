import Constants from './Constants';
import { GameState } from './GameState';
import type { PlayerDecisions, YearRecord } from './types';


// Process player decisions and update game state
export function processYear(state: GameState, decisions: PlayerDecisions): GameState {
    const newState: GameState = GameState.copy(state);
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
    const harvestPerAcre = state.calculateHarvest();
    const harvestedGrain = decisions.acresToPlant * harvestPerAcre;
    newState.grain += harvestedGrain;
    yearRecord.grainHarvested = harvestedGrain;
    yearRecord.grainPerAcre = harvestPerAcre;
    
    // Process rats
    const grainEatenByRats = state.calculateRatLoss(newState.grain);
    newState.grain -= grainEatenByRats;
    yearRecord.grainEatenByRats = grainEatenByRats;
    
    // Calculate starvation
    const starved = state.calculateStarvation(newState.population, decisions.grainToFeed);
    newState.peopleStarved = starved;
    yearRecord.peopleStarved = starved;
    
    // Update population after starvation
    newState.population -= starved;
    
    // Check for plague
    const plague = state.checkPlague();
    newState.plagueOccurred = plague;
    yearRecord.plagueOccurred = plague;
    
    if (plague) {
      // Half the population dies in a plague
      newState.population = Math.floor(newState.population / 2);
    }
    
    // Calculate new arrivals
    const starvationRate = starved > 0 ? starved / state.population : 0;
    const newArrivals = state.calculateNewcomers(newState.land, newState.grain, starvationRate);
    newState.peopleArrived = newArrivals;
    yearRecord.peopleArrived = newArrivals;
    
    // Update population with new arrivals
    newState.population += newArrivals;
    
    newState.year += 1;
    // Check game over conditions (40% starved in a single year or population reaches 0)
    if (starvationRate > Constants.MAX_STARVATION_RATE || newState.population <= 0 || newState.year > Constants.MAX_YEARS) {
      newState.gameOver = true;
    }
    
    newState.landPrice = state.calculateLandPrice();
    
    // Add to history
    newState.history = [...state.history, yearRecord];
    
    return newState;
  }
  
  