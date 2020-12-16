<template>
<div>
  <center><h2>{{ "WORK" }}</h2></center>
    <div class="buttons">
      <div v-for="(p, index) in placement" :key="index">
      <button class="button" v-if="p.playerId===null" :disabled="cannotAfford(p.cost) || !isMyTurn() ||auctionRunning" @click="placeBottle(p)">
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
    cannotAfford: function(cost) {
      let minCost = 100;

        if (cost  < minCost){
          minCost = cost
        }
      return (this.player.money < minCost);
    },

    isMyTurn: function() {
      if(this.player.myTurn){
        return true;
      }
        return false;
    },
    placeBottle: function(p) {
      this.$emit('placeBottle', p);
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.buttons {
  width: 70px;
  display: grid;
  margin: 15px;
  grid-template-rows: repeat(auto-fill, 90px);



}

.button {
  width: 120px;
  height: 50px;

  color: black;
  text-transform:capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 20px;

  background: brown;
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
  background: #2eb82e;
  width: 110px;


}

button:disabled,
button[disabled]{
  color: grey;
  opacity: 0.5;
}

</style>
