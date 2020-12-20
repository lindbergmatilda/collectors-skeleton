<template>
<div>
    <center><h2>{{ "WORK" }}</h2></center>
  <div class="popupWork" @click='helpWork()'> ? <span class="workhelp-text" id="workPopup">Här kommer hjälptext :) </span>

  </div>




  <div class="work-area">


    <div class="buttons">
      <div v-for="(p, index) in placement" :key="index">
      <button class="button" v-if="p.playerId===null" :disabled="cannotAfford(p.cost) || !isMyTurn() ||auctionRunning" @click="placeBottle(p)">
        <img  :src="imgSource(index)" width="120"/>
      </button>
      <div v-if="p.playerId !== null">
        {{p.playerId}}
      </div>
    </div>
    </div>

  <!--  <div class="pictures">
      <img class="workcard GET2" src="/images/GET2.png" width="120"><br>
      <img class="workcard GET1" src="/images/GET1.png" width="120"><br>
      <img class="workcard twocards" src="/images/TWOCARDS.png" width="120"><br>
      <img class="workcard firstPLAYER" src="/images/1STPLAYER.png" width="120"><br>
      <img class="workcard extracoin" src="/images/extra.png" width="120"><br>
    </div>
  -->





</div>
</div>
</template>

<script>
//import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsWorkArea',
  /*components: {
    CollectorsCard
  },*/
  props: {
    labels: Object,
    player: Object,
    placement: Array,
    auctionRunning: Boolean
  },
  methods: {

    helpWork: function() {
      var popupWork = document.getElementById('workPopup');
      popupWork.classList.toggle('show');

    },

    cannotAfford: function(cost) {
      let minCost = 100;

        if (cost  < minCost){
          minCost = cost
        }
      return (this.player.money < minCost);
    },

    imgSource: function(index){
      if(index === 0){
        return "/images/GET2.png"
      }
      else if(index === 1){
        return "/images/GET1.png"
      }
      else if (index === 2){
          return "/images/TWOCARDS.png"
      }
      else if(index === 3){
          return "/images/1STPLAYER.png"
      }
      else if(index === 4){
          return "/images/extra.png"
      }
    },

    isMyTurn: function() {
      if(this.player.myTurn){
        return true;
      }
        return false;
    },
    placeBottle: function(p) {
      this.$emit('placeBottle', p);
    },





  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>



.buttons {


  display: grid;
  margin-left: 1.875em; /* 30/16 */
  grid-template-rows: repeat(auto-fill, 4.375em); /* 70/16 */
  grid-gap: 4.688em; /* 75/16 */
  margin-top: 0.625em; /* 10/16 */
}

.button {
  width:  9.738em; /* 135/16 */
  height: 3.625em; /* 58/16 */


  color: black;
  text-transform:capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 0.938em; /* 15/16 */

  background: #e0b3ff;
  border-radius: 0.25em; /* 4/16 */
  display: inline-block;
  border: none;
  transition: all 0.4s ease 0s;


}

.button:hover:enabled {
  text-shadow: 0em 0em 0.375em rgba(255, 255, 255, 1); /* 0/16, 0/16, 6/16 */
  -webkit-box-shadow: 0em 0.313em 2.5em -0.625em rgba(0,0,0,0.57); /* 0/16, 5/16, 40/16, -10/16 */
  -moz-box-shadow: 0em 0.313em 2.5em -0.625em rgba(0,0,0,0.57); /* 0/16, 5/16, 40/16, -10/16 */
  transition: all 0.4s ease 0.2s;
  background: #cc80ff;
  font-size: 0.96em; /* 20/16 */



}

button:disabled,
button[disabled]{
  color: grey;
  opacity: 0.5;
}



.popupWork {
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
    margin-top: -2.1em;


  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

}

.popupWork:hover{
  font-size: 1.5em; /* 30/16 */
  cursor: pointer;
  background-color: #5F9EA0;
  transition: all 0.4s ease 0.2s;
}

.popupWork .workhelp-text {

    visibility: hidden;
    width: 10em; /* 160/16 */
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 0.375em; /* 6/16 */
    padding: 0.5em 0; /* 8/16 */
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -3.75em; /* -60/16 */
    font-size: 0.938em; /* 15/16 */

}

.popupWork .workhelp-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -0.313em; /* -5/16 */
  border-width: 0.313em; /* 5/16 */
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.popupWork .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}

</style>
