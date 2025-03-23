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

export interface PlayerDecisions {
  acresToBuy: number;
  acresToSell: number;
  grainToFeed: number;
  acresToPlant: number;
} 