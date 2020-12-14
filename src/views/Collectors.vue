<template>
<div>
  <main>

    <p>
      {{ labels.invite }}
      <input type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
    </p>

    <div class="buttons">
      <button @click="claimFirstPlayer">
        {{ labels.firstPlayer }}
      </button>
    </div>
    <hr>
    <div class="buttons">
      <button @click="drawCard">
        {{ labels.draw }}
      </button>
    </div>
    <div class="buttons">
      <button @click="refill">
        {{ labels.refill }}
      </button>
    </div>
    <hr>

    {{itemPlacement}} {{chosenPlacementCost}}
    <collectorsBuyItem v-if="players[playerId]"
    :labels="labels"
    :player="players[playerId]"
    :itemsOnSale="itemsOnSale"
    :marketValues="marketValues"
    :placement="itemPlacement"
    @buyItem="buyItem($event)"
    @placeBottle="placeBottle('item', $event)" />
    <hr>
    <CollectorsBuySkill v-if="players[playerId]"
    :labels="labels"
    :player="players[playerId]"
    :skillsOnSale="skillsOnSale"
    :marketValues="marketValues"
    :placement="skillPlacement"
    @buySkill="buySkill($event)"
    @placeBottle="placeBottle('skill', $event)" />
    <hr>
    <CollectorsRaiseValue v-if="players[playerId]"
    :labels="labels"
    :player="players[playerId]"
    :marketValues="marketValues"
    :placement="marketPlacement"
    @raiseValue="raiseValue($event)"
    @placeBottle="placeBottle('market', $event)" />

      <hr>
      <CollectorsWorkArea v-if="players[playerId]"
      :labels="labels"
      :player="players[playerId]"
      :placement="workPlacement"
      @placeBottle="placeBottle('work', $event)" />
      <hr>

      <CollectorsAuctionItem v-if="players[playerId]"
      :labels="labels"
      :player="players[playerId]"
      :auctionCards="auctionCards"
      :placement="auctionPlacement"
      @auctionItem="auctionItem($event)"
      @placeBottle="placeBottle('auction', $event)" />

    <hr>
    Auction Area
    <div class="cardslots">
      <CollectorsCard v-for="(card, index) in theAuctionItem" :card="card" :key="index" />
    </div>

    <p>
      <label for="number"> Place bid (you can place coins or cards) RÄKNA SJÄLV FÖR FAN </label> <br>
      <input type="number" id="myBid" name="bid" placeholder="Place your bid">
    </p>
    <button v-if="players[playerId]" :disabled="!isMyAuctionTurn()" @click="placeBid()" >Place bid</button>
    <button v-if="players[playerId]" :disabled="!isMyAuctionTurn()" @click="passBid()">Pass</button>

    <p>
      <label for="number"> How many cards would you like to pay with?</label> <br>
      <input type="number" id="myPayment" name="pay" placeholder="Number of cards">
    </p>
    <button :disabled="!winnerAuction()" @click="payAuctionCard()">Pay</button>

    <div class="altButtons">
      <button v-if="players[playerId]" :disabled="!winnerAuction()" @click="claimAuctionCard('item')">Place in item</button>
      <button v-if="players[playerId]" :disabled="!winnerAuction()" @click="claimAuctionCard('skill')">Place in skill</button>
      <button v-if="players[playerId]" :disabled="!winnerAuction()" @click="claimAuctionCard('market')">Add to market</button>
    </div>
    <hr>
    Market
    <div class="cardslots">
      <CollectorsCard v-for="(card, index) in market" :card="card" :key="index" />
    </div>
    <hr>
    Hand
      <div class="cardslots" v-if="players[playerId]">
        <CollectorsCard v-for="(card, index) in players[playerId].hand" :card="card" :availableAction="card.available" @doAction="handleAction(card)" :key="index"/>
      </div>
      <hr>
    Items
    <div class="cardslots" v-if="players[playerId]">
      <CollectorsCard v-for="(card, index) in players[playerId].items" :card="card" :key="index" />
    </div>
    <hr>
    Your Skills
    <div class="cardslots" v-if="players[playerId]">
      <CollectorsCard v-for="(card, index) in players[playerId].skills" :card="card" :key="index" />
    </div>
    <hr>
  </main>
  {{players}}
  {{marketValues}}
  <button v-if="players[playerId]" @click="players[playerId].money += 1">
    fake more money
  </button>
  <hr>
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
import CollectorsBuyItem from '@/components/CollectorsBuyItem.vue'
import CollectorsBuySkill from '@/components/CollectorsBuySkill.vue'
import CollectorsRaiseValue from '@/components/CollectorsRaiseValue.vue'
import CollectorsAuctionItem from '@/components/CollectorsAuctionItem.vue'
import CollectorsWorkArea from '@/components/CollectorsWorkArea.vue'

