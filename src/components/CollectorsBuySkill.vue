<template>
<div>
  <h1>{{ labels.buySkill }}</h1>
  <div class="buy-skill">
    <div v-for="(card, index) in skillsOnSale" :key="index">
      <CollectorsCard :card="card" :availableAction="card.available" @doAction="buySkill(card)" />
    </div>
  </div>
  <div>
    <div class="buttons" v-for="(p, index) in placement" :key="index">
      <button v-if="p.playerId===null" :disabled="cannotAfford(p.cost) || !isMyTurn()" @click="placeBottle(p)">
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
  name: 'CollectorsBuySkill',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    skillsOnSale: Array,
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
      this.highlightAvailableCards(p.cost);
      console.log(" kostnaden är " + p.cost);
    },

    highlightAvailableCards: function(cost = 100) {
      for (let i = 0; i < this.skillsOnSale.length; i += 1) {
        this.$set(this.skillsOnSale[i], "available", true);
      }
      this.chosenPlacementCost = cost;
    },

    isMyTurn: function() {
      if(this.player.myTurn){
        return true;
      }
        return false;
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
.buy-skill,
.buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
}
</style>
