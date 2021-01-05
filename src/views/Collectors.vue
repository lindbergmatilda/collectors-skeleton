<template>
<div>
  <main>



<div class="invite-link">
    {{ labels.invite }}
      <input type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
</div>


<div class="firstbuttons">
  <button class="big-button" v-if="players[playerId]" :disabled="disableIGoFirst() || !playersReady()" @click="claimFirstPlayer">
    {{ labels.firstPlayer }}
  </button>
</div>

<div class="endGame">
  <button class="big-button" v-if="players[playerId]" @click="countPoints">
      {{ labels.theEnd }}
    </button>
  </div>



<div class="theWinner" id="theWinner"> {{ labels.findOutWinner }} </div>
<button class="winner" id="winner" @click="winner"> {{ labels.winnerButton }} </button>
<div v-if="theWinner" class="whoWon" id="whoWon"> {{ labels.congratz }} {{theWinner.name}} <img src="/images/trophy.jpg" width='500em'> </div>
<div id="overlay"></div>


<div class="actiontextbox">
    <div class="currentPlayer">
      <h5 v-if="isPlaying !== null && auctionRunning == false"> {{isPlaying}} {{ labels.currentPlayer }} </h5>
    </div>





<div v-if="players[playerId]" class="actionInfo">
  <h5 v-if="players[playerId].myTurn==true && chosenAction ==null && auctionRunning == false"> {{ labels.moveActionInfo }} </h5>
  <h5 v-else-if="players[playerId].myTurn==true && chosenAction == 'item'"> {{ labels.itemActionInfo }} </h5>
  <h5 v-else-if="players[playerId].myTurn==true && chosenAction == 'skill'">  {{ labels.skillActionInfo }} </h5>
  <h5 v-else-if="players[playerId].myTurn==true && chosenAction == 'auction'">  {{ labels.auctionActionInfo }} </h5>
  <h5 v-else-if="players[playerId].auctionTurn==true && chosenAction == 'bid'">  {{ labels.bidActionInfo }} </h5>
  <h5 v-else-if="players[playerId].auctionTurn==true && chosenAction == 'pay'">  {{ labels.payActionInfo }} </h5>
  <h5 v-else-if="players[playerId].auctionTurn==true && chosenAction == 'placeCard'">  {{ labels.placeCardActionInfo }} </h5>

</div>
</div>

<div v-if="players[playerId]" class="invisPopUp">
  <span class="messegePopUp" :disabled="!nextRound()" @click="refill()" id="roundOverMessage">
    {{labels.roundOverMessage}}
  </span>
</div>

<div class="auctionPopUp">
  <span class="auctionMessage" id="auctionMessageId">
    {{labels.auctionMessage}}
  </span>
</div>



