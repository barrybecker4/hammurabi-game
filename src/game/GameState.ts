import Constants from './Constants';
import type { YearRecord } from './types';


  
export class GameState {

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

    constructor() {
        const initialLandPrice = this.calculateLandPrice();
        this.year = 0;
        this.population = Constants.INITIAL_POPULATION;
        this.grain = Constants.INITIAL_GRAIN;
        this.land = Constants.INITIAL_LAND;
        this.landPrice = initialLandPrice;
        this.peopleStarved = Constants.INITIAL_PEOPLE_STARVED;
        this.peopleArrived = Constants.INITIAL_PEOPLE_ARRIVED;
        this.plagueOccurred = false;
        this.gameOver = false;
        this.history = [];
    }

    static copy(state: GameState): GameState {
        const newState = new GameState();
        newState.year = state.year;
        newState.population = state.population;
        newState.grain = state.grain;
        newState.land = state.land;
        newState.landPrice = state.landPrice;
        newState.peopleStarved = state.peopleStarved;
        newState.peopleArrived = state.peopleArrived;
        newState.plagueOccurred = state.plagueOccurred;
        newState.gameOver = state.gameOver;
        return newState;
    }


    // Calculate how much grain is needed to feed the population
    grainNeededToFeed(population: number): number {
        return population * Constants.ANNUAL_PERSON_CONSUMPTION;
    }

    // Calculate random land price between 17 and 26 bushels per acre
    calculateLandPrice(): number {
        const diff = Constants.MAX_LAND_PRICE - Constants.MIN_LAND_PRICE;
        return Math.floor(Math.random() * diff) + Constants.MIN_LAND_PRICE;
    }

    // Calculate harvest yield (1-6 bushels per acre)
    calculateHarvest(): number {
        return Math.floor(Math.random() * Constants.MAX_GRAIN_YIELD_PER_ACRE) 
            + Constants.MIN_GRAIN_YIELD_PER_ACRE;
    }

    // Determine if plague occurs 
    checkPlague(): boolean {
        return Math.random() < Constants.CHANCE_OF_PLAGUE;
    }

    // Calculate grain lost to rats (0-10% chance, with 0-30% of grain lost)
    calculateRatLoss(grain: number): number {
        if (Math.random() < Constants.CHANCE_RATS_EAST_GRAIN) {
            const ratPercentage = Math.random() * Constants.MAX_RAT_CONSUMPTION;
            return Math.floor(grain * ratPercentage);
        }
        return 0;
    }

    // Calculate new immigrants (based on land and grain)
    calculateNewcomers(land: number, grain: number, starvationRate: number): number {
        if (starvationRate > 0) return 0;
        
        // Otherwise, a random number of people arrive based on available land and food
        const potential = Math.floor((land + grain / Constants.ANNUAL_PERSON_CONSUMPTION) / 100);
        return Math.max(0, Math.floor(Math.random() * 5) + potential);
    }

    // Calculate number of people who starve
    calculateStarvation(population: number, grainFed: number): number {
        const canFeed = Math.floor(grainFed / Constants.ANNUAL_PERSON_CONSUMPTION);
        return Math.max(0, population - canFeed);
    }
}
