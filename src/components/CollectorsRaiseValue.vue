<template>
<div>
<center>  <h2>{{ "MARKET" }}</h2> </center> <br>
  <div class="raise-value">
    <div v-for="(card, index) in market" :key="index">
        <CollectorsCard :card="card" :availableAction="card.available" @doAction="raiseValue(card)"/>
    </div>
  </div>
  <div>
    <div class="buttons" v-for="(p, index) in placement" :key="index">
      <button class="button" v-if="p.playerId===null" :disabled="cannotAfford(p.cost) || !isMyTurn()" @click="placeBottle(p)">
        ${{p.cost}}
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
    placement: Array
  },
  methods: {
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
  grid-template-columns: repeat(auto-fill, 130px);
  transform: scale(0.4)translate(-25%, 0);

}
.buttons {
  display: inline;
  margin: 10px;
  align-self: top;

}

.button {
  width: 90px;
  height: 50px;
  margin-top: -100px;

  color: black;
  text-transform:capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 20px;

  background: lightblue;
  border-radius: 20px;
  display: inline-block;
  border: none;
  transition: all 0.4s ease 0s;


}

.button:hover:enabled {
  text-shadow: 0px 0px 6px rgba(255, 255, 255, 1);
  -webkit-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
  -moz-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
  transition: all 0.4s ease 0.2s;
  background: #63b5cf;
  width: 110px;


}

button:disabled,
button[disabled]{
  color: grey;
  opacity: 0.5;
}

</style>
