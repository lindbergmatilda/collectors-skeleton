<template>
<div>
  <main>

    <div class="buttons">
      <button @click="drawCard">
        {{ labels.draw }}
      </button>
    </div>



    <button v-if="players[playerId]" @click="players[playerId].money += 1">
      fake more money
    </button>
    <p>
      {{ labels.invite }}
      <input type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
    </p>

<div class="head">

  <div class="your-playerboard">

      <center>  <h2>Your Player Board</h2> </center>


        Hand
        <hr>
        <div class="cardslots" v-if="players[playerId]">
          <CollectorsCard v-for="(card, index) in players[playerId].hand" :card="card" :availableAction="card.available" @doAction="handleAction(card)" :key="index" />
        </div>

        Your Items
        <hr>
        <div class="cardslots" v-if="players[playerId]">
          <CollectorsCard v-for="(card, index) in players[playerId].items" :card="card" :key="index" />
        </div>

        Your Skills
        <hr>
        <div class="cardslots" v-if="players[playerId]">
          <CollectorsCard v-for="(card, index) in players[playerId].skills" :card="card" :key="index" />
        </div>

  </div>

  <div class="opponentsBoard">

        <h3>Samtliga Spelare</h3>

        <div v-for="(playerInfo, playerId) in players" :key="playerId" :class="['box']">

          <h3>Player ID: {{playerId}}</h3>
          <img src="https://www.bestseller.se/wp-content/uploads/2017/05/Malou_von_Sivers_400x400px.jpg" width="110">
          <h5> Items: </h5>
          <div v-for="(itemInfo, item) in players[playerId].items" :key="item">
            {{itemInfo.item}}
          </div>



          <h5> Skills: </h5>
          <div v-for="(skillInfo, skill) in players[playerId].skills" :key="skill">
            {{skillInfo.skill}}
          </div>




          <h5> Energy: </h5> {{players[playerId].bottles}}


        </div>



      </div>

<div class="gamezone">

        <div class="item">
          <collectorsBuyItem v-if="players[playerId]" :labels="labels" :player="players[playerId]" :itemsOnSale="itemsOnSale" :marketValues="marketValues" :placement="itemPlacement" @buyItem="buyItem($event)"
            @placeBottle="placeBottle('item', $event)" />
        </div>

        <div class="skill">
          <CollectorsBuySkill v-if="players[playerId]" :labels="labels" :player="players[playerId]" :skillsOnSale="skillsOnSale" :marketValues="marketValues" :placement="skillPlacement" @buySkill="buySkill($event)"
            @placeBottle="placeBottle('skill', $event)" />
        </div>

        <div class="value">VALUE

          <div class="leftvalue">
          <CollectorsRaiseValue v-if="players[playerId]" :labels="labels" :player="players[playerId]" :marketValues="marketValues" :placement="marketPlacement" @raiseValue="raiseValue($event)" @placeBottle="placeBottle('market', $event)" />
          </div>

          <div class="rightvalue">

          <h5>Market Values</h5>
          <img src="/images/movie.png" width="50"> : {{marketValues.movie}}<hr class="blueline">
           <img src="/images/music.png" width="50">: {{marketValues.music}}<hr class="blueline">
           <img src="/images/penguin.png" width="50">: {{marketValues.fastaval}}<hr class="blueline">
           <img src="/images/robot.png" width="50">: {{marketValues.figures}}<hr class="blueline">
           <img src="/images/tech.png" width="50">: {{marketValues.technology}}<br>

          </div>

        </div>




        <div class="auction">


          <div class="upper-auction">
            <CollectorsAuctionItem v-if="players[playerId]" :labels="labels" :player="players[playerId]" :auctionCards="auctionCards" :placement="auctionPlacement" @auctionItem="auctionItem($event)" @placeBottle="placeBottle('auction', $event)" />
          </div>


          <div class="lower-auction">


            <div class="altButtons">
               <button class="altButton" @click="claimAuctionCard('item')">Add item</button> <br>
               <button class="altButton" @click="claimAuctionCard('skill')">Add skill</button> <br>
               <button class="altButton" @click="claimAuctionCard('market')">Raise value</button> <br>
             </div>


                <div class="head-auction">
                  <h5>Card up for auction</h5>
                </div>
                <div class="cardslots card-for-auction">
              <CollectorsCard v-for="(card, index) in theAuctionItem" :card="card" :key="index" />
            </div>

          </div>

        </div>

        <div class="work">WORK</div>




        <div class="theRest">
          <hr>







        </div>
      </div>

      <!---->

