<template>
<div>
  <div class="popupValue" @click='helpValue()'>   ?   <span class="valuehelp-text" id="ValuePopup"> Här kommer hjälptext :) </span>

  </div>
<center>  <h2>{{ "MARKET" }}</h2> </center> <br>
  <div class="raise-value">
    <div v-for="(card, index) in market" :key="index">
        <CollectorsCard :card="card" :availableAction="card.available" @doAction="raiseValue(card)"/>
    </div>
  </div>
  <div>
    <div class="buttons" v-for="(p, index) in placement" :key="index">
      <button class="button" v-if="p.playerId===null" :disabled="cannotAfford(p.cost) || !isMyTurn() || auctionRunning" @click="placeBottle(p)">
        <p v-if= "p.cost<0">
        +${{gainMoney(p.cost)}}
      </p>
      <p v-else-if= "p.cost==0">
        ${{p.cost}}
      </p>
        <p v-else>
          -${{p.cost}}
        </p>
      </button>
      <div v-if="p.playerId !== null">
        {{p.playerId}}
      </div>
    </div>
  </div>
</div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsRaiseValue',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    market: Array,
    marketValues: Object,
    placement: Array,
    auctionRunning: Boolean
  },
  methods: {
    helpValue: function() {
      var popupValue = document.getElementById('ValuePopup');
      popupValue.classList.toggle('show');

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

    placeBottle: function(p) {
      this.$emit('placeBottle', p);
      if(p.position != 2){
        this.highlightAvailableCards(p.cost);
      }
      else{
        let card = null;
        this.$emit('raiseValue', card);
      }
    },


    isMyTurn: function() {
      if(this.player.myTurn){
        return true;
      }
        return false;
    },

    highlightAvailableCards: function(cost = 100) {
      for (let i = 0; i < this.player.hand.length; i += 1) {
        this.$set(this.player.hand[i], "available", true);
      }
      this.chosenPlacementCost = cost;
    },

    gainMoney: function(money) {
      money = money*-1;
      return money;
    },

    raiseValue: function(card) {
      if (card.available) {
        this.$emit('raiseValue', card)
        this.highlightAvailableCards()
      }
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.raise-value {
  display: grid;
  grid-template-columns: repeat(auto-fill, 5.625em); /* 90/16 */
  transform: scale(0.4)translate(-25%, 0);

}
.buttons {
  display: inline;
  align-self: top;
    padding-left: 1.875em; /* 30/16 */
    display: inline-block;

}

.button {
  width: 4.625em; /* 90/16 */
  height: 3.125em; /* 50/16 */
margin: 0.075em; /* 6/16 */
  color: black;
  text-transform:capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 1.25em; /* 20/16 */

  background: lightblue;
  border-radius: 1.25em; /* 20/16 */
  border: none;
  transition: all 0.4s ease 0s;


}

.button:hover:enabled {
  text-shadow: 0em 0em 0.375em rgba(255, 255, 255, 1); /* 0/16, 0/16, 6/16 */
  -webkit-box-shadow: 0em 0.313em 2.5em -0.625em rgba(0,0,0,0.57); /* 0/16, 5/16, 40/16, -10/16 */
  -moz-box-shadow: 0em 0.313em 2.5em -0.625em rgba(0,0,0,0.57); /* 0/16, 5/16, 40/16, -10/16 */
  transition: all 0.4s ease 0.2s;
  background: #63b5cf;
  width: 5.875em; /* 110/16 */



}

button:disabled,
button[disabled]{
  color: grey;
  opacity: 0.5;
}

.popupValue {
  position: absolute;
    text-align: center;
    background-color: #BCDBEA;
    color: white;
    border-radius: 50%;
    width: 1.5em; /* 24/16 */
    height: 1.5em; /* 24/16 */
    font-size: 1.188em; /* 19/16 */
    line-height: 1.625em; /* 26/16 */
    cursor: default;
    margin: 0.625em; /* 10/16 */

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

}

.popupValue:hover{
  font-size: 1.3em; /* 30/16 */
  cursor: pointer;
  background-color: #5F9EA0;
  transition: all 0.4s ease 0.2s;
}

.popupValue .valuehelp-text {

    visibility: hidden;
    width: 10em; /* 160/16 */
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 0.375em; /* 6/16 */
    padding: 0.5em 0; /* 8/16 */
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -3.75em; /* -60/16 */
    font-size: 0.938em; /* 15/16 */

}

.popupValue .valuehelp-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -0.313em; /* -5/16 */
  border-width: 0.313em; /* 5/16 */
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.popupValue .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}

</style>
