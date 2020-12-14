<template>
<div>
  <center><h2>{{ "ITEM" }}</h2></center>
<div class="item-placement">
<div class="upper-grid">
  <div class="buy-item">
    <div v-for="(card, index) in itemsOnSale" :key="index">
      <CollectorsCard :card="card" :availableAction="card.available" @doAction="buyItem(card)" />
      {{ ItemCost(card) }}
    </div>
  </div>
</div>
<div class="lower-grid">
    <div class="buttons">
      <div v-for="(p, index) in placement" :key="index">

      <button class="button" v-if="p.playerId===null" :disabled="cannotAfford(p.cost)" @click="placeBottle(p)">
        ${{p.cost}}
      </button>

      <div id='placedBottle' v-if="p.playerId !== null">
        {{p.playerId}}
      </div>
    </div>
  </div>
</div>
</div>
</div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsBuyItems',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    itemsOnSale: Array,
    marketValues: Object,
    placement: Array
  },
  methods: {
    cannotAfford: function(cost) {
      let minCost = 100;
      for (let key in this.marketValues) {
        if (cost + this.marketValues[key] < minCost)
          minCost = cost + this.marketValues[key]
      }
      return (this.player.money < minCost);
    },
    ItemCost: function(card) {
      return this.marketValues[card.market];
    },
    placeBottle: function(p) {
      this.$emit('placeBottle', p.cost);
      this.highlightAvailableCards(p.cost);
    },
    highlightAvailableCards: function(cost = 100) {
      for (let i = 0; i < this.itemsOnSale.length; i += 1) {
        if (this.marketValues[this.itemsOnSale[i].item] <= this.player.money - cost) {
          this.$set(this.itemsOnSale[i], "available", true);
        } else {
          this.$set(this.itemsOnSale[i], "available", false);
        }
        this.chosenPlacementCost = cost;
      }
      for (let i = 0; i < this.player.hand.length; i += 1) {
        if (this.marketValues[this.player.hand[i].item] <= this.player.money - cost) {
          this.$set(this.player.hand[i], "available", true);
          this.chosenPlacementCost = cost;
        } else {
          this.$set(this.player.hand[i], "available", false);
          this.chosenPlacementCost = cost;
        }
      }
    },
    buyItem: function(card) {
      if (card.available) {
        this.$emit('buyItem', card)
        this.highlightAvailableCards()
      }
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

@import url('https://fonts.googleapis.com/css?family=Lexend+Deca&display=swap');

.item-placement {
  display: grid;
  grid-template-areas: 'hej' 'down';
  grid-template-columns: 1fr;
  grid-template-rows: 170px 170px;
}

.buttons {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  margin-left: 170px;
}

.button {
  width: 90px;
  height: 50px;
  display: inline-block;
  color: white;
  text-transform:capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 20px;
  background: pink;
  border-radius: 20px;
  border: none;
  transition: all 0.4s ease 0s;


}

.button:hover {
  text-shadow: 0px 0px 6px rgba(255, 255, 255, 1);
  -webkit-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
  -moz-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
  transition: all 0.4s ease 0.2s;
background: #ff9999;
  width: 110px;


}

.upper-grid {

  grid-area: hej;
}

.lower-grid {

  grid-area: down;
}

.buy-item {
  display: grid;
  grid-template-columns: repeat(auto-fill, 20%);
  transform: scale(0.4)translate(-25%, 0);
  transform-origin: top;
  margin-left: 90px;


}


</style>