<div class="head">
  <div class="your-playerboard">

    <div class="popupYour" @click='helpYour()'>   ?   <span class="yourhelp-text" id="YourPopup"> HIT SKA BILDEN hejhopp{{labels.helpYour}}</span>

    </div>

    <div class="rubrik">
      <center>
        <h2 v-if="players[playerId]">{{players[playerId].name}} <br>{{ labels.yourPlayerBoard}} </h2>
      </center>
      <div v-if="players[playerId]"> {{ labels.showRound }} {{this.rounds}} </div>
      <hr>
    </div>

    <div class="hands">

    <h4>  {{ labels.hand }}</h4>

      <div class="handcards cardslots" v-if="players[playerId]">
        <CollectorsCard v-for="(card, index) in players[playerId].hand" :card="card" :availableAction="card.available" @doAction="handleAction(card)" :key="index" />
      </div>

    </div>



    <div class="youritems" v-if="players[playerId]">
  <h4>   {{ labels.items }} </h4>

      <div v-for="(itemInfo, item) in players[playerId].items" :key="item">

        <img id="picitem" :src='showYourItem(item, itemInfo)' width="60">
      </div>
    </div>

    <div class="yourskills" v-if="players[playerId]">
  <h4>    {{ labels.skills }}</h4>
      <div v-for="(skillInfo, skill) in players[playerId].skills" :key='skill'>
    <!--  {{skillInfo.skill}} -->
       <img id="picskill" :src='showYourSkills(skill, skillInfo)' width="40">
      </div>
    </div>

    <div class="other" v-if="players[playerId]">

      {{ labels.bottles }}{{numberOfMoves(playerId)}}<br><br>

      <div>
      {{ labels.income }} {{players[playerId].income}}
      </div><br>
      <center> <img class="coinpic" src="/images/coinpicss.png" width="70"> x {{players[playerId].money}} </center> <br>
      <br>
      <!-- SECRETCARD: -->
      <div class="yourSecret" v-if="players[playerId]" @click='yourSecret()'> {{ labels.secretCard }}
        <img src="/images/chest.png" width="40px">
        <span class="secret-popUp" id="secretYours">
          <CollectorsCard v-for="(card, index) in players[playerId].secret" :card="card" :key="index" />
        </span>
      </div>

    </div>







  </div>



      <div class="opponentsBoard">
        <center><h3> {{ labels.allPlayers }} </h3></center>
        <div v-for="(playerInfo, playerId) in players" :key="playerId" :class="['box']" :style='yourColour(playerId)'>
          <h3>{{players[playerId].name}}</h3>
          <h5> {{ labels.items }} </h5>
          <div>
          <span v-for="(itemInfo, item) in players[playerId].items" :key="item">
            <img id="picitem" :src='showYourItem(item, itemInfo)' width="60">
          </span>
          </div>
          <h5> {{ labels.skills }} </h5>
          <div>
          <span v-for="(skillInfo, skill) in players[playerId].skills" :key="skill">
            <img id="picskill" :src='showYourSkills(skill, skillInfo)' width="40">
          </span>
          </div>
          <h5> {{ labels.bottles }}{{numberOfMoves(playerId)}} </h5>


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
            <div class="altbuttons2"><br><br>
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



<div class="lightbox">

  <div class="iframeContainer">
    <div class="toolbarLB">

      <div class="game-name">


<h3> {{ labels.playerName }}: </h3>
       <center> <input class="input1" v-if="players[playerId]" type="text" v-model="myName" name="name" placeholder='PLAYER NAME'>
    </center>  </div>
<br>

  <div class="secretButton">
    <button class="big-button" v-if="players[playerId]" :disabled='this.chosenAction != "start"' @click="chooseSecret()">
      {{ labels.chooseSecret }}
    </button>
  </div>

  <br><br>
  <div class="handcards cardslots cardslotsecret" v-if="players[playerId]">
    <CollectorsCard v-for="(card, index) in players[playerId].hand" :card="card" :availableAction="card.available" @doAction="handleAction(card)" :key="index" />
  </div>



