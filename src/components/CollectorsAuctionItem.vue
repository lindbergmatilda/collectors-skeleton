<template>
<div>
  <center>
    <div class="label-auction">
      <div class="popupAuction" @click='helpAuction()'>   ?   <span class="auctionhelp-text" id="auctionPopup"> Här kommer hjälptext :) </span>

      </div>
    <h2>{{ "AUCTION" }}</h2></div> <br>

  </center>
  <div class="item-left-right">

    <div class="right auction-item">
      <div v-for="(card, index) in auctionCards" :key="index">
        <CollectorsCard :card="card" :availableAction="card.available" @doAction="auctionItem(card)" />
      </div>
    </div>
    <div class="left buttons">
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
  name: 'CollectorsAuctionItem',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    theAuctionItem: Array,
    auctionCards: Array,
    placement: Array,
    auctionRunning: Boolean
  },
  methods: {

    helpAuction: function() {
      var popupAuction = document.getElementById('auctionPopup');
      popupAuction.classList.toggle('show');

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
.item-left-right {
  display: grid;
  grid-template-areas: 'left right';
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
}



.buttons {
  width: 70px;
  display: grid;
  grid-template-rows: repeat(auto-fill, 90px);

}


.button {
  width: 90px;
  height: 50px;
  margin-top: -100px;

  color: black;
  text-transform:capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 20px;

  background: #ffdd99;
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
  background: #ffc34d;
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

.auction-item {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
  transform: scale(0.4)translate(-25%, 0);
  transform-origin: top;
}

.popupAuction {
  left: -150px;
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

.popupAuction:hover{
  font-size: 30px;
}
.popupAuction .auctionhelp-text {

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

.popupAuction .auctionhelp-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.popupAuction .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}

</style>
