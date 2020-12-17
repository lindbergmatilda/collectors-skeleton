<template>
<div>

  <center>
    <div class="popupSkill" @click='helpSkill()'>   ?   <span class="skillhelp-text" id="SkillPopup"> {{labels.skillHelp}} <img src="/images/skillInfo.png" > </span>

    </div>
    <h2>{{ "SKILL" }}</h2>
  </center>
  <div class="item-left-right">

    <div class="left buy-skill">
      <div v-for="(card, index) in skillsOnSale" :key="index">
        <CollectorsCard :card="card" :availableAction="card.available" @doAction="buySkill(card)" />
      </div>
    </div>

    <div class="right buttons">
      <div v-for="(p, index) in placement" :key="index">
        <button class="button" v-if="p.playerId===null" :disabled="cannotAfford(p.cost) || !isMyTurn() || auctionRunning" @click="placeBottle(p)">
          ${{p.cost}}
        </button>
        <div v-if="p.playerId !== null">
          {{p.playerId}}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsBuySkill',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    skillsOnSale: Array,
    placement: Array,
    auctionRunning: Boolean
  },
  methods: {

    helpSkill: function() {
      var popupSkill = document.getElementById('SkillPopup');
      popupSkill.classList.toggle('show');

    },
    cannotAfford: function(cost) {
      let minCost = 100;
      if (cost < minCost) {
        minCost = cost
      }
      return (this.player.money < minCost);
    },

    cardCost: function(card) {
      return card.cost
    },

    isMyTurn: function() {
      if(this.player.myTurn){
        return true;
      }
        return false;
    },

    placeBottle: function(p) {
      this.$emit('placeBottle', p.cost);
      this.highlightAvailableCards(p.cost);
      console.log(" kostnaden är " + p.cost);
    },

    highlightAvailableCards: function(cost = 100) {
      for (let i = 0; i < this.skillsOnSale.length; i += 1) {
        this.$set(this.skillsOnSale[i], "available", true);
      }
      this.chosenPlacementCost = cost;
    },

    buySkill: function(card) {
      if (card.available) {
        console.log("hejsan buyskill funkar");
        this.$emit('buySkill', card)
        this.highlightAvailableCards()
      }
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.item-left-right {
  display: grid;
  grid-template-areas: 'left right';
  grid-template-columns: 190px 1fr;
  grid-template-rows: 1fr;


}

.buttons {
  width: 70px;
  display: grid;
  padding-top: 50px;
  grid-template-rows: repeat(auto-fill, 130px);



}

.button {
  width: 90px;
  height: 50px;

  color: black;
  text-transform:capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 20px;

  background: lightgreen;
  border-radius: 20px;
  border: none;
  transition: all 0.4s ease 0s;


}

.button:hover:enabled {
  text-shadow: 0px 0px 6px rgba(255, 255, 255, 1);
  -webkit-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
  -moz-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
  transition: all 0.4s ease 0.2s;
  background: #2eb82e;
  width: 110px;


}

button:disabled,
button[disabled]{
  color: grey;
  opacity: 0.5;
}


.left {
  grid-area: left;


}

.right {
  grid-area: right;
}

.buy-skill {
  display: grid;
  grid-template-rows: repeat(auto-fill, 300px);
  transform: scale(0.4)translate(-25%, 0);
  transform-origin: top;
}

.popupSkill {
  left: -130px;
  position: relative;
    text-align: center;
    background-color: #BCDBEA;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 19px;
    line-height: 26px;
    cursor: default;
    margin: 10px;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

}

.popupSkill:hover{
  font-size: 30px;
}

.popupSkill .skillhelp-text {

    visibility: hidden;

    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 10px;
    border: 2px solid black;
    padding: 8px 0;
    position: fixed;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-left: -60px;
    font-size: 15px;
    max-width: 80%;
}

.popupSkill .skillhelp-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;

}

.popupSkill .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}


</style>