export default {
  name: 'Collectors',
  components: {
    CollectorsCard,
    CollectorsBuyItem,
    CollectorsBuySkill,
    CollectorsRaiseValue,
    CollectorsAuctionItem,
    CollectorsWorkArea
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
      workPlacement: [],
      chosenPlacementCost: null,
      chosenAction: null,
      chosenPlacementPosition: null,
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
      theAuctionItem: []
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
        this.workPlacement = d.placements.workPlacement;
      }.bind(this));

    this.$store.state.socket.on('collectorsBottlePlaced',
      function(d) {
        this.itemPlacement = d.itemPlacement;
        this.skillPlacement = d.skillPlacement;
        this.marketPlacement = d.marketPlacement;
        this.auctionPlacement = d.auctionPlacement;
        this.workPlacement = d.workPlacement;
      }.bind(this));

    this.$store.state.socket.on('collectorsPointsUpdated', (d) => this.points = d);

    this.$store.state.socket.on('collectorsClaimedFirstPlayer',
      function(d) {
        this.players = d;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsCardDrawn',
      function(d) {
        //this has been refactored to not single out one player's cards
        //better to update the state of all cards
        this.players = d;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsPlacedBid',
      function(d) {
        this.players = d.players;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsPassedBid',
      function(d) {
        this.players = d.players;
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

    this.$store.state.socket.on('collectorsWorkedArea',
      function(d) {
        console.log(d.playerId, "worked an area!");
        this.players = d.players;
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
        this.auctionCards = d.auctionCards;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsRefilled',
      function(d) {
        console.log("refilled items lol");
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
        this.skillsOnSale = d.skillsOnSale;
        this.market = d.market;
        this.marketValues = d.marketValues;
        this.auctionCards = d.auctionCards;

        this.itemPlacement = d.placements.itemPlacement;
        this.skillPlacement = d.placements.skillPlacement;
        this.marketPlacement = d.placements.marketPlacement;
        this.auctionPlacement = d.placements.auctionPlacement;

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
    placeBottle: function(action, $event) {
      this.chosenPlacementCost = $event.cost;
      this.chosenAction = action;
      this.chosenPosition = $event.position;
      if(action == 'work'){
        this.workAction($event.position);
      }
      this.$store.state.socket.emit('collectorsPlaceBottle', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        action: action,
        cost: $event.cost,
        position: $event.position
      });
    },

    claimFirstPlayer: function() {
      this.$store.state.socket.emit('collectorsFirstPlayer', {
        roomId: this.$route.params.id,
        playerId: this.playerId
      });
    },

    refill: function() {
      this.$store.state.socket.emit('collectorsRefill', {
        roomId: this.$route.params.id,
        playerId: this.playerId
      });
    },

    drawCard: function() {
      this.$store.state.socket.emit('collectorsDrawCard', {
        roomId: this.$route.params.id,
        playerId: this.playerId
      });
    },

    placeBid: function() {
      var theBid = document.getElementById("myBid").value;
        this.$store.state.socket.emit('collectorsPlaceBid', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          theBid: theBid
        });
      },

    passBid: function() {
      this.$store.state.socket.emit('collectorsPassBid', {
        roomId: this.$route.params.id,
        playerId: this.playerId
      });
    },

    isMyAuctionTurn: function(){
      if(this.players[this.playerId].auctionTurn){
        return true;
      }
        return false;
    },

    winnerAuction: function(){
      if(this.players[this.playerId].auctionWinner){
        return true;
      }
        return false;
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
        cost: this.marketValues[card.item] + this.chosenPlacementCost
      });
    },

    workAction: function(position) {
      console.log("work Action");
      this.$store.state.socket.emit('CollectorsWorkArea', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        cost: this.chosenPlacementCost,
        position: position
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
        cost: this.chosenPlacementCost,
        position: this.chosenPosition
      });
    },

    handleAction: function(card){
      console.log(this.chosenAction);
      if (this.chosenAction === "item") {
        this.buyItem(card);
      }
      else if (this.chosenAction === "skill") {
        this.getSkill(card);
      }
      else if (this.chosenAction === "auction") {
        this.auctionItem(card);
      }
      else if (this.chosenAction === "market") {
        this.raiseValue(card);
      }
    },

    buySkill: function(card) {
      console.log("buySkill", card);
      this.$store.state.socket.emit('collectorsBuySkill', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.chosenPlacementCost
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
}

footer a {
  text-decoration: none;
  border-bottom: 2px dotted ivory;
}

footer a:visited {
  color: ivory;
}

.cardslots {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
  grid-template-rows: repeat(auto-fill, 180px);
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
