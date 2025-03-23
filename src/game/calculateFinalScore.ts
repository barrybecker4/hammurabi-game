import Constants  from './Constants';
import type { GameState } from './types';


/** 
 * Generate final score and message.
 * Simple scoring system based on population, land, and grain
 */
export function calculateFinalScore(state: GameState): { score: number; message: string } {
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
    const avgStarvationRate = totalStarved / (state.year * Constants.INITIAL_POPULATION); // Normalized to starting population
    
    if (totalScore > 8000) {
      message = "Your rule was legendary! Songs will be sung of your wisdom for generations!";
    } else if (totalScore > 5000) {
      message = "Your brilliant leadership has made your city-state flourish!";
    } else if (totalScore > 3000) {
      message = "You ruled capably, and your people lived in relative prosperity.";
    } else if (totalScore > 1000) {
      message = "Your rule was adequate, but not particularly memorable.";
    } else if (totalScore > 100) {
        message = "Your rule was not great. You barely scraped through.";
    } else {
      message = "Your poor leadership will be remembered as a dark time for your people.";
    }
    
    if (avgStarvationRate > 0.25) {
      message += " However, many people starved during your reign, tarnishing your legacy.";
    }
    
    return { score: totalScore, message };
}