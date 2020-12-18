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
        console.log("index är 0");
        return "/images/GET2.png"
      }
      else if(index === 1){
        console.log("index är 1");
        return "/images/GET1.png"
      }
      else if (index === 2){
        console.log("index är 2");
          return "/images/TWOCARDS.png"
      }
      else if(index === 3){
        console.log("index är 3");
          return "/images/1STPLAYER.png"
      }
      else if(index === 4){
        console.log("index är 4");
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
  margin-left: 30px;
  grid-template-rows: repeat(auto-fill, 70px);
  grid-gap: 75px;
  margin-top: 10px;
}

.button {
  width:  135px;
  height: 58px;

  color: black;
  text-transform:capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 15px;

  background: #e0b3ff;
  border-radius: 4px;
  display: inline-block;
  border: none;
  transition: all 0.4s ease 0s;


}

.button:hover:enabled {
  text-shadow: 0px 0px 6px rgba(255, 255, 255, 1);
  -webkit-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
  -moz-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
  transition: all 0.4s ease 0.2s;
  background: #cc80ff;
  font-size: 20px;



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

.popupWork:hover{
  font-size: 30px;
  cursor: pointer;
  background-color: #5F9EA0;
}

.popupWork .workhelp-text {

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

.popupWork .workhelp-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.popupWork .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}

</style>
