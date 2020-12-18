<template>
<div>
  <main>


    <center>{{ labels.invite }}
      <input type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
    </center>

    <div class="game-name">

      <button class="big-button" v-if="players[playerId]" @click="enterName()">CHANGE NAME</button>
      <input v-if="players[playerId]" type="text" v-model="myName" name="name" placeholder="NAME">
    </div>


<div class="secretButton">
  <button class="big-button" v-if="players[playerId]" :disabled='this.chosenAction != "start"' @click="chooseSecret()">
    {{ labels.chooseSecret }}
  </button>
</div>

<div class="firstbuttons">
  <button class="big-button" v-if="players[playerId]" :disabled="disableIGoFirst() || !playersReady()" @click="claimFirstPlayer">
    {{ labels.firstPlayer }}
  </button>
</div>

    <div class="invisPopUp" >
      <span class="messegePopUp" v-if="players[playerId]" :disabled="!nextRound()" @click="refill()" id="roundOverMessage"  >
        {{labels.roundOverMessage}}
      </span>
    </div>
    <hr>

<div class="endGame">
  <button v-if="players[playerId]" @click="countPoints">
    {{ labels.theEnd }}
  </button>
</div>
<div class="theWinner" id="theWinner">Find out who won</div>
<button class="winner" id="winner" @click="winner">WINNER</button>
<div v-if="theWinner" class="whoWon" id="whoWon"> GRATTIS {{theWinner.name}}</div>
<div id="overlay"></div>

<div class="currentPlayer">
  <h5 v-if="isPlaying !== null"> {{isPlaying}} {{ labels.currentPlayer }} </h5>
</div>
<div v-if="players[playerId]"> {{ labels.showRound }} {{this.rounds}} </div>

<div class="invisPopUp">
  <span class="messegePopUp" :disabled="!nextRound()" @click="refill()" id="roundOverMessage">
    {{labels.roundOverMessage}}
  </span>
</div>




