<template>
<div>
  <h1>{{ labels.raiseValue }}</h1>
  <div class="raise-value">
    <div v-for="(card, index) in marketCards" :key="index">
        <CollectorsCard :card="card" :availableAction="card.available"/>
    </div>
  </div>
  <div>
    <div class="buttons" v-for="(p, index) in placement" :key="index">
      <button v-if="p.playerId===null" :disabled="cannotAfford(p.cost)" @click="placeBottle(p)">
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
    marketCards: Array,
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
      this.$emit('placeBottle', p.cost);
      this.highlightAvailableCards(p.cost);
      console.log(" kostnaden är " + p.cost);
    },

    highlightAvailableCards: function(cost = 100) {
      for (let i = 0; i < this.player.hand.length; i += 1) {
        this.$set(this.player.hand[i], "available", true);
      }
      this.chosenPlacementCost = cost;
    },

    raiseValue: function(card) {
      if (card.available) {
        console.log("hejsan raiseValue funkar");
        this.$emit('raiseValue', card)
        this.highlightAvailableCards()
      }
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.raise-value, .buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
}
</style>
