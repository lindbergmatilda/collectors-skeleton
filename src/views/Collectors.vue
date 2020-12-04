<template>
<div>
  <main>
    <div class="buttons">
      <button @click="drawCard">
        {{ labels.draw }}
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
    <!--<div class="cardslots">
        <CollectorsCard v-for="(card, index) in skillsOnSale" :card="card" :key="index"/>
      </div>-->
      <hr>
      <CollectorsAuctionItem v-if="players[playerId]"
      :labels="labels"
      :player="players[playerId]"
      :auctionCards="auctionCards"
      :placement="auctionPlacement"
      @auctionItem="auctionItem($event)"
      @placeBottle="placeBottle('auction', $event)" />

    <!--hr>
    Auction
    <div class="cardslots">
      <CollectorsCard v-for="(card, index) in auctionCards" :card="card" :key="index" />
    </div-->
    <hr>
    Auction Area
    <div class="cardslots">
      <CollectorsCard v-for="(card, index) in theAuctionItem" :card="card" :key="index" />
    </div>
    <!--div class="buttons">
      <button @click="claimAuctionCard">
        {{ labels.claim }}
      </button>
    </div-->
    <div class="altButtons">
      <button @click="claimAuctionCard('item')">Place in item</button>
      <button @click="claimAuctionCard('skill')">Place in skill</button>
      <button @click="claimAuctionCard('market')">Add to market</button>
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

    handleAction: function(card){
      console.log(this.chosenAction);
      if (this.chosenAction === "item") {
        console.log("inne i if i handleaction");
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
