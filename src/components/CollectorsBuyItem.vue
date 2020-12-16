<template>
<div>
  <center><h2>{{ "ITEM" }}</h2></center>
  <div class="popupItem" @click='helpItem()'>   ?   <span class="itemhelp-text" id="ItemPopup"> Här kommer hjälptext :) </span>

  </div>


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
      <button class="button" v-if="p.playerId===null" :disabled="cannotAfford(p.cost) || !isMyTurn() ||auctionRunning" @click="placeBottle(p)">
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
    placement: Array,
    auctionRunning: Boolean
  },
  methods: {

    helpItem: function() {
      var popupItem = document.getElementById('ItemPopup');
      popupItem.classList.toggle('show');

    },

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
    isMyTurn: function() {
      if(this.player.myTurn){
        return true;
      }
        return false;
    },



    placeBottle: function(p) {
      this.chosenPosition=p.position;
      this.$emit('placeBottle', p);
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
  grid-template-rows: 120px 170px;
  transform-origin: top;
}

.buttons {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  margin-left: 200px;
}

.button {
  width: 90px;
  height: 50px;
  display: inline-block;
  color: black;
  text-transform:capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 20px;
  background: pink;
  border-radius: 20px;
  border: none;
  transition: all 0.4s ease 0s;


}

.button:hover:enabled {
  text-shadow: 0px 0px 6px rgba(255, 255, 255, 1);
  -webkit-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
  -moz-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
  transition: all 0.4s ease 0.2s;
background: #ff9999;
  width: 110px;

}

button:disabled,
button[disabled]{
  color: grey;
  opacity: 0.5;
}

.upper-grid {

  grid-area: hej;
}

.lower-grid {

  grid-area: down;
}

.buy-item {
  grid-area:hej;
  display: grid;
  grid-template-columns: repeat(auto-fill, 20%);
  transform: scale(0.4)translate(-25%, 0);
  transform-origin: top;
  margin-top: -35px;
  margin-left: 90px;


}



.popupItem {
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-left: 20px;
  font-size: 20px;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

}

.popupItem .itemhelp-text {

    visibility: hidden;
    width: 160px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 8px 0;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    font-size: 15px;

}

.popupItem .itemhelp-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.popupItem .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}




</style>
