<template>
<div>
  <h1>{{ labels.auctionItem }}</h1>
  <div class="auction-item">
    <div v-for="(card, index) in auctionCards" :key="index">
      <CollectorsCard :card="card" :availableAction="card.available" @doAction="auctionItem(card)" />
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
  name: 'CollectorsAuctionItem',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    theAuctionItem: Array,
    auctionCards: Array,
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

    isMyTurn: function() {
      if(this.player.myTurn){
        return true;
      }
        return false;
    },

    highlightAvailableCards: function(cost = 100) {
      for (let i = 0; i < this.auctionCards.length; i += 1) {
          this.$set(this.auctionCards[i], "available", true);
        }
      for (let i = 0; i < this.player.hand.length; i += 1) {
          this.$set(this.player.hand[i], "available", true);
        }
        this.chosenPlacementCost = cost;
      },

    auctionItem: function(card) {
      if (card.available) {
        console.log("hejsan autionItem funkar");
        this.$emit('auctionItem', card)
        this.highlightAvailableCards()
      }
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.auction-item,
.buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
}
</style>
