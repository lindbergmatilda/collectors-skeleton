<template>
<div class="mainItem">
  <center><h2>{{ "ITEM" }}</h2></center>
  <div class="popupItem" @click='helpItem()'>   ?   <span class="itemhelp-text" id="ItemPopup">  {{labels.helpItem}} <img class="helpPic" src="/images/itempic.png" > <div> {{labels.helpItemExtra}} </div> </span>

  </div>


<div class="item-placement">

<div class="upper-grid">
  <div class="buy-item">

    <div class="cardslots" v-for="(card, index) in itemsOnSale" :key="index">
      <CollectorsCard :card="card" :availableAction="card.available" @doAction="buyItem(card)" />
      {{ ItemCost(card) }}
    </div>
  </div>
</div>

<div class="lower-grid">
    <div class="buttons">
      <div v-for="(p, index) in placement" :key="index">
      <button class="button" v-if="p.playerId===null" :disabled="cannotAfford(p.cost) || !isMyTurn() ||auctionRunning" @click="placeBottle(p)">
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

      <div id='placedBottle' v-if="p.playerId !== null">
       {{ p.playerId }}
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

    gainMoney: function(money) {
      money = money*-1;
      return money;
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
  grid-template-columns: 31.25em;; /* 500/16 */
  grid-template-rows: 8.75em 5.625em; /* 140/16, 90/16 */
}

.buttons {
  display: flex;
  margin-left: 2.188em; /* 35/16 */
  margin-top: -1.4em;

}

.button {
  width: 4.45em; /* 90/16 */
  height: 3.125em; /* 50/16 */
  display: inline-block;
  color: black;
  text-transform:capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 1.25em; /* 20/16 */
  background: pink;
  border-radius: 1.25em; /* 20/16 */
  border: none;
  transition: all 0.4s ease 0s;


}

.button:hover:enabled {
  text-shadow: 0em 0em 0.375em rgba(255, 255, 255, 1); /* 0/16, 0/16, 6/16 */
  transition: all 0.4s ease 0.2s;
background: #ff9999;
  width: 5.5em; /* 110/16 */

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
  grid-template-columns: repeat(auto-fill, 11.25em); /* 180/16 */
  transform: scale(0.4)translate(-12%, 0);
  min-width: 56.25em; /* 900/16 */
  transform-origin: top;
  margin-top: -2.188em; /* -35/16 */
  margin-left: -9.375em; /* -150/16 */

}

.cardslots:hover {
  transform: scale(2)translate(-0.5%, 0%);
  z-index: 2;
}


.popupItem {
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
    margin: 1.25em; /* 10/16 */
    margin-top: -1em;

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

}

.popupItem:hover{
  font-size: 1.3em; /* 30/16 */
  cursor: pointer;
  background-color: #5F9EA0;
  transition: all 0.4s ease 0.2s;
}

.popupItem .itemhelp-text {

    visibility: hidden;

    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 0.625em; /* 10/16 */
    border: 0.125em solid black; /* 2/16 */
    padding: 0.5em 0; /* 8/16 */
    position: fixed;
    z-index: 1;
    top: 20%;
    left: 60%;
    transform: translate(-50%, -50%);
    margin-left: -3.75em; /* -60/16 */
    font-size: 0.938em; /* 15/16 */

}

.popupItem .itemhelp-text .helpPic{
  width: 45em;
}

.popupItem .itemhelp-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -0.313em; /* -5/16 */
  border-width: 0.313em; /* 5/16 */
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.popupItem .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}






</style>
