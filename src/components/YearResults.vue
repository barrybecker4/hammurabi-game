<template>
    <div class="year-results">
      <div class="result-section">
        <h3>Your Decisions</h3>
        <div class="result-grid">
          <div class="result-item">
            <div class="label">Land Bought:</div>
            <div class="value">{{ yearRecord.acresBought }} acres</div>
          </div>
          <div class="result-item">
            <div class="label">Land Sold:</div>
            <div class="value">{{ yearRecord.acresSold }} acres</div>
          </div>
          <div class="result-item">
            <div class="label">Grain Used for Food:</div>
            <div class="value">{{ yearRecord.grainFed }} bushels</div>
          </div>
          <div class="result-item">
            <div class="label">Acres Planted:</div>
            <div class="value">{{ yearRecord.acresPlanted }} acres</div>
          </div>
        </div>
      </div>
      
      <div class="result-section">
        <h3>Harvest Results</h3>
        <div class="result-grid">
          <div class="result-item">
            <div class="label">Yield Per Acre:</div>
            <div class="value">{{ yearRecord.grainPerAcre }} bushels</div>
          </div>
          <div class="result-item">
            <div class="label">Total Harvested:</div>
            <div class="value">{{ yearRecord.grainHarvested }} bushels</div>
          </div>
          <div class="result-item">
            <div class="label">Grain Lost to Rats:</div>
            <div class="value">{{ yearRecord.grainEatenByRats }} bushels</div>
          </div>
        </div>
      </div>
      
      <div class="result-section">
        <h3>Population Changes</h3>
        <div class="result-grid">
          <div class="result-item" :class="{ 'negative-event': yearRecord.peopleStarved > 0 }">
            <div class="label">People Starved:</div>
            <div class="value">{{ yearRecord.peopleStarved }} people</div>
          </div>
          <div class="result-item" :class="{ 'negative-event': yearRecord.plagueOccurred }">
            <div class="label">Plague:</div>
            <div class="value">{{ yearRecord.plagueOccurred ? 'Yes! Half your population died!' : 'No' }}</div>
          </div>
          <div class="result-item" :class="{ 'positive-event': yearRecord.peopleArrived > 0 }">
            <div class="label">New Arrivals:</div>
            <div class="value">{{ yearRecord.peopleArrived }} people</div>
          </div>
        </div>
      </div>
      
      <div class="noble-message">
        <p v-if="yearRecord.peopleStarved > 0" class="message severe">
          O noble Hammurabi! {{ yearRecord.peopleStarved }} of your people starved during this year!
        </p>
        <p v-if="yearRecord.plagueOccurred" class="message severe">
          A terrible plague has struck! Half of your population has perished!
        </p>
        <p v-else-if="yearRecord.peopleStarved === 0 && yearRecord.grainPerAcre > 3" class="message positive">
          The gods have blessed you with a bountiful harvest and all your people are well fed.
        </p>
        <p v-else-if="yearRecord.peopleStarved === 0" class="message">
          Your people have survived another year under your rule.
        </p>
        <p v-if="yearRecord.peopleArrived > 0" class="message positive">
          Your fame has spread! {{ yearRecord.peopleArrived }} new citizens have come to live under your rule.
        </p>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import type { YearRecord } from '../game/hammurabi';
  
  export default defineComponent({
    name: 'YearResults',
    props: {
      yearRecord: {
        type: Object as () => YearRecord,
        required: true
      }
    }
  });
  </script>
  
  <style scoped>
  .year-results {
    padding: 10px;
  }
  
  .result-section {
    margin-bottom: 25px;
  }
  
  h3 {
    color: #8B4513;
    border-bottom: 1px solid #DEB887;
    padding-bottom: 5px;
    margin-bottom: 15px;
  }
  
  .result-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .result-item {
    background-color: #FFFAF0;
    border: 1px solid #DEB887;
    border-radius: 4px;
    padding: 12px;
  }
  
  .negative-event {
    background-color: #FFEBEE;
    border-color: #D32F2F;
  }
  
  .positive-event {
    background-color: #E8F5E9;
    border-color: #388E3C;
  }
  
  .label {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .value {
    font-size: 1.2em;
  }
  
  .noble-message {
    margin-top: 30px;
    padding: 15px;
    background-color: #FFF8E1;
    border: 1px solid #FFB300;
    border-radius: 8px;
    font-style: italic;
  }
  
  .message {
    margin: 10px 0;
    font-size: 1.1em;
  }
  
  .message.severe {
    color: #B71C1C;
    font-weight: bold;
  }
  
  .message.positive {
    color: #2E7D32;
  }
  </style>