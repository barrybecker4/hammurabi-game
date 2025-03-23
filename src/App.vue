<template>
    <div class="hammurabi-game">
      <header>
        <h1>The Hammurabi Game</h1>
        <p>Rule the ancient city-state of Sumer wisely, O mighty Hammurabi!</p>
      </header>
  
      <GameIntro v-if="showIntro" @start-game="startGame" />
  
      <template v-else>
        <div v-if="!gameState.gameOver">
          <YearSummary :game-state="gameState" />
          
          <div class="decision-panel" v-if="!yearProcessed">
            <h2>Year {{ gameState.year }} - Make Your Decisions</h2>
            <DecisionForm 
              :game-state="gameState" 
              :errors="validationErrors"
              @submit-decisions="processDecisions" 
            />
          </div>
          
          <div class="year-results" v-else>
            <h2>Results of Year {{ gameState.year - 1 }}</h2>
            <YearResults :year-record="gameState.history[gameState.history.length - 1]" />
            <button class="continue-button" @click="startNextYear">Continue to Year {{ gameState.year }}</button>
          </div>
        </div>
  
        <GameOver 
          v-else 
          :game-state="gameState" 
          :final-score="finalScore"
          @restart="showIntro = true" 
        />
      </template>
  
      <footer>
        <button class="restart-button" @click="showIntro = true">Restart Game</button>
      </footer>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';
  import GameIntro from './components/GameIntro.vue';
  import YearSummary from './components/YearSummary.vue';
  import DecisionForm from './components/DecisionForm.vue';
  import YearResults from './components/YearResults.vue';
  import GameOver from './components/GameOver.vue';
  import { 
    initializeGame, 
    processYear, 
    validateDecisions,
  } from './game/hammurabi';
  import { 
    calculateFinalScore
  } from './game/calculateFinalScore';
  import type { GameState, PlayerDecisions } from './game/hammurabi';
  
  export default defineComponent({
    name: 'App',
    components: {
      GameIntro,
      YearSummary,
      DecisionForm,
      YearResults,
      GameOver
    },
    setup() {
      const showIntro = ref(true);
      const gameState = ref<GameState>(initializeGame());
      const yearProcessed = ref(false);
      const validationErrors = ref<string[]>([]);
      const finalScore = ref({ score: 0, message: '' });
  
      function startGame() {
        gameState.value = initializeGame();
        showIntro.value = false;
        yearProcessed.value = false;
        validationErrors.value = [];
      }
  
      function processDecisions(decisions: PlayerDecisions) {
        validationErrors.value = validateDecisions(gameState.value, decisions);
        
        if (validationErrors.value.length === 0) {
          gameState.value = processYear(gameState.value, decisions);
          yearProcessed.value = true;
          
          if (gameState.value.gameOver) {
            finalScore.value = calculateFinalScore(gameState.value);
          }
        }
      }
  
      function startNextYear() {
        yearProcessed.value = false;
      }
  
      return {
        showIntro,
        gameState,
        yearProcessed,
        validationErrors,
        finalScore,
        startGame,
        processDecisions,
        startNextYear
      };
    }
  });
  </script>
  
  <style>
  .hammurabi-game {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Palatino', serif;
  }
  
  header {
    text-align: center;
    margin-bottom: 30px;
  }
  
  header h1 {
    font-size: 2.5em;
    color: #8B4513;
  }
  
  .decision-panel, .year-results {
    background-color: #FFFAF0;
    border: 1px solid #DEB887;
    border-radius: 8px;
    padding: 20px;
    margin-top: 20px;
  }
  
  .continue-button {
    margin-top: 20px;
    background-color: #8B4513;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 1.1em;
    cursor: pointer;
  }
  
  .continue-button:hover {
    background-color: #A0522D;
  }
  
  .restart-button {
    margin-top: 30px;
    background-color: #5F9EA0;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
  }
  
  footer {
    text-align: center;
    margin-top: 30px;
  }
  </style>+
