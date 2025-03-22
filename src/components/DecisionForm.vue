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
      const decisions = ref<PlayerDecisions>({
        acresToBuy: 0,
        acresToSell: 0,
        grainToFeed: props.gameState.population * 20, // Default to feeding everyone
        acresToPlant: Math.min(
          props.gameState.land,
          props.gameState.population * 10,
          Math.floor((props.gameState.grain - (props.gameState.population * 20)) / 0.5)
        ) // Default to planting as much as possible after feeding
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
        const maxAcresBasedOnPopulation = props.gameState.population * 10;
        
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
    padding: 15px;
    margin-bottom: 20px;
  }
  
  .error-list h3 {
    color: #B71C1C;
    margin-top: 0;
    margin-bottom: 10px;
  }
  
  .error-list ul {
    margin: 0;
    padding-left: 20px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input[type="number"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #DEB887;
    border-radius: 4px;
    font-size: 1.1em;
  }
  
  .input-hint {
    font-size: 0.9em;
    color: #666;
    margin-top: 5px;
  }
  
  .summary-box {
    background-color: #FFFAF0;
    border: 1px solid #DEB887;
    border-radius: 6px;
    padding: 15px;
    margin: 20px 0;
  }
  
  .summary-box h3 {
    margin-top: 0;
    color: #8B4513;
    border-bottom: 1px solid #DEB887;
    padding-bottom: 5px;
    margin-bottom: 10px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  td {
    padding: 5px;
  }
  
  td:first-child {
    font-weight: bold;
    width: 40%;
  }
  
  .total-row {
    border-top: 1px solid #DEB887;
    font-weight: bold;
  }
  
  .positive {
    color: #2E8B57;
  }
  
  .negative {
    color: #B22222;
  }
  
  .submit-button {
    display: block;
    width: 100%;
    background-color: #8B4513;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 12px;
    font-size: 1.2em;
    cursor: pointer;
    margin-top: 20px;
  }
  
  .submit-button:hover {
    background-color: #A0522D;
  }
  </style>