</div>

  </main>


  <footer>

  </footer>
</div>
</template>

<script>
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import CollectorsCard from '@/components/CollectorsCard.vue'
import CollectorsBuyItem from '@/components/CollectorsBuyItem.vue'
import CollectorsBuySkill from '@/components/CollectorsBuySkill.vue'
import CollectorsRaiseValue from '@/components/CollectorsRaiseValue.vue'
import CollectorsAuctionItem from '@/components/CollectorsAuctionItem.vue'

export default {
  name: 'Collectors',
  components: {
    CollectorsCard,
    CollectorsBuyItem,
    CollectorsBuySkill,
    CollectorsRaiseValue,
    CollectorsAuctionItem
  },
  data: function() {
    return {
      publicPath: "localhost:8080/#", //"collectors-groupxx.herokuapp.com/#",
      touchScreen: false,
      maxSizes: {
        x: 0,
        y: 0
      },
      labels: {},
      players: {},
      // playerId: {
      //   hand: [],
      //   money: 1,
      //   points: 0,
      //   skills: [],
      //   items: [],
      //   income: [],
      //   secret: []
      // }
      itemPlacement: [],
      skillPlacement: [],
      auctionPlacement: [],
      marketPlacement: [],
      chosenPlacementCost: null,
      chosenAction: null,
      marketValues: {
        fastaval: 0,
        movie: 0,
        technology: 0,
        figures: 0,
        music: 0
      },
      market: [],
      itemsOnSale: [],
      skillsOnSale: [],
      auctionCards: [],
      theAuctionItem: [],
      playerid: 0
    }
  },
  computed: {
    playerId: function() {
      return this.$store.state.playerId
    }
  },
  watch: {
    players: function(newP, oldP) {
      console.log(newP, oldP)
      for (let p in this.players) {
        for (let c = 0; c < this.players[p].hand.length; c += 1) {
          if (typeof this.players[p].hand[c].item !== "undefined")
            this.$set(this.players[p].hand[c], "available", false);
        }
      }
    }
  },
  created: function() {
    this.$store.commit('SET_PLAYER_ID', this.$route.query.id)
    //TODO! Fix this ugly hack
    //background: https://github.com/quasarframework/quasar/issues/5672
    const newRoute = this.$route.params.id + "?id=" + this.playerId;
    if (this.$route.params.id + "?id=" + this.$route.query.id !== newRoute)
      this.$router.push(newRoute);

    this.$store.state.socket.emit('collectorsLoaded', {
      roomId: this.$route.params.id,
      playerId: this.playerId
    });

    this.$store.state.socket.on('collectorsInitialize',
      function(d) {
        this.labels = d.labels;
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
        this.marketValues = d.marketValues;
        this.skillsOnSale = d.skillsOnSale;
        this.auctionCards = d.auctionCards;
        this.theAuctionItem = d.theAuctionItem;
        this.itemPlacement = d.placements.itemPlacement;
        this.skillPlacement = d.placements.skillPlacement;
        this.marketPlacement = d.placements.marketPlacement;
        this.auctionPlacement = d.placements.auctionPlacement;
      }.bind(this));

    this.$store.state.socket.on('collectorsBottlePlaced',
      function(d) {
        this.itemPlacement = d.itemPlacement;
        this.skillPlacement = d.skillPlacement;
        this.marketPlacement = d.marketPlacement;
        this.auctionPlacement = d.auctionPlacement;
      }.bind(this));

    this.$store.state.socket.on('collectorsPointsUpdated', (d) => this.points = d);

    this.$store.state.socket.on('collectorsCardDrawn',
      function(d) {
        //this has been refactored to not single out one player's cards
        //better to update the state of all cards
        this.players = d;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsClaimedCard',
      function(d) {
        //this has been refactored to not single out one player's cards
        //better to update the state of all cards
        this.players = d.players;
        this.theAuctionItem = d.theAuctionItem;
        this.market = d.market;
        this.marketValues = d.marketValues;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsItemBought',
      function(d) {
        console.log(d.playerId, "bought a card");
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsSkillBought',
      function(d) {
        console.log(d.playerId, "bought a skill");
        this.players = d.players;
        this.skillsOnSale = d.skillsOnSale;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsRaisedValue',
      function(d) {
        console.log(d.playerId, "raised a value");
        this.players = d.players;
        this.marketValues = d.marketValues;
        this.market = d.market;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsItemAuctioned',
      function(d) {
        console.log(d.playerId, "auctioned a card");
        this.players = d.players;
        this.auctionCards = d.auctionCards;
        this.theAuctionItem = d.theAuctionItem;
      }.bind(this)
    );


  },
  methods: {
    selectAll: function(n) {
      n.target.select();
    },
    placeBottle: function(action, cost) {
      this.chosenPlacementCost = cost;
      this.chosenAction = action;
      this.$store.state.socket.emit('collectorsPlaceBottle', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        action: action,
        cost: cost,
      });
    },
    drawCard: function() {
      this.$store.state.socket.emit('collectorsDrawCard', {
        roomId: this.$route.params.id,
        playerId: this.playerId
      });
    },

    claimAuctionCard: function(buttonAction) {
      this.$store.state.socket.emit('collectorsClaimCard', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        buttonAction: buttonAction
      });
    },

    buyItem: function(card) {
      console.log("buyItem", card);
      this.$store.state.socket.emit('collectorsBuyItem', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.marketValues[card.market] + this.chosenPlacementCost
      });
    },

    auctionItem: function(card) {
      console.log("auctionItem", card);
      this.$store.state.socket.emit('collectorsAuctionItem', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.chosenPlacementCost
      });
    },

    raiseValue: function(card) {
      console.log("raiseValue", card);
      this.$store.state.socket.emit('collectorsRaiseValue', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.chosenPlacementCost
      });
    },

    handleAction: function(card) {
      console.log(this.chosenAction);
      if (this.chosenAction === "item") {
        console.log("inne i if i handleaction");
        this.buyItem(card);
      } else if (this.chosenAction === "skill") {
        this.getSkill(card);
      } else if (this.chosenAction === "auction") {
        this.auctionItem(card);
      } else if (this.chosenAction === "market") {
        this.raiseValue(card);
      }
    },

    buySkill: function(card) {
      console.log("buySkill", card);
      this.$store.state.socket.emit('collectorsBuySkill', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.chosenPlacementCost // this.marketValues[card.market] tog bort detta,det var adderat
      });
    }
  }
}
</script>