<div class="head">



  <div class="your-playerboard">

    <div class="rubrik">

      <center>
        <h2 v-if="players[playerId]">{{players[playerId].name}} <br>{{ labels.yourPlayerBoard}} </h2>
      </center>
      <hr>

    </div>

    <div class="hands">

      {{ labels.hand }}

      <div class="handcards cardslots" v-if="players[playerId]">
        <CollectorsCard v-for="(card, index) in players[playerId].hand" :card="card" :availableAction="card.available" @doAction="handleAction(card)" :key="index" />
      </div>

    </div>



    <div class="youritems" v-if="players[playerId]">
      {{ labels.items }}

      <div v-for="(itemInfo, item) in players[playerId].items" :key="item">
        {{itemInfo.item}}
      <!--  <img id="picitem" :src='showYourItem(item, itemInfo)' width="50"> -->
      </div>
    </div>

    <div class="yourskills" v-if="players[playerId]">
      {{ labels.skills }}
      <div v-for="(skillInfo, skill) in players[playerId].skills" :key='skill'>
    <!--  {{skillInfo.skill}} -->
       <img id="picskill" :src='showYourSkills(skill, skillInfo)' width="50">
      </div>
    </div>

    <div class="other" v-if="players[playerId]">


      {{ labels.bottles }}{{players[playerId].bottles}} <br><br>

      <div>
        Inkomst per runda: {{players[playerId].income}}
      </div><br>
      <center> <img class="coinpic" src="/images/coinpicss.png" width="70"> x {{players[playerId].money}} </center> <br>
      <br>
      <!-- SECRETCARD: -->
      <div class="yourSecret" v-if="players[playerId]" @click='yourSecret()'> {{ labels.secretCard }}
        <img src="/images/chest.png" width="50px">
        <span class="secret-popUp" id="secretYours">
          <CollectorsCard v-for="(card, index) in players[playerId].secret" :card="card" :key="index" />
        </span>
      </div>

    </div>







  </div>



      <div class="opponentsBoard">
        <h3> {{ labels.allPlayers }} </h3>
        <div v-for="(playerInfo, playerId) in players" :key="playerId" :class="['box']" :style='yourColour(playerId)'>
          <h3>{{ labels.playerID }}{{playerId}} ({{players[playerId].name}})</h3>
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
<!--låg en likadan opponentsBoard hör-->
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
      <CollectorsBuySkill v-if="players[playerId]" :labels="labels" :player="players[playerId]" :skillsOnSale="skillsOnSale" :marketValues="marketValues" :placement="skillPlacement" :auctionRunning="auctionRunning" @buySkill="buySkill($event)"
        @placeBottle="placeBottle('skill', $event)" />
    </div>

    <div class="value">
      <div class="leftvalue">
        <CollectorsRaiseValue v-if="players[playerId]" :labels="labels" :player="players[playerId]" :marketValues="marketValues" :placement="marketPlacement" :auctionRunning="auctionRunning" @raiseValue="raiseValue($event)"
          @placeBottle="placeBottle('market', $event)" />
      </div>
      <div class="rightvalue">
        <center>
          <div class="labelmV">
            <h5>{{ labels.marketValues }} </h5>
          </div>
        </center>
        <img src="/images/movie.png" width="50"> x {{marketValues.movie}}

        <img src="/images/music.png" width="50"> x {{marketValues.music}}

        <img src="/images/penguin.png" width="50"> x {{marketValues.fastaval}}

        <img src="/images/robot.png" width="50"> x {{marketValues.figures}}

        <img src="/images/tech.png" width="50"> x {{marketValues.technology}}<br>
      </div>
    </div>

    <div class="auction">
      <div class="upper-auction">
        <CollectorsAuctionItem v-if="players[playerId]" :labels="labels" :player="players[playerId]" :auctionCards="auctionCards" :placement="auctionPlacement" :auctionRunning="auctionRunning" @auctionItem="auctionItem($event)"
          @placeBottle="placeBottle('auction', $event)" />
      </div>
      <div class="lower-auction">

        <div class="altButtons">
          <button class="altButton" v-if="players[playerId]" :disabled="!canIClaim" @click="claimAuctionCard('item')">Place in item</button>
          <button class="altButton" v-if="players[playerId]" :disabled="!canIClaim" @click="claimAuctionCard('skill')">Place in skill</button>
          <button class="altButton" v-if="players[playerId]" :disabled="!canIClaim" @click="claimAuctionCard('market')">Add to market</button>
        </div>

        <div class="auction-place">
          <center>
            <div for="number">
              <h5 v-if="players[playerId]">{{ labels.placeBid }} </h5>
              <h5 v-if="players[playerId] && this.auctionRunning">{{ labels.highestBid }} {{highestBid}}</h5>
            </div>
            <input v-if="players[playerId]" type="number" v-model="myBid" name="bid" :min="recentBid()" :max="playerMoney()" placeholder="Place your bid">
            <div class="altbuttons2">
              <button class="altbutton2" v-if="players[playerId]" :disabled="!isMyAuctionTurn() || winnerAuction() || canNotAfford()" @click="placeBid()">BID</button>
              <button class="altbutton2" v-if="players[playerId]" :disabled="!isMyAuctionTurn() || winnerAuction()" @click="passBid()">PASS</button>
              <button class="altbutton2" v-if="players[playerId]" :disabled="!winnerAuction()" @click="payRestCoins()">PAY</button>
            </div>
          </center>
        </div>

        <div class="head-auction">
          <h5>{{ labels.cardUp }}</h5>
        </div>
        <div class="cardslots card-for-auction">
          <CollectorsCard v-for="(card, index) in theAuctionItem" :card="card" :key="index" />
        </div>
      </div>
    </div>

    <div class="work">
      <CollectorsWorkArea v-if="players[playerId]" :labels="labels" :player="players[playerId]" :placement="workPlacement" :auctionRunning="auctionRunning" @placeBottle="placeBottle('work',$event)" />
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
      numberOfPlayers: 0,
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
      chosenAction: "start",
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
      rounds: 1,
      myName: "",
      theWinner: null,
      isPlaying: null
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
        this.numberOfPlayers = d.playerCount;
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
        this.theWinner = d.theWinner;
        this.showEnd();
      }.bind(this)
    );

    this.$store.state.socket.on('collectorGotMedalj',
      function(d) {
        this.players = d;
        this.showWinner();
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsClaimedFirstPlayer',
      function(d) {
        this.players = d;
        this.isPlaying = this.whoIsPlaying();
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsCardDrawn',
      function(d) {
        //this has been refactored to not single out one player's cards
        //better to update the state of all cards
        this.players = d;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsChangedName',
      function(d) {
        this.players = d;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsPlacedBid',
      function(d) {
        this.players = d.players;
        let highest = 0;
        for (let i = 0; i < Object.keys(this.players).length; i++) {
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
        this.isPlaying = this.whoIsPlaying();
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsItemBought',
      function(d) {
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
        this.isPlaying = this.whoIsPlaying();
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsWorkedArea',
      function(d) {
        this.players = d.players;
        this.isPlaying = this.whoIsPlaying();
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsSkillBought',
      function(d) {
        this.players = d.players;
        this.skillsOnSale = d.skillsOnSale;
        this.isPlaying = this.whoIsPlaying();
      }.bind(this)
    );

    this.$store.state.socket.on("collectorsSecretChoosen",
      function(d) {
        this.players = d.players;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsRaisedValue',
      function(d) {
        this.players = d.players;
        this.marketValues = d.marketValues;
        this.market = d.market;
        this.auctionCards = d.auctionCards;
        this.isPlaying = this.whoIsPlaying();
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsRefilled',
      function(d) {
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
        this.isPlaying = this.whoIsPlaying();

      }.bind(this)
    );


    this.$store.state.socket.on('collectorsItemAuctioned',
      function(d) {
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
      this.$store.state.socket.emit('collectorsPlaceBottle', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        action: action,
        cost: $event.cost,
        position: $event.position
      });
      if (action == 'work') {
        this.workAction($event.position);
      }
    },

    claimFirstPlayer: function() {
      try {
        this.$store.state.socket.emit('collectorsFirstPlayer', {
          roomId: this.$route.params.id,
          playerId: this.playerId
        });
      } catch (error) {
        console.log("not working correctly")
      }
    },

    whoIsPlaying: function() {
      for (let i = 0; i < Object.keys(this.players).length; i++) {
        if (this.players[Object.keys(this.players)[i]].myTurn === true) {
          return this.players[Object.keys(this.players)[i]].name;
        }
      }
    },

    nextRound: function() {
      for (let i = 0; i < Object.keys(this.players).length; i++) {
        for (let j = 0; j < 5; j++) {
          if (this.players[Object.keys(this.players)[i]].bottles[j] === 1) {
            return false;
          }
        }
      }
      let messege = document.getElementById("roundOverMessage");
      messege.classList.toggle('show');
      return true;
    },

    chooseSecret: function() {
      this.chosenAction = "secretCard"
      this.highlightHand(true);
    },

    yourSecret: function() {
      var secret = document.getElementById('secretYours');
      secret.classList.toggle('show');
    },

yourColour: function(playerId){
  if(this.players[playerId].colour){
    return "border-color:"+this.players[playerId].colour;
  }
},

/*
showYourItem: function(item, itemInfo){
  var imgSrc = '/images/'+itemInfo.item+'.png';
  return imgSrc;
},
*/

showYourSkills: function(skill, skillInfo){
  var imgSrc = '/images/'+skillInfo.skill+'.png';
  return imgSrc;
},

    disableIGoFirst: function() {
      for (let i = 0; i < Object.keys(this.players).length; i++) {
        if (this.players[Object.keys(this.players)[i]].iStart != false) {
          return true;
        }
      }
      return false;
    },

    playersReady: function() {
      while (Object.keys(this.players).length < this.numberOfPlayers) {
        return false;
      }
      return true;
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

    showEnd: function(){
        document.getElementById("overlay").style.visibility = "visible";
        document.getElementById("theWinner").style.visibility = "visible";
        document.getElementById("winner").style.visibility = "visible";
    },

    showWinner: function(){
      document.getElementById("theWinner").style.visibility = "hidden";
      document.getElementById("winner").style.visibility = "hidden";
      document.getElementById("whoWon").style.visibility = "visible";
    },

    winner: function() {
      this.$store.state.socket.emit('collectorWon', {
        roomId: this.$route.params.id
      });
    },

    refill: function() {
      this.$store.state.socket.emit('collectorsRefill', {
        roomId: this.$route.params.id,
        playerId: this.playerId
      });
    },

//Ta bort draw card
    drawCard: function() {
      this.$store.state.socket.emit('collectorsDrawCard', {
        roomId: this.$route.params.id,
        playerId: this.playerId
      });
    },

    enterName: function() {
      var theName = this.myName;
      this.$store.state.socket.emit('collectorsChangeName', {
        roomId: this.$route.params.id,
        playerId: this.playerId,
        theName: theName
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

    playerMoney: function() {
      return this.players[this.playerId].moneyCard;
    },

    recentBid: function() {
      return this.highestBid;
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

.invisPopUp {
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-left: 20px;
  font-size: 18px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.invisPopUp .messegePopUp {
  visibility: hidden;
  width: 500px;
  font-size: 40px;
  color: black;
  background-color:  #e6e6ff;
  text-align: center;
  border-style: solid;
  border-radius: 10px;
  border-color: #232425;
  padding: 8px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: 100px;
}

.invisPopUp .messegePopUp::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.invisPopUp .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}

.yourSecret {
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-left: 20px;
  font-size: 18px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: beige;
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
  display: grid;
  grid-template-areas:
    'rubrik rubrik'
    'hands rest'
    'skills items';
  grid-template-rows: 1fr 2fr 1fr;
  grid-template-columns: 2fr 1fr;
  background-color: #e6e6ff;
  max-height: 500px;
  max-width: 800px;

  border: 1px solid lightgrey;
  margin-top: 60px;
  padding: 20px;
  border-radius: 70px;


}

.rubrik {
  grid-area: rubrik;
}

.yourskills {
  grid-area: skills;
}

.youritems {
  grid-area: items;
}

.hands {
  grid-area: hands;
  margin-bottom: 40px;
}

.other {
  grid-area: rest;
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
  border: 5px solid black;
}

.gamezone {
  font-family: "Lexend Deca", sans-serif;
  font-weight: bold;
  color: black;

  grid-area: gameboard;
  display: grid;
  grid-template-areas:
    'item item auction '
    'skill work auction'
    'value value value'
    'thehand thehand thehand'
    'rest rest rest';
  max-width: 1000px;
  width: 800px;


  grid-template-columns: 300px 240px 300px;
  grid-template-rows: 300px 860px 185px 1fr 1fr;

  height: 500px;
  margin: 60px;
  color: black;
}

.item {
  grid-area: item;
  background-color: #FFDBDB;
  border-top: 2px solid black;
  border-left: 2px solid black;
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
  padding-top: 67px;
}

.labelmV {
  border-bottom: 2px solid black;
  border-left: 2px solid black;
  border-top: 2px solid black;
}

.auction {
  grid-area: auction;
  display: grid;
  grid-template-areas: 'upper-auction''lower-auction';
  grid-template-rows: 630px 300px;
  background-color: #FFFFDB;
  border-right: 2px solid black;
  border-top: 2px solid black;
}

.upper-auction {
  grid-area: upper-auction;
  padding-left: 25px;

}

.lower-auction {
  grid-area: lower-auction;
  display: grid;
  grid-template-areas: 'header header''card4auction bidButtons''altButtons altButtons';
  grid-template-rows: 90px 240px 100px;
  grid-template-columns: 190px 100px;

}

.auction-place {
  grid-area: altButtons;
  padding-top: 20px;
}

.highest-bid {
  grid-area: altButtons;
}

.head-auction {
  grid-area: header;
  padding-left: 28px;
}

.card-for-auction {
  grid-area: card4auction;
  background-color: #ffe6b3;
  padding-left: 10px;
  padding-top: 10px;
  margin: 10px;
  border: 10px dashed white;
}

.coinpic {
  boarder-radius: 50%;
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


}

.altButton {
  width: 50px;
  height: 50px;
  margin: 25px;
  margin-top: 10px;
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
  font-size: 13px;
}

.cardslots {
  display: grid;
  grid-template-columns: repeat(auto-fill, 70px);
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

.theWinner {
  visibility: hidden;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid black;
  border-radius: 10px;
  z-index: 10;
  background-color: white;
  font-size: 100px;
  max-width: 80%;
  font-weight: bold;
}

#overlay {
  visibility: hidden;
  position: fixed;
  opacity: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  pointer-events: all;
}

.winner {
  visibility: hidden;
  position: fixed;
  top: 63%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid black;
  z-index: 10;
  background-color: gold;
  width: 100px;
  height: 100px;
  color: black;
  font-family: "Lexend Deca", sans-serif;
  font-size: 20px;
  transition: all 0.4s ease 0s;
}

.whoWon {
  visibility: hidden;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid black;
  border-radius: 10px;
  z-index: 10;
  background-color: gold;
  width: 400px;
  height: 250px;
  color: black;
  font-family: "Lexend Deca", sans-serif;
  font-size: 80px;
  transition: all 0.4s ease 0s;
  text-align: center;
}

@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700");
* {
  box-sizing: border-box;
}
*::before, *::after {
  box-sizing: border-box;
}
body {
  font-family: 'OpenSans', sans-serif;
  font-size: 1rem;
  line-height: 2;
  display: flex;
          align-items: center;
          justify-content: center;
  margin: 0;
  min-height: 100vh;
  background: rgba(246, 241, 209);
}
button {
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  text-decoration: none;
  font-size: 1.5rem;
    color:rgb(106, 163, 137);
  font-weight: 700;
  text-transform: uppercase;
  font-family: inherit;
}

button.big-button {
   padding: 1em 2em;
   border: 2px solid rgb(106, 163, 137);
  border-radius: 1em;
  background: rgb(205, 255, 232);
transform-style: preserve-3d;
   transition: all 175ms cubic-bezier(0, 0, 1, 1);
}
button.big-button::before {
  position: absolute;
  content: '';
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgb(150, 232, 195);
  border-radius: inherit;
    box-shadow: 0 0 0 2px rgb(121, 186, 156), 0 0.75em 0 0  rgb(106, 163, 137);
 transform: translate3d(0, 0.75em, -1em);
     transition: all 175ms cubic-bezier(0, 0, 1, 1);
}


button.big-button:hover {
  background: rgb(187, 232, 211);
  transform: translate(0, 0.375em);
}

button.big-button:hover::before {
  transform: translate3d(0, 0.75em, -1em);
}

button.big-button:active {
            transform: translate(0em, 0.75em);
}

button.big-button:active::before {
  transform: translate3d(0, 0, -1em);

      box-shadow: 0 0 0 2px rgb(121, 186, 156), 0 0.25em 0 0 rgb(121, 186, 156);

}

button.big-button:disabled {
  opacity: 0;
}


</style>
