<template>
<div>

  <center>
        <h2>{{ "SKILL" }}</h2>
    <div class="popupSkill" @click='helpSkill()'>   ?   <span class="skillhelp-text" id="SkillPopup"> {{labels.helpSkill}} <img src="/images/skillInfo.png" > </span>

    </div>

  </center>
  <div class="item-left-right">

    <div class="left buy-skill">
      <div v-for="(card, index) in skillsOnSale" :key="index">
        <CollectorsCard :card="card" :availableAction="card.available" @doAction="buySkill(card)" />
      </div>
    </div>

    <div class="right buttons">
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
  name: 'CollectorsBuySkill',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    skillsOnSale: Array,
    placement: Array,
    auctionRunning: Boolean
  },
  methods: {

    helpSkill: function() {
      var popupSkill = document.getElementById('SkillPopup');
      popupSkill.classList.toggle('show');

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

    isMyTurn: function() {
      if(this.player.myTurn){
        return true;
      }
        return false;
    },

    placeBottle: function(p) {
      this.$emit('placeBottle', p);
      this.highlightAvailableCards(p.cost);
    },

    highlightAvailableCards: function(cost = 100) {
      for (let i = 0; i < this.skillsOnSale.length; i += 1) {
        this.$set(this.skillsOnSale[i], "available", true);
      }
      this.chosenPlacementCost = cost;
    },

    gainMoney: function(money) {
      money = money*-1;
      return money;
    },

    buySkill: function(card) {
      if (card.available) {
        this.$emit('buySkill', card)
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
  grid-template-columns: 11.875em 1fr; /* 190/16 */
  grid-template-rows: 1fr;


}

.buttons {
  width: 4.375em; /* 70/16 */
  display: grid;
  padding-top: 3.125em; /* 50/16 */
  grid-template-rows: repeat(auto-fill, 8.125em); /* 130/16 */



}

.button {
  width: 4.625em; /* 90/16 */
  height: 3.125em; /* 50/16 */

  color: black;
  text-transform:capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 1.25em; /* 20/16 */

  background: lightgreen;
  border-radius: 1.25em; /* 20/16 */
  border: none;
  transition: all 0.4s ease 0s;


}

.button:hover:enabled {
  text-shadow: 0em 0em 0.375em rgba(255, 255, 255, 1); /* 0/16, 0/16, 6/16 */
  -webkit-box-shadow: 0em 0.313em 2.5em -0.625em rgba(0,0,0,0.57); /* 0/16, 5/16, 40/16, -10/16 */
  -moz-box-shadow: 0em 0.313em 2.5em -0.625em rgba(0,0,0,0.57); /* 0/16, 5/16, 40/16, -10/16 */
  transition: all 0.4s ease 0.2s;
  background: #2eb82e;
  width: 4.975em; /* 110/16 */


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

.buy-skill {
  display: grid;
  grid-template-rows: repeat(auto-fill, 18.75em); /* 300/16 */
  transform: scale(0.4)translate(-25%, 0);
  transform-origin: top;
}

.popupSkill {
  left: 11em; /* -130/16 */
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
    margin-top: -2.25em; /* 10/16 */

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

}

.popupSkill:hover{
  font-size: 1.4em; /* 30/16 */
  cursor: pointer;
  background-color: #5F9EA0;
  transition: all 0.4s ease 0.2s;
}

.popupSkill .skillhelp-text {

    visibility: hidden;

    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 0.625em; /* 10/16 */
    border: 0.125em solid black; /* 2/16 */
    padding: 0.5em 0; /* 8/16 */
    position: fixed;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin-left: -3.75em; /* -60/16 */
    font-size: 0.938em; /* 15/16 */
    max-width: 80%;
}

.popupSkill .skillhelp-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -0.313em; /* -5/16 */
  border-width: 0.313em; /* 5/16 */
  border-style: solid;
  border-color: #555 transparent transparent transparent;

}

.popupSkill .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}


</style>