<style scoped>
header {
  user-select: none;
  position: fixed;
  width: 100%;
  pointer-events: none;
}

main {
  user-select: none;
}

footer {
  margin-top: 5em auto;
  margin-bottom: 10px;

}

footer a {
  text-decoration: none;
  border-bottom: 2px dotted ivory;
}

footer a:visited {
  color: ivory;
}

.head {
  display: grid;
  grid-template-areas:
  'gameboard your-board'
  'gameboard other-boards'
  'bottom-grid bottom-grid';
  grid-template-columns: 3fr 2fr;
  grid-template-rows: 1fr 1fr 1fr;
  max-width: 2000px;




}

.your-playerboard {
  grid-area: your-board;
  background-color: #EEECE2;
  border-radius: 100px;
  margin: 60px;
  padding: 20px;
  color: black;
  border: 2px solid black;
  max-height: 800px;


}

.opponentsBoard {
  grid-area: other-boards;
  margin: 60px;
  padding: 20px;
  display: grid;
  grid-gap: 40px;
  grid-template-columns: auto;
}

.box {
background-color: lightgrey;
  border-radius: 40px;
  color: black;
  padding: 15px;
  border: 2px solid black;

}

.gamezone {
  grid-area: gameboard;
  display: grid;
  grid-template-areas:
    'item item item '
    'skill work auction'
    'value value value'
    'thehand thehand thehand'
    'rest rest rest';
  max-width: 1000px;
  width: 800px;


  grid-template-columns: 1fr 2fr 400px;
  grid-template-rows: 300px 1000px 1fr 1fr 1fr;

  height: 500px;
  margin: 60px;
  color: black;


}