<button class="big-button play" v-if="players[playerId]" @click="enterName(); lightBoxClose()" > {{labels.startgame}}</button>
    </div>
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
        this.chosenAction = "placeCard";
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsPassedBid',
      function(d) {
        this.players = d.players;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsClaimedCard',
      function(d) {

        let messege = document.getElementById("auctionMessageId");
        messege.classList.toggle('show');
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
        this.chosenAction =null;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsItemBought',
      function(d) {
        this.players = d.players;
        this.itemsOnSale = d.itemsOnSale;
        this.isPlaying = this.whoIsPlaying();
        this.chosenAction =null;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsWorkedArea',
      function(d) {
        this.players = d.players;
        this.isPlaying = this.whoIsPlaying();
        this.chosenAction =null;
      }.bind(this)
    );

    this.$store.state.socket.on('collectorsSkillBought',
      function(d) {
        this.players = d.players;
        this.skillsOnSale = d.skillsOnSale;
        this.isPlaying = this.whoIsPlaying();
        this.chosenAction =null;
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
        this.chosenAction =null;
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
        this.workPlacement = d.placements.workPlacement;

        this.rounds = d.rounds;
        this.isPlaying = this.whoIsPlaying();

        let messege = document.getElementById("roundOverMessage");
        messege.classList.toggle('show');

      }.bind(this)
    );


    this.$store.state.socket.on('collectorsItemAuctioned',
      function(d) {
        let messege = document.getElementById("auctionMessageId");
        messege.classList.toggle('show');

        this.players = d.players;
        this.auctionCards = d.auctionCards;
        this.theAuctionItem = d.theAuctionItem;
        this.auctionRunning = true;
        this.chosenAction ="bid";
      }.bind(this)
    );
  },

  methods: {

    helpYour: function() {
      var popupYour = document.getElementById('YourPopup');
      popupYour.classList.toggle('show');

    },

    numberOfMoves: function(playerId) {
      var moves = 0;
      if (this.players[playerId].bottles != null){
      for(var i = 0; i < this.players[playerId].bottles.length; i++) {
        if(this.players[playerId].bottles[i] == 1){
        moves++;}
      }
      return moves;
      }

    },

  /*changeColor: function(playerId) {
            document.getElementById(
              "Myelement").style.backgroundColor =
                this.players[playerId].colour;
        },
*/


    lightBoxClose: function() {
  document.querySelector(".lightbox").classList.add("closed");
},


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
      if(this.rounds < 4){
        let messege = document.getElementById("roundOverMessage");
        messege.classList.toggle('show');
      }
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


showYourItem: function(item, itemInfo){
  var imgSrc = '/images/item-'+itemInfo.item+'.png';
  return imgSrc;
},


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
        document.getElementById("auctionMessageId").innerHTML = this.labels.auctionWinnerMessage;
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
      document.getElementById("auctionMessageId").innerHTML = this.labels.auctionMessage;
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
  margin-right: auto;
  margin-left: auto;
  width:95em;
}

.actiontextbox {
  background-color: white;
  opacity: 0.85;
  padding: 0.7em;
  box-shadow: 0 0.25em 0.5em 0 rgba(0, 0, 0, 0.2), 0 0.375em 1.25em 0 rgba(0, 0, 0, 0.19); /* 4/16, 8/16, 6/16, 20/16 */
  border-radius: 0.5em;
  max-width: 100em;
  min-width: 20em;
  position: fixed;
  -webkit-backface-visibility: hidden;
  z-index: 10;
}

.head {
  display: grid;
  grid-template-areas:
    'gameboard your-board'
    'gameboard other-boards';
  grid-template-columns: 3fr 2fr;
  grid-template-rows: 1fr 1fr;
  font-family: "Lexend Deca", sans-serif;


}
.auctionPopUp{
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-left: 5.313em; /* 85/16 */
  margin-bottom: -2.5em; /* -40/16 */
  font-size: 1.125em; /* 18/16 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.auctionPopUp .auctionMessage{
  visibility: hidden;
  width: 31.25em; /* 500/16 */
  font-size: 2em;
  color: black;
  background-color:  #e6e6ff;
  text-align: center;
  border-style: solid;
  border-radius: 0.625em; /* 10/16 */
  border-color: #232425;
  padding: 1em 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: 4em;
  margin-bottom: 0.625em; /* 10/16 */
}

.auctionPopUp .auctionMessage::after{
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -0.313em; /* -5/16 */
  border-width: 0.313em; /* 5/16 */
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.auctionPopUp .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}


.invisPopUp {
  position: relative;
  display: inline-block;
  cursor: pointer;
  margin-left: 1.25em; /* 20/16 */
  font-size: 1.125em; /* 18/16 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.invisPopUp .messegePopUp {
  visibility: hidden;
  width: 31.25em; /* 500/16 */
  font-size: 2.5em; /* 40/16 */
  color: black;
  background-color:  #e6e6ff;
  text-align: center;
  border-style: solid;
  border-radius: 0.625em; /* 10/16 */
  border-color: #232425;
  padding: 0.5em 0; /* 8/16 */
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: 2em; /* 100/16 */
  margin-bottom: -2.2em;
}

.invisPopUp .messegePopUp::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -0.313em; /* -5/16 */
  border-width: 0.313em; /* 5/16 */
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
  margin-left: 1.25em; /* 20/16 */
  font-size: 0.925em; /* 18/16 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

}

.yourSecret:hover{
  scale:1.3;
  transition: all 0.3s ease 0.3s;
}

.yourSecret .secret-popUp {

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

.yourSecret .secret-popUp::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -0.313em; /* -5/16 */
  border-width: 0.313em; /* 5/16 */
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
    'rubrik rubrik rubrik'
    'hands hands hands'
    'skills items rest';
  grid-template-rows: 1fr 3fr 2fr;
  grid-template-columns: 1fr 1fr 2fr;
  background-color: #e6e6ff;
  max-height: 43.75em; /* 700/16 */
  min-width: 22em; /* 400/16 */
  max-width: 34.5em; /* 600/16 */
  margin: 1.075em;

  border-radius: 10%;
  margin-top: 3.75em; /* 60/16 */
  padding: 1.25em; /* 20/16 */
  box-shadow: 0 0.25em 0.5em 0 rgba(0, 0, 0, 0.2), 0 0.375em 1.25em 0 rgba(0, 0, 0, 0.19); /* 4/16, 8/16, 6/16, 20/16 */
scale: 0.9;

}

