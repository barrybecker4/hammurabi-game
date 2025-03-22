<template>
    <div class="year-summary">
      <h2>The State of Your Kingdom - Year {{ gameState.year }}</h2>
      
      <div class="stats-container">
        <div class="stat-box">
          <h3>Population</h3>
          <div class="stat-value">{{ gameState.population }}</div>
          <div class="stat-detail" v-if="gameState.year > 1">
            <span v-if="gameState.peopleStarved > 0" class="negative">
              -{{ gameState.peopleStarved }} starved
            </span>
            <span v-if="gameState.plagueOccurred" class="negative">
              Plague!
            </span>
            <span v-if="gameState.peopleArrived > 0" class="positive">
              +{{ gameState.peopleArrived }} arrived
            </span>
          </div>
        </div>
        
        <div class="stat-box">
          <h3>Land</h3>
          <div class="stat-value">{{ gameState.land }} acres</div>
          <div class="stat-detail">
            <span>{{ gameState.landPrice }} bushels per acre</span>
          </div>
        </div>
        
        <div class="stat-box">
          <h3>Grain</h3>
          <div class="stat-value">{{ gameState.grain }} bushels</div>
        </div>
      </div>
      
      <div class="helper-info">
        <h3>Helpful Information</h3>
        <ul>
          <li>You need {{ population * 20 }} bushels to feed everyone</li>
          <li>Your people can farm up to {{ population * 10 }} acres</li>
          <li>Land currently costs {{ gameState.landPrice }} bushels per acre</li>
          <li>You can buy up to {{ Math.floor(gameState.grain / gameState.landPrice) }} acres</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  import type { GameState } from '../game/hammurabi';
  
  export default defineComponent({
    name: 'YearSummary',
    props: {
      gameState: {
        type: Object as () => GameState,
        required: true
      }
    },
    setup(props) {
      const population = computed(() => props.gameState.population);
      
      return {
        population
      };
    }
  });
  </script>
  
  <style scoped>
  .year-summary {
    background-color: #F5F5DC;
    border: 1px solid #DEB887;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  h2 {
    color: #8B4513;
    text-align: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #DEB887;
    padding-bottom: 10px;
  }
  
  .stats-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  
  .stat-box {
    flex: 1;
    text-align: center;
    padding: 15px;
    border: 1px solid #DEB887;
    border-radius: 6px;
    margin: 0 10px;
    background-color: #FFFAF0;
  }
  
  .stat-box h3 {
    margin-top: 0;
    color: #8B4513;
  }
  
  .stat-value {
    font-size: 1.8em;
    font-weight: bold;
    margin: 10px 0;
  }
  
  .stat-detail {
    font-size: 0.9em;
    min-height: 40px;
  }
  
  .positive {
    color: #2E8B57;
  }
  
  .negative {
    color: #B22222;
  }
  
  .helper-info {
    background-color: #FFFAF0;
    border: 1px solid #DEB887;
    border-radius: 6px;
    padding: 15px;
  }
  
  .helper-info h3 {
    margin-top: 0;
    color: #8B4513;
    border-bottom: 1px solid #DEB887;
    padding-bottom: 5px;
    margin-bottom: 10px;
  }
  
  .helper-info ul {
    margin: 0;
    padding-left: 20px;
  }
  
  .helper-info li {
    margin-bottom: 5px;
  }
  </style>