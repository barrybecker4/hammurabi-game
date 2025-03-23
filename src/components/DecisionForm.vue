<template>
    <div class="decision-form">
      <div v-if="errors.length > 0" class="error-list">
        <h3>Please correct the following errors:</h3>
        <ul>
          <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
        </ul>
      </div>
      
      <form @submit.prevent="submitDecisions">
        <div class="form-group">
          <label for="buy-land">How many acres do you wish to buy? ({{ gameState.landPrice }} bushels per acre)</label>
          <input 
            type="number" 
            id="buy-land" 
            v-model.number="decisions.acresToBuy" 
            min="0" 
            :max="Math.floor(gameState.grain / gameState.landPrice)"
            :disabled="decisions.acresToSell > 0"
          >
          <div class="input-hint">
            Cost: {{ decisions.acresToBuy * gameState.landPrice }} bushels
          </div>
        </div>
        
        <div class="form-group">
          <label for="sell-land">How many acres do you wish to sell? ({{ gameState.landPrice }} bushels per acre)</label>
          <input 
            type="number" 
            id="sell-land" 
            v-model.number="decisions.acresToSell" 
            min="0" 
            :max="gameState.land"
            :disabled="decisions.acresToBuy > 0"
          >
          <div class="input-hint">
            Revenue: {{ decisions.acresToSell * gameState.landPrice }} bushels
          </div>
        </div>
        
        <div class="form-group">
          <label for="feed-people">How many bushels to use for feeding your people?</label>
          <input 
            type="number" 
            id="feed-people" 
            v-model.number="decisions.grainToFeed" 
            min="0" 
            :max="grainAfterLandTransactions"
          >
          <div class="input-hint">
            This will feed up to {{ Math.floor(decisions.grainToFeed / 20) }} people 
            (Recommended: {{ gameState.population * 20 }} bushels to feed all {{ gameState.population }} people)
          </div>
        </div>
        
        <div class="form-group">
          <label for="plant-acres">How many acres do you wish to plant with grain?</label>
          <input 
            type="number" 
            id="plant-acres" 
            v-model.number="decisions.acresToPlant" 
            min="0" 
            :max="maxAcresCanPlant"
          >
          <div class="input-hint">
            Requires {{ Math.ceil(decisions.acresToPlant / 2) }} bushels of grain to plant
            (Limited by: available grain, population, and land)
          </div>
        </div>
        
        <div class="summary-box">
          <h3>Decision Summary</h3>
          <table>
            <tbody>
              <tr>
                <td>Current grain:</td>
                <td>{{ gameState.grain }} bushels</td>
              </tr>
              <tr>
                <td>Land transactions:</td>
                <td>
                  <span v-if="decisions.acresToBuy > 0" class="negative">
                    -{{ decisions.acresToBuy * gameState.landPrice }} bushels
                  </span>
                  <span v-if="decisions.acresToSell > 0" class="positive">
                    +{{ decisions.acresToSell * gameState.landPrice }} bushels
                  </span>
                </td>
              </tr>
              <tr>
                <td>Feeding cost:</td>
                <td class="negative">-{{ decisions.grainToFeed }} bushels</td>
              </tr>
              <tr>
                <td>Planting cost:</td>
                <td class="negative">-{{ Math.ceil(decisions.acresToPlant / 2) }} bushels</td>
              </tr>
              <tr class="total-row">
                <td>Remaining grain:</td>
                <td :class="{ negative: remainingGrain < 0 }">{{ remainingGrain }} bushels</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <button type="submit" class="submit-button">Make It So</button>
      </form>
    </div>
  </template>
  
  <script lang="ts">
  import Constants from '../game/Constants';
  import { defineComponent, ref, computed } from 'vue';
  import type { GameState, PlayerDecisions } from '../game/hammurabi';
  
  export default defineComponent({
    name: 'DecisionForm',
    props: {
      gameState: {
        type: Object as () => GameState,
        required: true
      },
      errors: {
        type: Array as () => string[],
        default: () => []
      }
    },
    emits: ['submit-decisions'],
    setup(props, { emit }) {

      // Default to planting as much as possible after feeding
      const acresToPlant = Math.min(
          props.gameState.land,
          props.gameState.population * Constants.PLANT_ACRES_PER_PERSON,
          Math.floor((props.gameState.grain - (props.gameState.population * Constants.ANNUAL_PERSON_CONSUMPTION)) / 0.5)
      );
      const decisions = ref<PlayerDecisions>({
        acresToBuy: 0,
        acresToSell: 0,
        grainToFeed: props.gameState.population * Constants.ANNUAL_PERSON_CONSUMPTION, // Default to feeding everyone
        acresToPlant
      });
      
      const grainAfterLandTransactions = computed(() => {
        return props.gameState.grain - 
          (decisions.value.acresToBuy * props.gameState.landPrice) + 
          (decisions.value.acresToSell * props.gameState.landPrice);
      });
      
      const landAfterTransactions = computed(() => {
        return props.gameState.land + decisions.value.acresToBuy - decisions.value.acresToSell;
      });
      
      const grainForPlanting = computed(() => {
        return Math.ceil(decisions.value.acresToPlant / 2);
      });
      
      const maxAcresCanPlant = computed(() => {
        const grainAvailableForPlanting = grainAfterLandTransactions.value - decisions.value.grainToFeed;
        const maxAcresBasedOnGrain = Math.floor(grainAvailableForPlanting * 2);
        const maxAcresBasedOnPopulation = props.gameState.population * Constants.PLANT_ACRES_PER_PERSON;
        
        return Math.min(
          landAfterTransactions.value,
          maxAcresBasedOnGrain,
          maxAcresBasedOnPopulation
        );
      });
      
      const remainingGrain = computed(() => {
        return grainAfterLandTransactions.value - 
          decisions.value.grainToFeed - 
          grainForPlanting.value;
      });
      
      function submitDecisions() {
        emit('submit-decisions', { ...decisions.value });
      }
      
      return {
        decisions,
        grainAfterLandTransactions,
        grainForPlanting,
        maxAcresCanPlant,
        remainingGrain,
        submitDecisions
      };
    }
  });
  </script>
  
  <style scoped>
  .decision-form {
    padding: 10px;
  }
  
  .error-list {
    background-color: #FFEBEE;
    border: 1px solid #D32F2F;
    border-radius: 4px;
    padding: 5px;
    margin-bottom: 10px;
    text-align: left;
  }
  
  .error-list h3 {
    color: #B71C1C;
    margin-top: 0;
    margin-bottom: 10px;
  }
  
  .error-list ul {
    margin: 0;
    padding-left: 10;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input[type="number"] {
    width: 100%;
    padding: 6px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 1.1em;
  }
  
  .input-hint {
    font-size: 0.9em;
    color: var(--text-muted);
    margin-top: 5px;
  }
  
  .summary-box {
    background-color: var(--background-light);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 5px;
    margin: 20px 0;
  }
  
  .summary-box h3 {
    color: var(--primary-color);
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 5px;
    margin-bottom: 10px;
    margin-top: 0;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  tbody tr:not(.total-row) td {
    padding: 5px 0;
    border-bottom: 1px solid var(--border-color);
  }
  
  .total-row {
    font-weight: bold;
    border-top: 2px solid var(--border-color);
  }
  
  .total-row td {
    padding-top: 10px;
  }
  
  .positive {
    color: var(--positive-color);
  }
  
  .negative {
    color: var(--negative-color);
  }
  
  .submit-button {
    border-radius: 8px;
    border: 1px solid var(--border-color);
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.25s;
    background-color: var(--background-light);
    margin-top: 20px;
    width: 100%;
  }
  
  .submit-button:hover {
    background-color: var(--background-lighter);
    border-color: var(--primary-color);
  }
  </style>