.item {
  grid-area: item;
  background-color: #FFDBDB;
  border-top: 2px solid black;
  border-left: 2px solid black;
  border-right: 2px solid black;


}

.skill {
  grid-area: skill;
  background-color: #EDFFDB;
  border-left: 2px solid black;

}

.value {
  grid-area: value;
  background-color: #DBFFED;
  border-bottom: 2px solid black;
  border-left: 2px solid black;
  border-right: 2px solid black;
  display: grid;
  grid-template-areas: 'left right';
  grid-template-columns: 1fr 1fr;
}

.leftvalue{
  grid-area:left;
}

.rightvalue{
  grid-area: right;

}

.auction {
  grid-area: auction;
  display: grid;
  grid-template-areas: 'upper-auction' 'lower-auction';
  grid-template-rows: 600px 300px;
  background-color: #FFFFDB;
  border-right: 2px solid black;
}

.upper-auction {
  grid-area: upper-auction;
  padding-left: 25px;
}

.lower-auction {
  grid-area: lower-auction;
  display: grid;
  grid-template-areas: 'header header' 'auctioncard auctionbuttons';
  grid-template-rows: 90px 240px;
  grid-template-columns: 190px 100px;

}

.head-auction {
  grid-area: header;
  padding: 30px;
}

.altButtons {
  grid-area: auctionbuttons;
  padding: 25px;
  padding-left: 20px;

}

.altButton {
  width: 50px;
  height: 50px;
  margin:40px;
  margin-top: -100px;
  color: white;
  text-transform:capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 10px;
  background: orange;
  border-radius: 20px;
  border: none;
  transition: all 0.4s ease 0s;
}
.altButton:hover:enabled {
  text-shadow: 0px 0px 6px rgba(255, 255, 255, 1);
  -webkit-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
  -moz-box-shadow: 0px 5px 40px -10px rgba(0,0,0,0.57);
  transition: all 0.4s ease 0.2s;
  background: #ffc34d;
  width: 100px;
}

button:disabled,
button[disabled]{
  color: grey;
  opacity: 0.5;
}

.card-for-auction {
  grid-area: auctioncard;
  padding: 35px;
  background-color: lightgrey;
}

.work {
  grid-area: work;
  background-color: #FFEDDB;
}


.theRest {
  grid-area: rest;
  border: 10px;
  color: white;

}


.cardslots {
  display: grid;
  grid-template-columns: repeat(auto-fill, 30px);
  grid-template-rows: repeat(auto-fill, 80px);
}

.cardslots div {
  transform: scale(0.5)translate(-50%, -50%);
  transition: 0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}

.cardslots div:hover {
  transform: scale(1)translate(-25%, 0);
  z-index: 1;
}

@media screen and (max-width: 800px) {
  main {
    width: 90vw;
  }
}
</style>
