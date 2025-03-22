<template>
    <div class="game-over">
      <h2>Your Rule Has Ended</h2>
      
      <div class="scroll">
        <div class="parchment">
          <h3>The Chronicle of Hammurabi</h3>
          
          <p class="intro">After governing Sumer for {{ gameState.year - 1 }} years, your reign has come to an end.</p>
          
          <div class="final-stats">
            <div class="stat">
              <span class="stat-label">Final Population:</span>
              <span class="stat-value">{{ gameState.population }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Land Holdings:</span>
              <span class="stat-value">{{ gameState.land }} acres</span>
            </div>
            <div class="stat">
              <span class="stat-label">Grain Stores:</span>
              <span class="stat-value">{{ gameState.grain }} bushels</span>
            </div>
          </div>
          
          <div class="game-score">
            <h3>Your Final Score: {{ finalScore.score }}</h3>
          </div>
          
          <p class="verdict">{{ finalScore.message }}</p>
          
          <div class="stats-summary">
            <h4>History of Your Reign</h4>
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Population</th>
                  <th>Land</th>
                  <th>Harvest</th>
                  <th>Starved</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in gameState.history" :key="record.year">
                  <td>{{ record.year }}</td>
                  <td>{{ record.population }}</td>
                  <td>{{ record.landOwned }}</td>
                  <td>{{ record.grainHarvested }}</td>
                  <td>{{ record.peopleStarved }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <button class="play-again-button" @click="$emit('restart')">Rule Again</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import type { GameState } from '../game/hammurabi';
  
  export default defineComponent({
    name: 'GameOver',
    props: {
      gameState: {
        type: Object as () => GameState,
        required: true
      },
      finalScore: {
        type: Object as () => { score: number; message: string },
        required: true
      }
    },
    emits: ['restart']
  });
  </script>
  
  <style scoped>
  .game-over {
    padding: 20px;
    text-align: center;
  }
  
  h2 {
    color: #8B4513;
    margin-bottom: 30px;
    font-size: 2em;
  }
  
  .scroll {
    max-width: 700px;
    margin: 0 auto 30px;
    background-color: #D2B48C;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  .parchment {
    background-color: #F5F5DC;
    padding: 30px;
    border-radius: 5px;
    position: relative;
  }
  
  .parchment::before, .parchment::after {
    content: "";
    position: absolute;
    height: 30px;
    border-left: 1px solid #D2B48C;
  }
  
  .parchment::before {
    left: 40px;
    top: -10px;
  }
  
  .parchment::after {
    right: 40px;
    top: -10px;
  }
  
  h3 {
    color: #8B4513;
    margin-top: 0;
    font-size: 1.6em;
    text-align: center;
    border-bottom: 2px solid #D2B48C;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
  
  .intro {
    font-size: 1.2em;
    margin-bottom: 20px;
    text-align: center;
    font-style: italic;
  }
  
  .final-stats {
    display: flex;
    justify-content: space-around;
    margin: 30px 0;
  }
  
  .stat {
    text-align: center;
  }
  
  .stat-label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #8B4513;
  }
  
  .stat-value {
    font-size: 1.5em;
  }
  
  .game-score {
    background-color: #FFF8E1;
    border: 2px solid #FFB300;
    border-radius: 10px;
    padding: 15px;
    margin: 30px 0;
  }
  
  .game-score h3 {
    border-bottom: none;
    margin: 0;
    padding: 0;
    color: #B71C1C;
  }
  
  .verdict {
    font-size: 1.2em;
    font-style: italic;
    margin-bottom: 30px;
    text-align: center;
    line-height: 1.6;
  }
  
  .stats-summary {
    margin-top: 30px;
  }
  
  .stats-summary h4 {
    color: #8B4513;
    margin-bottom: 15px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  th, td {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #D2B48C;
  }
  
  th {
    background-color: #D2B48C;
    color: #fff;
  }
  
  tr:nth-child(even) {
    background-color: #FFF8DC;
  }
  
  .play-again-button {
    background-color: #8B4513;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 12px 30px;
    font-size: 1.2em;
    cursor: pointer;
    margin-top: 20px;
    transition: background-color 0.3s;
  }
  
  .play-again-button:hover {
    background-color: #A0522D;
  }
  </style>