.rubrik {
  grid-area: rubrik;
}

.popupYour {
  position: absolute;
    text-align: center;
    background-color: #BCDBEA;
    color: white;
    border-radius: 50%;
    width: 1.5em; /* 24/16 */
    height: 1.5em; /* 24/16 */
    font-size: 1.188em; /* 19/16 */
    line-height: 1.625em; /* 26/16 */
    cursor: default;
    margin: 1.825em; /* 10/16 */

  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

}

.popupYour:hover{
  font-size: 1.3em; /* 30/16 */
  cursor: pointer;
  background-color: #5F9EA0;
  transition: all 0.4s ease 0.2s;
}

.popupYour .yourhelp-text {

    visibility: hidden;
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

.popupYour .yourhelp-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -0.313em; /* -5/16 */
  border-width: 0.313em; /* 5/16 */
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.popupYour .show {
  visibility: visible;
  -webkit-animation: fadeIn 1s;
  animation: fadeIn 1s;
}

.yourskills {
  grid-area: skills;
}

.youritems {
  grid-area: items;
}

.hands {
  grid-area: hands;
  margin-bottom: 5.5em; /* 40/16 */
}

.other {
  grid-area: rest;
  margin: 0.938em; /* 15/16 */
}




.opponentsBoard {
  font-family: "Lexend Deca", sans-serif;
  color: black;
  grid-area: other-boards;
  margin: 0.625em; /* 10/16 */
  padding: 1.25em; /* 20/16 */
  display: grid;
  grid-gap: 0.625em; /* 10/16 */
  grid-template-columns: auto;
  max-width: 35em; /* 400/16 */
  max-height: 12.5em; /* 200/16 */
}

.box {
  background-color: white;
  border: 0.5em solid black;
  border-radius: 2.5em;  /*40/16 */
  color: black;
  padding: 0.938em; /* 15/16 */
  margin: 0.875em;
  box-shadow: 0 0.25em 0.5em 0 rgba(0, 0, 0, 0.2), 0 0.375em 1.25em 0 rgba(0, 0, 0, 0.19); /* 4/16, 8/16, 6/16, 20/16 */
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
    'value value value';
  max-width: 62.5em; /* 1000/16 */
/*  width: 50em;  800/16 */


  grid-template-columns: 18.75em 15em 18.75em; /* 300/16, 240/16, 300/16 */
  grid-template-rows: 18.75em 53.75em 11.563em; /* 300/16, 860/16, 185/16 */

margin: 0.875em; /* 30/16 */
  color: black;
  scale: 0.9;

}

.item {
  grid-area: item;
  background-color: #FFDBDB;

}

.skill {
  grid-area: skill;
  background-color: #EDFFDB;

}

.value {
  grid-area: value;
  background-color: #DBFFED;

  display: grid;
  grid-template-areas: 'left right';
  grid-template-columns: 1fr 1fr;
  margin-bottom:-1em;
}

.leftvalue {
  grid-area: left;
}

.rightvalue {
  grid-area: right;
  padding-top: 4.188em; /* 67/16 */

}

.labelmV {
  border-bottom: 0.125em solid black; /* 2/16 */
  border-left: 0.125em solid black; /* 2/16 */
  border-top: 0.125em solid black; /* 2/16 */
}

.auction {
  grid-area: auction;
  display: grid;
  grid-template-areas: 'upper-auction'
                       'lower-auction';
  grid-template-rows: 39.375em 18.75em; /* 630/16, 300/16 */
  background-color: #FFFFDB;

}

.upper-auction {
  grid-area: upper-auction;
  padding-left: 1.563em; /* 25/16 */

}

.lower-auction {
  grid-area: lower-auction;
  display: grid;
  grid-template-areas: 'header header''card4auction bidButtons''altButtons altButtons';
  grid-template-rows: 5.625em 15em 6.25em; /* 90/16, 240/16, 100/16 */
  grid-template-columns: 11.875em 6.25em; /* 190/16, 100/16 */

}

.auction-place {
  grid-area: altButtons;
  padding-top: 1.25em; /* 20/16 */
}

.highest-bid {
  grid-area: altButtons;
}

.head-auction {
  grid-area: header;
  padding-left: 1.75em; /* 28/16 */
}

.card-for-auction {
  grid-area: card4auction;
  background-color: #ffe6b3;
  padding-left: 0.625em; /* 10/16 */
  padding-top: 0.625em; /* 10/16 */
  margin: 0.625em; /* 10/16 */
  border: 0.625em dashed white; /* 10/16 */
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
  border: 0.625em; /* 10/16 */
  color: white;

}

.altButtons {
  grid-area: bidButtons;


}

.altButton {
  width: 6.125em; /* 50/16 */
  height: 3.125em; /* 50/16 */
  margin: 1.563em; /* 25/16 */
  margin-top: 0.625em; /* 10/16 */
  color: black;
  text-transform: capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 0.625em; /* 10/16 */
  background: orange;
  border-radius: 1.25em; /* 20/16 */
  border: none;
  transition: all 0.4s ease 0s;
}

.altButton:hover:enabled {
  text-shadow: 0em 0em 0.375em rgba(255, 255, 255, 1); /* 0/16, 0/16, 6/16 */
  -webkit-box-shadow: 0em 0.313em 2.5em -0.625em rgba(0, 0, 0, 0.57); /* 0/16, 5/16, 40/16, -10/16 */
  -moz-box-shadow: 0em 0.313em 2.5em -0.625em rgba(0, 0, 0, 0.57); /* 0/16, 5/16, 40/16, -10/16 */
  transition: all 0.4s ease 0.2s;
  background: #ffc34d;
  width: 8.25em; /* 100/16 */
}

button:disabled,
button[disabled] {
  color: grey;
  opacity: 0.5;
}

.altbuttons2 {
  grid-area: bidButtons;
  padding: -1.563em; /* 25/16 */
  padding-left: 1.25em; /* 20/16 */
}

.altbutton2 {
  width: 3.5em; /* 40/16 */
  height: 2.5em; /* 40/16 */
  margin-top: -11.25em; /* -100/16 */

  color: black;
  text-transform: capitalize;
  font-family: "Lexend Deca", sans-serif;
  font-size: 0.625em; /* 10/16 */
  background: lightgrey;
  border-radius: 1.25em; /* 20/16 */
  border: none;
  transition: all 0.4s ease 0s;
}

.altbutton2:hover:enabled {
  text-shadow: 0em 0em 0.375em rgba(255, 255, 255, 1); /* 0/16, 0/16, 6/16 */
  -webkit-box-shadow: 0em 0.313em 2.5em -0.625em rgba(0, 0, 0, 0.57); /* 0/16, 5/16, 40/16, -10/16 */
  -moz-box-shadow: 0em 0.313em 2.5em -0.625em rgba(0, 0, 0, 0.57); /* 0/16, 5/16, 40/16, -10/16 */
  transition: all 0.4s ease 0.2s;
  background: #ffc34d;
  font-size: 0.813em; /* 13/16 */
}

.cardslots {
  display: grid;
  grid-template-columns: repeat(auto-fill, 4.375em); /* 70/16 */
  grid-template-rows: repeat(auto-fill, 5em); /* 80/16 */
}

.cardslots div {
  transform: scale(0.5)translate(-50%, -50%);
  transition: 0.2s;
  transition-timing-function: ease-out;
  z-index: 1;
}

.cardslots div:hover {
  transform: scale(1)translate(-0.5%, 0%);
  z-index: 2;
}

@media screen and (max-width: 50em) { /* 800/16 */
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
  border: 0.125em solid gold; /* 2/16 */
  border-radius: 0.5em; /* 10/16 */
  z-index: 10;
  background-color: white;
  font-size: 6.25em; /* 100/16 */
  width: 10em; /* 400/16 */
  height: 4.5em; /* 250/16 */
  max-width: 80%;
  font-weight: bold;
  text-align: center;
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
  border: 0.125em solid black; /* 2/16 */
  border-radius: 0.5em; /* 10/16 */
  z-index: 10;
  background-color: gold;
  width: 8em; /* 100/16 */
  height: 8em; /* 100/16 */
  color: black;
  font-family: "Lexend Deca", sans-serif;
  font-size: 1.25em; /* 20/16 */
  transition: all 0.4s ease 0s;
}

.whoWon {
  visibility: hidden;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 0.125em solid gold; /* 2/16 */
  border-radius: 0.625em; /* 10/16 */
  z-index: 10;
  background-color: white;
  width: 12em; /* 400/16 */
  height: 6em; /* 250/16 */
  color: black;
  font-family: "Lexend Deca", sans-serif;
  font-size: 5em; /* 80/16 */
  transition: all 0.4s ease 0s;
  text-align: center;
}

.game-name {
  font-size: 1.2em;
    color:rgb(106, 163, 137);
}

@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700");
* {
  box-sizing: border-box;
}
*::before, *::after {
  box-sizing: border-box;
}

button {
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  text-decoration: none;
  font-size: 0.9em;
    color:rgb(106, 163, 137);
  font-weight: 700;
  text-transform: uppercase;
  font-family: inherit;
}

button.big-button {
   padding: 1em 2em;
   border: 0.125em solid rgb(106, 163, 137); /* 2/16 */
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
    box-shadow: 0 0 0 0.125em rgb(121, 186, 156), 0 0.75em 0 0  rgb(106, 163, 137); /* 2/16 */
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

      box-shadow: 0 0 0 0.125em rgb(121, 186, 156), 0 0.25em 0 0 rgb(121, 186, 156); /* 2/16 */

}

button.big-button:disabled {
  opacity: 0;
}

.endGame{
  position:absolute;
     top:0.9em;
     right:-3em;
  scale:0.63;
}

.invite-link {
  position:absolute;
     top:1.5em;
     right:41em;
  scale:1.1;
}

.firstbuttons{
  position:absolute;
     top:1.5em;
     right:13.5em;
  scale:1.1;
}

.lightbox {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, .8);

}
.toolbarLB {
  text-align: center;
  padding: 0.188em; /* 3/16 */
}



