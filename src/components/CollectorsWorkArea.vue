<template>
<div>
  <h1>{{ labels.workArea }}</h1>
    <div class="buttons" v-for="(p, index) in placement" :key="index">
      <button v-if="p.playerId===null" :disabled="cannotAfford(p.cost)" @click="placeBottle(p)">
        ${{p.cost}}
      </button>
      <div v-if="p.playerId !== null">
        {{p.playerId}}
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
    placement: Array
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
      this.$emit('placeBottle', p.cost);
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
}
</style>
