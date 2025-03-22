<template>
    <div class="game-intro">
      <h2>Welcome to Ancient Sumer</h2>
      
      <div class="intro-text">
        <p>Greetings, mighty Hammurabi! The gods have appointed you as ruler of Sumer in the year 1700 BCE.</p>
        
        <h3>Your tasks are to:</h3>
        <ul>
          <li>Distribute food to your people</li>
          <li>Decide how many acres to plant with grain each year</li>
          <li>Trade land to boost your economy</li>
        </ul>
        
        <h3>Watch out for:</h3>
        <ul>
          <li>Rats that might eat your grain stores</li>
          <li>Plagues that can decimate your population</li>
          <li>Variable harvests - from 1 to 6 bushels per acre</li>
          <li>Fluctuating land prices - between 17 and 26 bushels per acre</li>
        </ul>
        
        <h3>Starting Resources:</h3>
        <ul>
          <li>Population: 100 people</li>
          <li>Land: 1000 acres</li>
          <li>Grain: 2800 bushels</li>
        </ul>
        
        <h3>Remember:</h3>
        <ul>
          <li>Each person needs 20 bushels of grain per year to survive</li>
          <li>Each person can farm at most 10 acres</li>
          <li>It takes 1/2 bushel of grain to plant an acre</li>
        </ul>
        
        <p class="warning">If more than 40% of your people starve in a single year, the people will revolt and your rule will end!</p>
      </div>
      
      <button class="start-button" @click="$emit('start-game')">Begin Your Rule</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  export default defineComponent({
    name: 'GameIntro',
    emits: ['start-game']
  });
  </script>
  
  <style scoped>
  .game-intro {
    background-color: #FFFAF0;
    border: 1px solid #DEB887;
    border-radius: 8px;
    padding: 30px;
    margin-bottom: 20px;
  }
  
  h2 {
    color: #8B4513;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .intro-text {
    text-align: left;
    margin-bottom: 30px;
    line-height: 1.6;
  }
  
  ul {
    margin-bottom: 20px;
  }
  
  li {
    margin-bottom: 8px;
  }
  
  .warning {
    color: #B22222;
    font-weight: bold;
    margin: 20px 0;
  }
  
  .start-button {
    display: block;
    margin: 0 auto;
    background-color: #8B4513;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 12px 30px;
    font-size: 1.2em;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .start-button:hover {
    background-color: #A0522D;
  }
  </style>