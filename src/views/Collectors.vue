<template>
<div>
  <main>

    <p>
      {{ labels.invite }}
      <input type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
    </p>
    <div class="firstbuttons">
      <button v-if="players[playerId]" :disabled="disableIGoFirst()" @click="claimFirstPlayer">
        {{ labels.firstPlayer }}
      </button>
    </div>
    <div class="secretButton">
      <button v-if="players[playerId]" :disabled='this.chosenAction != "secretCard"' @click="chooseSecret()">
        {{ labels.chooseSecret }}
      </button>
    </div>
    <div class="refillbuttons">
      <button v-if="players[playerId]" :disabled="!nextRound()" @click="refill">
        {{ labels.refill }}
      </button>
    </div>
    <div class="endGame">
      <button v-if="players[playerId]" :disabled="!endGame()" @click="countPoints">
        {{ labels.theEnd }}
      </button>
    </div>

    <div class="yourSecret" v-if="players[playerId]" @click='yourSecret()'> {{ labels.secretCard }}
      <span class="secret-popUp" id="secretYours">
        <CollectorsCard v-for="(card, index) in players[playerId].secret"
        :card="card"
        :key="index" />
      </span>
    </div>

    <div class="head">
      <div class="your-playerboard">
        <center>
          <h2>{{ labels.yourPlayerBoard }}</h2>
        </center>

        {{ labels.hand }}

        <hr>
        <div class="cardslots" v-if="players[playerId]">
          <CollectorsCard v-for="(card, index) in players[playerId].hand"
          :card="card"
          :availableAction="card.available"
          @doAction="handleAction(card)"
          :key="index" />
        </div>

        {{ labels.items }}

        <hr>
        <div class="cardslots" v-if="players[playerId]">
          <CollectorsCard v-for="(card, index) in players[playerId].items"
          :card="card"
          :key="index" />
        </div>

        {{ labels.skills }}

        <hr>
        <div class="cardslots" v-if="players[playerId]">
          <CollectorsCard v-for="(card, index) in players[playerId].skills"
          :card="card"
          :key="index" />
        </div>
      </div>

      <div class="opponentsBoard">
        <h3> {{ labels.allPlayers }} </h3>
        <div v-for="(playerInfo, playerId) in players" :key="playerId" :class="['box']">
          <h3>{{ labels.playerID }}{{playerId}}</h3>
          <img src="https://www.bestseller.se/wp-content/uploads/2017/05/Malou_von_Sivers_400x400px.jpg" width="110">
          <h5> {{ labels.items }} </h5>
          <div v-for="(itemInfo, item) in players[playerId].items" :key="item">
            {{itemInfo.item}}
          </div>
          <h5> {{ labels.skills }} </h5>
          <div v-for="(skillInfo, skill) in players[playerId].skills" :key="skill">
            {{skillInfo.skill}}
          </div>
          <h5> {{ labels.bottles }}{{players[playerId].bottles}} </h5>
        </div>
      </div>

      <div class="gamezone">

        <div class="item">
          <collectorsBuyItem v-if="players[playerId]"
          :labels="labels"
          :player="players[playerId]"
          :itemsOnSale="itemsOnSale"
          :marketValues="marketValues"
          :placement="itemPlacement"
          :auctionRunning="auctionRunning"
          @buyItem="buyItem($event)"
          @placeBottle="placeBottle('item', $event)" />
        </div>

        <div class="skill">
          <CollectorsBuySkill v-if="players[playerId]"
          :labels="labels"
          :player="players[playerId]"
          :skillsOnSale="skillsOnSale"
          :marketValues="marketValues"
          :placement="skillPlacement"
          :auctionRunning="auctionRunning"
          @buySkill="buySkill($event)"
          @placeBottle="placeBottle('skill', $event)" />
        </div>

        <div class="value">
          <div class="leftvalue">
            <CollectorsRaiseValue v-if="players[playerId]" :labels="labels" :player="players[playerId]" :marketValues="marketValues" :placement="marketPlacement" :auctionRunning="auctionRunning" @raiseValue="raiseValue($event)"
              @placeBottle="placeBottle('market', $event)" />
          </div>
          <div class="rightvalue">
            <h5>{{ labels.marketValues }} </h5>
            <img src="/images/movie.png" width="50"> x {{marketValues.movie}}
            <hr class="blueline">
            <img src="/images/music.png" width="50"> x {{marketValues.music}}
            <hr class="blueline">
            <img src="/images/penguin.png" width="50"> x {{marketValues.fastaval}}
            <hr class="blueline">
            <img src="/images/robot.png" width="50"> x {{marketValues.figures}}
            <hr class="blueline">
            <img src="/images/tech.png" width="50"> x {{marketValues.technology}}<br>
          </div>
        </div>

        <div class="auction">
          <div class="upper-auction">
            <CollectorsAuctionItem v-if="players[playerId]"
            :labels="labels"
            :player="players[playerId]"
            :auctionCards="auctionCards"
            :placement="auctionPlacement"
            :auctionRunning="auctionRunning"
            @auctionItem="auctionItem($event)"
            @placeBottle="placeBottle('auction', $event)" />
          </div>
          <div class="lower-auction">

            <div class="altButtons">
              <button class="altButton" v-if="players[playerId]" :disabled="!canIClaim" @click="claimAuctionCard('item')">Place in item</button>
              <button class="altButton" v-if="players[playerId]" :disabled="!canIClaim" @click="claimAuctionCard('skill')">Place in skill</button>
              <button class="altButton" v-if="players[playerId]" :disabled="!canIClaim" @click="claimAuctionCard('market')">Add to market</button>
            </div>

            <div class="highest-bid">
              {{highestBid}}
            </div>
            <div class="auction-place">
              <center>
                <div for="number">
                  <h5 v-if="players[playerId]">{{ labels.placeBid }} </h5>
                  <h5 v-if="players[playerId] && this.auctionRunning">{{ labels.maxBid }} {{players[playerId].moneyCard}}</h5>
                </div>
                <input v-if="players[playerId]" type="number" v-model="myBid" name="bid" :min="recentBid()" :max="playerMoney()" placeholder="Place your bid">
                <div class="altbuttons2">
                  <button class="altbutton2" v-if="players[playerId]" :disabled="!isMyAuctionTurn() || winnerAuction() || canNotAfford()" @click="placeBid()">BID</button>
                  <button class="altbutton2" v-if="players[playerId]" :disabled="!isMyAuctionTurn() || winnerAuction()" @click="passBid()">PASS</button>
                  <button class="altbutton2" v-if="players[playerId]" :disabled="!winnerAuction()" @click="payRestCoins()">PAYX</button>
                </div>
              </center>
            </div>

            <div class="head-auction">
              <h5>{{ labels.cardUp }}</h5>
            </div>
            <div class="cardslots card-for-auction">
              <CollectorsCard v-for="(card, index) in theAuctionItem"
              :card="card"
              :key="index" />
            </div>
          </div>
        </div>

        <div class="work">
          <CollectorsWorkArea v-if="players[playerId]"
          :labels="labels"
          :player="players[playerId]"
          :placement="workPlacement"
          :auctionRunning="auctionRunning"
          @placeBottle="placeBottle('work',$event)" />
        </div>

        <div class="theRest">
        </div>

      </div>
    </div>
  </main>
