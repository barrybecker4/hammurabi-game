import Constants  from './Constants';
import type { PlayerDecisions } from './types';
import { GameState } from './GameState';

// Validate player decisions
export function validateDecisions(state: GameState, decisions: PlayerDecisions): string[] {
    const errors: string[] = [];
    
    // Validate land transactions
    const costToBuyLand = decisions.acresToBuy * state.landPrice;
    const profitFromSellingLand = decisions.acresToSell * state.landPrice;
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
    if (decisions.grainToFeed > state.grain - costToBuyLand + profitFromSellingLand) {
      errors.push("You don't have enough grain to feed your people. Consider buying less, or selling more, land.");
    }
    
    // Validate planting
    const grainReservedForBuyingAndFeeding = costToBuyLand + decisions.grainToFeed;
    const grainAvailableForPlanting = state.grain - grainReservedForBuyingAndFeeding + profitFromSellingLand;
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

  // Calculate how many acres can be planted with the available population
function maxAcresCanPlant(population: number): number {
    return population * Constants.PLANT_ACRES_PER_PERSON;
  }