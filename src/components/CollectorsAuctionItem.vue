<template>
<div class="mainAuction">
  <center>
    <div class="label-auction">
      <h2>{{ "AUCTION" }}</h2>
    </div>

    <div class="popupAuction" @click='helpAuction()'> ? <span class="auctionhelp-text" id="auctionPopup"> {{labels.helpAuction}} <div> <img src="/images/auctionpic.png" width='950em'> </div></span>

    </div>

  </center>
  <div class="item-left-right">

    <div class="right auction-item">
      <div class="cardslots" v-for="(card, index) in auctionCards" :key="index">
        <CollectorsCard :card="card" :availableAction="card.available" @doAction="auctionItem(card)" />
      </div>
    </div>
    <div class="left buttons">
      <div v-for="(p, index) in placement" :key="index">
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
    },

    isMyTurn: function() {
      if (this.player.myTurn) {
        return true;
      }
      return false;
    },

    gainMoney: function(money) {
      money = money*-1;
      return money;
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
  width: 4.375em; /* 70/16 */
  display: grid;
  grid-template-rows: repeat(auto-fill, 8.125em); /* 130/16 */

}


.button {
  width: 5.625em; /* 90/16 */
  height: 3.125em; /* 50/16 */
  margin-top: 1.875em; /* 30/16 */
  cursor: default;

  color: black;
  text-transform: capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 1.25em; /* 20/16 */

  background: #ffdd99;
  border-radius: 1.25em; /* 20/16 */
  display: inline-block;
  border: none;
  transition: all 0.4s ease 0s;


}

.button:hover:enabled {
  text-shadow: 0em 0em 0.375em rgba(255, 255, 255, 1); /* 0/16, 0/16, 6/16 */
  -webkit-box-shadow: 0em 0.313em 2.5em -0.625em rgba(0, 0, 0, 0.57); /* 0/16, 5/16, 40/16, -10/16 */
  -moz-box-shadow: 0em 0.313em 2.5em -0.625em rgba(0, 0, 0, 0.57); /* 0/16, 5/16, 40/16, -10/16 */
  transition: all 0.4s ease 0.2s;
  background: #ffc34d;
  width: 6.875em; /* 110/16 */
  cursor: pointer;

}

button:disabled,
button[disabled] {
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
  grid-template-columns: repeat(auto-fill, 8.125em); /* 130/16 */
  transform: scale(0.4)translate(-25%, 0);
  transform-origin: top;
}

.cardslots:hover {
  transform: scale(2)translate(-0.5%, 0%);
  z-index: 2;
}

.popupAuction {
  left: -5.75em; /* -140/16 */

  position: relative;
  text-align: center;
  background-color: #BCDBEA;
  color: white;
  border-radius: 50%;
  width: 1.5em; /* 24/16 */
  height: 1.5em; /* 24/16 */
  font-size: 1.188em; /* 19/16 */
  line-height: 1.625em; /* 26/16 */
  cursor: default;
  margin-top: -0.525em; /* 10/16 */

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

}


.popupAuction:hover{
  font-size: 1.2em; /* 30/16 */
  cursor: pointer;
  background-color: #5F9EA0;
  transition: all 0.2s ease 0.1s;
}

.popupAuction .auctionhelp-text {

  visibility: hidden;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 0.375em; /* 6/16 */
  padding: 0.5em 0; /* 8/16 */
  position: fixed;
  z-index: 1;
  top: 10%;
  left: 15%;
  border: 0.125em solid black; /* 2/16 */
  margin-left: -3.75em; /* -60/16 */
  font-size: 0.938em; /* 15/16 */


}

.popupAuction .auctionhelp-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -0.313em; /* -5/16 */
  border-width: 0.313em; /* 5/16 */
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.popupAuction .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}





</style>