.lightbox .iframeContainer {
  vertical-align: middle;
  background: #CCC;
  padding: 1.875em; /* 30/16 */

}

.cardslotsecret {
  margin-left: 5em;
}


.lightbox.closed {
  display: none;
}

.input1 {
  font-size: 1em;  /* 16/16 */
  font-size: max(1em, 1em); /* 16/16 */
  font-family: inherit;
  padding: 0.25em 0.5em;
  background-color: #fff;
  border-radius: 0.25em; /* 4/16 */
  width: 25.625em; /* 410/16 */
  height: 3.125em; /* 50/16 */
}
.play{
  position: relative;
  z-index: 0;
  margin-top: 8.5em;
  margin-bottom: 2em;
  scale: 1.4;


}

.play:hover{

  color: orange;
  transition: all 0.3s linear 0.2s;

}




@media screen and (max-width: 800px) {

  .main {
    scale: 0.2;
  }

  .head {
      display: grid;
      grid-template-areas:
        'gameboard gameboard'
        'your-board other-boards';

      grid-template-columns: 3fr 2fr;
      grid-template-rows: 1fr 1fr;


  }

}

@media screen and (max-width: 680px) {

  main {
    scale: 0.9;
    margin-top: -10em;

  }

  .actiontextbox{
    scale:0.5;
    position: fixed;
    -webkit-backface-visibility: hidden;
  }

  .head {
      display: grid;
      grid-template-areas:
        'gameboard gameboard'
        'your-board other-boards';

      grid-template-columns: 3fr 2fr;
      grid-template-rows: 1fr 1fr;



  }

  .lightbox {
  scale: 0.9;
  margin-right: auto;
  margin-left: auto;
  width: 1000px;
  }



  .your-playerboard {
    width: 135%;

  }

  .endGame{
    position:absolute;
       top: 1em;
       right: -24.5em;
    scale:0.63;

  }
  .invite-link {
    position:absolute;
       top:4.5em;
       right:-22em;
    scale:1.1;
  }

  .firstbuttons{
    position:absolute;
       top:1.5em;
       right:12em;
    scale:1.1;
  }

.opponentsBoard{
  width: 130%;
  margin-left: 7em;

}

}

</style>