</div>
</template>

<script>
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
      chosenAction: "secretCard",
      canIClaim: false,
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
      theAuctionItem: [],
      auctionRunning: false,
      highestBid: null,
      myBid: 0,
      rounds: 1
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

    this.$store.state.socket.on('collectorsDonePlayed',
      function(d) {
        this.players = d.players;
      }.bind(this)
    );

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
        let highest = 0;
        for (let i = 0; i < Object.keys(this.players).length; i++) {
          console.log("Här: ", );
          if (this.players[Object.keys(this.players)[i]].bid > highest) {
            highest = this.players[Object.keys(this.players)[i]].bid;
          }
        }
        this.highestBid = highest;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsPaidAuction',
      function(d) {
        this.players = d.players;
        if (this.players[this.playerId].bid > 0) {
          this.highlightHand(true);
        }
      }.bind(this)
    );

    this.$store.state.socket.on('paidAuctionRestCoins',
      function(d) {
        this.players = d.players;
        if (this.players[this.playerId].bid === 0) {
          this.highlightHand(false);
        }
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
        this.canIClaim = false;
        this.highestBid = null;
        this.auctionRunning = false;
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

    this.$store.state.socket.on("collectorsSecretChoosen",
      function(d) {
        this.players = d.players;
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
        console.log("refill: ", this.rounds);
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

        this.rounds = d.rounds;

      }.bind(this)
    );


    this.$store.state.socket.on('collectorsItemAuctioned',
      function(d) {
        console.log(d.playerId, "auctioned a card");
        this.players = d.players;
        this.auctionCards = d.auctionCards;
        this.theAuctionItem = d.theAuctionItem;
        this.auctionRunning = true;
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
      if (action == 'work') {
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

    nextRound: function() {
      for (let i = 0; i < Object.keys(this.players).length; i++) {
        for (let j = 0; j < 5; j++) {
          if (this.players[Object.keys(this.players)[i]].bottles[j] === 1) {
            return false;
          }
        }
      }
      return true;
    },

    chooseSecret: function() {
      this.highlightHand(true);
    },

    yourSecret: function(){
      var secret = document.getElementById('secretYours');
      secret.classList.toggle('show');
    },

    disableIGoFirst: function() {
      for (let i = 0; i < Object.keys(this.players).length; i++) {
        if (this.players[Object.keys(this.players)[i]].iStart != false) {
          return true;
        }
      }
      return false;
    },

    endGame: function() {
      for (let i = 0; i < Object.keys(this.players).length; i++) {
        for (let j = 0; j < 5; j++) {
          if (this.players[Object.keys(this.players)[i]].bottles[j] === 1) {
            return false;
          }
        }
      }
      if (this.rounds === 4) {
        return true;
      }
    },

    countPoints: function() {
      this.$store.state.socket.emit('collectorsDonePlaying', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        marketValues: this.marketValues
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
      var theBid = this.myBid;
      this.$store.state.socket.emit('collectorsPlaceBid', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        theBid: theBid
      });
    },

    playerMoney: function(){
    return this.players[this.playerId].moneyCard;
  },

  recentBid: function(){
    return  this.highestBid;
  },

    canNotAfford: function() {
      if (this.players[this.playerId].moneyCard < this.highestBid) {
        return true;
      } else {
        return false;
      }
    },

    passBid: function() {
      this.$store.state.socket.emit('collectorsPassBid', {
        roomId: this.$route.params.id,
        playerId: this.playerId
      });
    },

    isMyAuctionTurn: function() {
      if (this.players[this.playerId].auctionTurn) {
        return true;
      }
      return false;
    },

    winnerAuction: function() {
      if (this.players[this.playerId].auctionWinner) {
        this.highlightHand(true);
        this.chosenAction = "pay";
        return true;
      }
      return false;
    },

    payAuction: function(card) {
      if (card.available) {
        this.$store.state.socket.emit('payAuction', {
          roomId: this.$route.params.id,
          playerId: this.playerId,
          cost: this.playerId.bid,
          card: card
        });
      }
    },

    payRestCoins: function() {
      this.chosenAction = null;
      this.$store.state.socket.emit('payAuctionRestCoins', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        cost: this.players[this.playerId].bid
      });
      this.canIClaim = true;
    },

    highlightHand: function(boolean) {
      for (let i = 0; i < this.players[this.playerId].hand.length; i += 1) {
        this.$set(this.players[this.playerId].hand[i], "available", boolean);
      }
    },

    claimAuctionCard: function(buttonAction) {
      this.auctionRunning = false;
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
      this.$store.state.socket.emit('CollectorsWorkArea', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        cost: this.chosenPlacementCost,
        position: position
      });
    },

    auctionItem: function(card) {
      console.log("auctionItem", card);
      this.chosenAction = null;
      this.$store.state.socket.emit('collectorsAuctionItem', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.chosenPlacementCost
      });
    },

    secretCard: function(card) {
      this.chosenAction = null;
      this.$store.state.socket.emit("collectorsSecretCard", {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card

      });
    },

    raiseValue: function(card) {
      console.log("raiseValue", card);
      this.chosenAction = null;
      this.$store.state.socket.emit('collectorsRaiseValue', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        card: card,
        cost: this.chosenPlacementCost,
        position: this.chosenPosition
      });
    },

    handleAction: function(card) {
      console.log(this.chosenAction);

      if (this.chosenAction === "item") {
        this.buyItem(card);
      } else if (this.chosenAction === "skill") {
        this.getSkill(card);
      } else if (this.chosenAction === "pay") {
        this.payAuction(card);
      } else if (this.chosenAction === "auction") {
        this.auctionItem(card);
      } else if (this.chosenAction === "market") {
        this.raiseValue(card);
      } else if (this.chosenAction === "secretCard") {
        this.secretCard(card);
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

.head {
  display: grid;
  grid-template-areas:
    'gameboard your-board'
    'gameboard other-boards'
    'bottom-grid bottom-grid';
  grid-template-columns: 3fr 2fr;
  grid-template-rows: 1fr 1fr 1fr;
  max-width: 2000px;

  font-family: "Lexend Deca", sans-serif;
}

.yourSecret {
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-left: 20px;
  font-size: 30px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.yourSecret .secret-popUp {

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

.yourSecret .secret-popUp::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.yourSecret .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
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
  font-family: "Lexend Deca", sans-serif;
  color: black;
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
  font-family: "Lexend Deca", sans-serif;
  font-weight: bold;
  color: black;

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

  grid-template-columns: 380px 200px 320px;
  grid-template-rows: 300px 1090px 1fr 1fr 1fr;

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

.leftvalue {
  grid-area: left;
}

.rightvalue {
  grid-area: right;
}

.auction {
  grid-area: auction;
  display: grid;
  grid-template-areas: 'upper-auction''lower-auction';
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
  grid-template-areas: 'header header''card4auction bidButtons''altButtons auction-info';
  grid-template-rows: 90px 240px 100px;
  grid-template-columns: 190px 100px;

}

.auction-place {
  grid-area: altButtons;
  margin:10px;
}

.highest-bid {
  grid-area: altButtons;
}

.head-auction {
  grid-area: header;
  padding: 14px;
}

.card-for-auction {
  grid-area: card4auction;
  background-color: lightgrey;
  margin:10px;
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

.altButtons {
  grid-area: bidButtons;
  padding: 25px;
  padding-left: 20px;

}

.altButton {
  width: 50px;
  height: 50px;
  margin: 40px;
  margin-top: -100px;
  color: black;
  text-transform: capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 10px;
  background: orange;
  border-radius: 20px;
  border: none;
  transition: all 0.4s ease 0s;
}

.altButton:hover:enabled {
  text-shadow: 0px 0px 6px rgba(255, 255, 255, 1);
  -webkit-box-shadow: 0px 5px 40px -10px rgba(0, 0, 0, 0.57);
  -moz-box-shadow: 0px 5px 40px -10px rgba(0, 0, 0, 0.57);
  transition: all 0.4s ease 0.2s;
  background: #ffc34d;
  width: 100px;
}

button:disabled,
button[disabled] {
  color: grey;
  opacity: 0.5;
}

.altbuttons2 {
  grid-area: bidButtons;
  padding: 25px;
  padding-left: 20px;
}
.altbutton2 {
  width: 40px;
  height: 40px;
  margin-top: -100px;

  color: black;
  text-transform: capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 10px;
  background: lightgrey;
  border-radius: 20px;
  border: none;
  transition: all 0.4s ease 0s;
}

.altbutton2:hover:enabled {
  text-shadow: 0px 0px 6px rgba(255, 255, 255, 1);
  -webkit-box-shadow: 0px 5px 40px -10px rgba(0, 0, 0, 0.57);
  -moz-box-shadow: 0px 5px 40px -10px rgba(0, 0, 0, 0.57);
  transition: all 0.4s ease 0.2s;
  background: #ffc34d;
  width: 100px;
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
