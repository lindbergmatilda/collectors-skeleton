<template>
  <div>
    <main>
      <div id="gameboard">
        <img src="/spelplan.png" alt="Collectors" title="Collectors">
        <div class="itemcards" v-for="card in theCards">
          {{card}}
        </div>
        <!--<div class="item_cards"> </div>-->
        <!--<div class="box item"></div>
        <div class="box skills"></div>
        <div class="box work"></div>
        <div class="box auction"></div>
        <div class="box market"></div>-->
      </div>
      <div class="buttons">
        <button @click="drawCard">
          {{ labels.draw }}
        </button>
      </div>
      <div class="my-cards">
        <CollectorsCard v-for="(card, index) in myCards" :card="card" :key="index"/>
      </div>
    </main>
    <footer>
        <p>
          {{ labels.invite }}
          <input type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
        </p>
    </footer>
  </div>
</template>

<script>
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'Collectors',
  components: {
    CollectorsCard
  },
  data: function () {
    return {
      publicPath: "localhost:8080/#", //"collectors-groupxx.herokuapp.com/#",
      touchScreen: false,
      myCards: [],
      maxSizes: { x: 0,
                  y: 0 },
      labels: {},
      points: {}
    }
  },
  created: function () {
    this.$store.commit('SET_PLAYER_ID', this.$route.query.id)
    //TODO! Fix this ugly hack
    //background: https://github.com/quasarframework/quasar/issues/5672
    const newRoute = this.$route.params.id + "?id=" + this.$store.state.playerId;
    if (this.$route.params.id + "?id=" + this.$route.query.id !== newRoute)
      this.$router.push(newRoute);
    this.$store.state.socket.emit('collectorsLoaded',
      { roomId: this.$route.params.id,
        playerId: this.$store.state.playerId } );
    this.$store.state.socket.on('collectorsInitialize',
      function(d) {
        this.labels = d.labels;
        this.myCards = d.hand;
      }.bind(this));
    this.$store.state.socket.on('collectorsPointsUpdated', (d) => this.points = d );

    this.$store.state.socket.on('collectorsCardDrawn',
      function(d) {
        console.log(d);
        if(d.playerId === this.$route.query.id) {
          this.myCards = d.cards;
        }
        else {
          console.log("another player drew a card");
        }
      }.bind(this)
    );
  },
  methods: {
    selectAll: function (n) {
      n.target.select();
    },
    drawCard: function () {
      this.$store.state.socket.emit('collectorsDrawCard', { roomId: this.$route.params.id,
           playerId: this.$store.state.playerId });
    },
    hello: function(){
      console.log("hejhopp");
    }
  },
}
</script>
<style scoped>
  header {
    user-select: none;
    position: fixed;
    width:100%;
    pointer-events: none;
  }
  main {
    margin: 20px 20px;
    user-select: none;
  }
  footer {
    margin: 20px 20px;
    margin-top: 5em auto;
  }
  footer a {
    text-decoration: none;
    border-bottom: 2px dotted ivory;
  }
  footer a:visited {
    color:ivory;
  }
  #gameboard img{
    height: 400px;
  }

  /*{
    display: grid;
    grid-gap: 2px;
    grid-template-columns: 50px 200px 300px;
    background-color: #000000;
    height: 420px;
    width: 620px;
  }
  .box {
      border-radius: 5px;
      padding: 10px;
  }
  .item{
    grid-column: 1/span 3;
    background-color: #F08080;
    height: 35px;
  }
  .skills{
    grid-row: 2;
    grid-column: 1;
    background-color: #8FBC8F;
    height: 290px;
  }
  .work{
    grid-row: 2;
    grid-column: 2;
    background-color: #F5F5DC;
    height: 290px;
  }
  .auction{
    grid-row: 2;
    grid-column: 3;
    background-color: #DEB887;
    height: 290px;
  }
  .market{
    grid-row: 3;
    grid-column: 1/span 3;
    background-color: #F0F8FF;
    height: 35px;
  }*/
  .my-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, 130px);
    grid-template-rows: repeat(auto-fill, 180px);
  }
  .my-cards div {
    transform: scale(0.5)translate(-50%,-50%);
    transition:0.2s;
    transition-timing-function: ease-out;
    z-index: 0;
  }
  .my-cards div:hover {
    transform: scale(0.7)translate(-15%,0);
    z-index: 1;
  }
  @media screen and (max-width: 800px) {
    main {
      width:90vw;
    }
  }
</style>
