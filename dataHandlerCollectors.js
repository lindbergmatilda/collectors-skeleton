'use strict';

let csv = require("csvtojson");

let collectorsDeck = "collectors-cards";
let languages = ["en", "se"];
/* https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array */
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Store data in an object to keep the global namespace clean
function Data() {
  this.data = {};
  this.rooms = {};
}


/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

/*
  Function to load initial data from CSV files into the object
*/
Data.prototype.initializeTable = function(table) {
  csv({
      checkType: true
    })
    .fromFile("./data/" + table + ".csv")
    .then((jsonObj) => {
      this.data[table] = jsonObj;
    });
};

Data.prototype.initializeData = function() {
  console.log("Starting to build data tables");
  for (let i in languages) {
    this.initializeTable(collectorsDeck);
  }
}

Data.prototype.getUILabels = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let lang = room.lang;
    var ui = require("./data/collectors-" + lang + ".json");
    return ui;
  } else return {};
}

Data.prototype.createRoom = function(roomId, playerCount, lang = "en") {
  let room = {};
  room.players = {};
  room.playerList = [];
  room.colourList = ["#9D6FCD","#328EDA","#ED8E14","#49C528"];
  room.rounds = 1;
  room.lang = lang;
  room.deck = this.createDeck(lang);
  room.playerCount = playerCount;
  console.log("vi väntar på ", playerCount);
  room.itemsOnSale = room.deck.splice(0, 5);
  room.skillsOnSale = room.deck.splice(0, 5);
  room.auctionCards = room.deck.splice(0, 4);
  room.theAuctionItem = [];
  room.market = [];
  room.itemPlacement = [{
      cost: 1,
      playerId: null,
      position: 0
    },
    {
      cost: 1,
      playerId: null,
      position: 1
    },
    {
      cost: 2,
      playerId: null,
      position: 2
    },
    {
      cost: 2,
      playerId: null,
      position: 3
    },
    {
      cost: 3,
      playerId: null,
      position: 4
    }
  ];
  room.skillPlacement = [{
      cost: 0,
      playerId: null,
      position: 0
    },
    {
      cost: 0,
      playerId: null,
      position: 1
    },
    {
      cost: 0,
      playerId: null,
      position: 2
    },
    {
      cost: 1,
      playerId: null,
      position: 3
    },
    {
      cost: 1,
      playerId: null,
      position: 4
    }
  ];
  room.auctionPlacement = [{
      cost: -2,
      playerId: null,
      position: 0
    },
    {
      cost: -1,
      playerId: null,
      position: 1
    },
    {
      cost: 0,
      playerId: null,
      position: 2
    },
    {
      cost: 0,
      playerId: null,
      position: 3
    }
  ];
  room.marketPlacement = [{
      cost: 0,
      playerId: null,
      position: 0
    },
    {
      cost: -2,
      playerId: null,
      position: 1
    },
    {
      cost: 0,
      playerId: null,
      position: 2
    }
  ];
  room.workPlacement = [{
      cost: -2,
      playerId: null,
      position: 0
    },
    {
      cost: -1,
      playerId: null,
      position: 1
    },
    {
      cost: 1,
      playerId: null,
      position: 2
    },
    {
      cost: 0,
      playerId: null,
      position: 3
    },
    {
      cost: 0,
      playerId: null,
      position: 4
    }
  ];
  this.rooms[roomId] = room;
}

Data.prototype.createDeck = function() {
  // we want a copy of the deck array, not a reference to it so we use the
  // spread operator (...) to copy the items. Note that this is a shallow copy
  // so it is not generalizable to all copy problems
  let deck = [...this.data[collectorsDeck]];
  return shuffle(deck);
}

Data.prototype.joinGame = function(roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    if (typeof room.players[playerId] !== 'undefined') {
      console.log("Player", playerId, "joined again with info", room.players[playerId]);
      return true;
    } else if (Object.keys(room.players).length < room.playerCount) {
      console.log("Player", playerId, "joined for the first time");
      room.players[playerId] = {
        hand: [],
        money: 2,
        points: 0,
        skills: [],
        items: [],
        discard: [],
        colour: null,
        income: 0,
        secret: [],
        myTurn: false,
        iStart: false,
        bid: null,
        moneyCard: 0,
        auctionTurn: false,
        auctionWinner: false,
        bottles: [1, 1, 0, 0, 0],
        bottleAmount: 2
      };


      room.playerList.push(room.players[playerId]);
      for (let i = 0; i < 4; i += 1) {
        let card = room.deck.pop();
        room.players[playerId].hand.push(card);
      }

      return true;
    }
    console.log("Player", playerId, "was declined due to player limit");
  }
  return false;
}

Data.prototype.getPlayers = function(id) {
  let room = this.rooms[id]
  if (typeof room !== 'undefined') {
    return room.players;
  } else return {};
}

Data.prototype.getRound = function(id) {
  let room = this.rooms[id]
  if (typeof room !== 'undefined') {
    return room.rounds;
  } else return {};
}

Data.prototype.getMoneyCard = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    for (let i=0; i<room.playerList.length; i++){
      let money = room.playerList[i].money;
      for (let j=0; j<room.playerList[i].hand.length; j++){
        if (room.playerList[i].hand[j].skill.includes("VP")){
          money +=2;
        }
        else{
          money +=1;
        }
      }
      room.playerList[i].moneyCard = money;
    }
  } else return {};
}

Data.prototype.countPoints = function(roomId, playerId, marketValues) {
  let room = this.rooms[roomId]
  if (typeof room !== 'undefined') {
    for (let i = 0; i < room.playerList.length; i++) {
      let valuePoints = 0;
      let dict = {music: 0, fastaval:0, technology:0, movie: 0, figures:0};
      let allItems = false;
      for (let j = 0; j < room.playerList[i].items.length; j++) {
        let theItem = room.playerList[i].items[j].item;
        dict[theItem] += 1;
        valuePoints += marketValues[theItem];

        if (room.playerList[i].skills.length != 0) {
          for (let k = 0; k < room.playerList[i].skills.length; k++) {
            if (room.playerList[i].skills[k].skill.includes(theItem)) {
              valuePoints += 1;
            }
            if (room.playerList[i].skills[k].skill.includes("all")) {
              if (Object.keys(dict).includes(0)){
                break;
              }
              else{
                allItems = true;
              }
            }
          }
        }
      }
      if(allItems){
        valuePoints +=5;
      }
      valuePoints += Math.floor(room.playerList[i].money / 3);
      room.playerList[i].points = valuePoints;
    }
  }
}

Data.prototype.claimedFirst = function(roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    room.players[playerId].myTurn = true;
    room.players[playerId].iStart = true;

    for (let i=0; i<room.playerCount; i++){
      if (room.players[playerId]===room.playerList[i]){
        let startPosition =i;
        let steps=0;

        for (let j=startPosition; j<room.playerCount-1; j++){
          steps +=1;
          room.playerList[j+1].money+=steps;
          }
        for(let j=-1; j<startPosition-1; j++){
          steps +=1;
          room.playerList[j+1].money+=steps;
        }
        }
      }
      return room.players;
    }
  else return {};
}

/* returns players after a new card is drawn */
/*drawcard ej klar! */
Data.prototype.drawCard = function(roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let card = room.deck.pop();
    //inte sant längre, borde göra for-loop över bottles istället
    if (room.players[playerId].bottleAmount != 0) {
      room.players[playerId].hand.push(card);
      for (let i = 0; i < room.players[playerId].bottles.length; i++) {
        if (room.players[playerId].bottles[i] === 1) {
          room.players[playerId].bottles[i] = 0;
          room.players[playerId].bottleAmount -= 1;
          break;
        }
      }
    }
    return room.players;
  } else return [];
}

Data.prototype.placeBid = function(roomId, playerId, theBid) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    room.players[playerId].bid = theBid;
    room.players[playerId].auctionTurn = false;

    for (let i = 0; i < room.playerList.length; i++) {
      if (room.players[playerId] === room.playerList[i]) {
        if (room.players[playerId] === room.playerList[room.playerList.length - 1]) {
          room.playerList[0].auctionTurn = true;
        } else {
          room.playerList[i + 1].auctionTurn = true;
        }
      }
    }
    return room.players;
  } else return [];
}

Data.prototype.passBid = function(roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    room.players[playerId].bid = 0;
    room.players[playerId].auctionTurn = false;

    for (let i = 0; i < room.playerList.length; i++) {
      if (room.players[playerId] === room.playerList[i]) {
        if (room.players[playerId] === room.playerList[room.playerList.length - 1]) {
          room.playerList[0].auctionTurn = true;
        } else {
          room.playerList[i + 1].auctionTurn = true;
        }
      }
    }

    let bidders = 0;
    for (let j=0; j< room.playerList.length; j++){
      if (room.playerList[j].bid !== 0){
        bidders +=1;
      }
    }

    if(bidders === 1){
      for (let k=0; k< room.playerList.length; k++){
        if (room.playerList[k].bid !== 0){
          room.playerList[k].auctionWinner = true;
        }
      }
    }

    return room.players;
  } else return [];
}

Data.prototype.claimAuctionCard = function(roomId, playerId, buttonAction) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let card = room.theAuctionItem.pop();
    if (buttonAction === 'item') {
      room.players[playerId].items.push(card);
    }
    if (buttonAction === 'skill') {

      if (card.skill == "bottle") {
        room.players[playerId].bottleAmount += 1;
        for (let i = 0; i < room.players[playerId].bottles.length; i++) {
          if (room.players[playerId].bottles[i] == 0) {
            room.players[playerId].bottles[i] = 1;
            break;
          }
        }
      }
      room.players[playerId].skills.push(card);
    }

    if (buttonAction === 'market') {
      room.market.push(card);
    }
    room.theAuctionItem = [];

    for (let i=0; i<room.playerList.length; i++){
      room.playerList[i].bid = null;
      room.playerList[i].auctionTurn = false;
    }

    console.log("från data efter claim:", room.players);

    return room.players;
  } else return [];
}

/* moves card from itemsOnSale to a player's hand */
Data.prototype.buyItem = function(roomId, playerId, card, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;
    for (let i = 0; i < room.itemsOnSale.length; i += 1) {
      if (room.itemsOnSale[i].x === card.x &&
        room.itemsOnSale[i].y === card.y) {
        c = room.itemsOnSale.splice(i, 1, {});
        break;
      }
    }
    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {

      if (room.players[playerId].hand[i].x === card.x &&
        room.players[playerId].hand[i].y === card.y) {
        c = room.players[playerId].hand.splice(i, 1);
        break;
      }
    }
    room.players[playerId].items.push(...c);
    room.players[playerId].money -= cost;
    room.players[playerId].myTurn = false;

    nextplayer: for (let i = 0; i < room.playerCount; i++) {
      if (room.players[playerId] === room.playerList[i]) {
        let startPosition = i;

        for (let j = startPosition; j < room.playerCount - 1; j++) {
          if (room.playerList[j + 1].bottles.includes(1)) {
            room.playerList[j + 1].myTurn = true;
            break nextplayer;
          }
        }
        for (let j = -1; j < startPosition; j++) {
          if (room.playerList[j + 1].bottles.includes(1)) {
            room.playerList[j + 1].myTurn = true;
            break nextplayer;
          }
        }
      }
    }
  }
}

Data.prototype.payAuction= function(roomId, playerId, cost, card){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;
    let cardValue = 0;

    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      if (room.players[playerId].hand[i].x === card.x &&
        room.players[playerId].hand[i].y === card.y) {
        c = room.players[playerId].hand.splice(i, 1);

        if (card.skill.includes("VP")){
          cardValue +=2;
        }
        else{
          cardValue +=1;
        }
        room.players[playerId].discard.push(...c);
        room.players[playerId].bid -= cardValue;
        break;
      }
    }

  }
}

Data.prototype.secretCard = function(roomId, playerId, card){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;

    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      if (room.players[playerId].hand[i].x === card.x &&
        room.players[playerId].hand[i].y === card.y) {
        c = room.players[playerId].hand.splice(i, 1);
        break;
      }
    }

    room.players[playerId].secret.push(...c);

    for(let i = 0; i<room.playerList.length; i++){
      room.playerList[i].colour = room.colourList[i];
    }
    console.log("spelarna: ", room.players);
  }
}

Data.prototype.payAuctionCard = function(roomId, playerId, cost){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    room.players[playerId].money -= cost;
    room.players[playerId].bid -= cost;
    room.players[playerId].auctionWinner = false;
    console.log(cost, " status ", room.players[playerId]);
    return room.players;
  }
}

Data.prototype.raiseValue = function(roomId, playerId, card, cost, position) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;

    if ( position === 0){
      for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
        if (room.players[playerId].hand[i].x === card.x &&
          room.players[playerId].hand[i].y === card.y) {
          c = room.players[playerId].hand.splice(i, 1);
          break;
        }
      }
      room.market.push(...c);
      for( let j = room.auctionCards.length; j>0; j--){
        if(room.auctionCards[j] !== undefined){
          let auctionCard = room.auctionCards.splice(j, 1);
          room.market.push(...auctionCard);
          break;
        }
      }
    }

    if ( position === 1){
      for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
        if (room.players[playerId].hand[i].x === card.x &&
          room.players[playerId].hand[i].y === card.y) {
          c = room.players[playerId].hand.splice(i, 1);
          break;
        }
      }
      room.market.push(...c);
    }

    if ( position === 2){
      let deckCard = room.deck.pop();
      room.market.push(deckCard);
    }

    room.players[playerId].money -= cost;
    room.players[playerId].myTurn = false;

    nextplayer: for (let i = 0; i < room.playerCount; i++) {
      if (room.players[playerId] === room.playerList[i]) {
        let startPosition = i;

        for (let j = startPosition; j < room.playerCount - 1; j++) {
          if (room.playerList[j + 1].bottles.includes(1)) {
            room.playerList[j + 1].myTurn = true;
            break nextplayer;
          }
        }
        for (let j = -1; j < startPosition; j++) {
          if (room.playerList[j + 1].bottles.includes(1)) {
            room.playerList[j + 1].myTurn = true;
            break nextplayer;
          }
        }
      }
    }
    }
  }

Data.prototype.refillGameboard = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {

    //tar kort från skill till market
    if (room.skillsOnSale.length != 0) {
      for (let i = 0; i < room.skillsOnSale.length; i += 1) {
        if (room.skillsOnSale[i].item != undefined) {
          let card = room.skillsOnSale.splice(i, 1);
          room.market.push(...card);
          break;
        }
      }
    }

    //tar kort från auction till till market
    if (room.auctionCards.length != 0) {
      for (let i = 0; i < room.auctionCards.length; i += 1) {
        if (room.auctionCards[i].item != undefined) {
          let card = room.auctionCards.splice(i, 1);
          room.market.push(...card);
          break;
        }
      }
    }

    // trycker ihop skillsOnSale
    for (let i = 0; i < room.skillsOnSale.length; i += 1) {
      if (room.skillsOnSale[i].item == undefined) {
        room.skillsOnSale.splice(i, 1);
        i -= 1;
      }
    }

    // trycker ihop itemsOnSale
    for (let i = 0; i < room.itemsOnSale.length; i += 1) {
      if (room.itemsOnSale[i].item == undefined) {
        room.itemsOnSale.splice(i, 1);
        i -= 1;
      }
    }

    // trycker ihop auctionCards
    for (let i = 0; i < room.auctionCards.length; i += 1) {
      if (room.auctionCards[i].item == undefined) {
        room.auctionCards.splice(i, 1);
        i -= 1;
      }
    }

    //fyller på skills med i första hand items, annars högen
    for (let i = room.skillsOnSale.length; i < 5; i += 1) {
      if (room.itemsOnSale.length == 0) {
        let card = room.deck.pop();
        room.skillsOnSale.push(card);
      } else {
        let card = room.itemsOnSale.splice(0, 1);
        room.skillsOnSale.push(...card);
      }
    }

    // fyller på items från högen!
    for (let i = room.itemsOnSale.length; i < 5; i += 1) {
      let card = room.deck.pop();
      room.itemsOnSale.push(card);
    }

    // fyller på auction
    for (let i = room.auctionCards.length; i < 4; i += 1) {
      let card = room.deck.pop();
      room.auctionCards.push(card);
    }

    // ställer om knapparna
    for (let i = 0; i < room.itemPlacement.length; i++) {
      room.itemPlacement[i].playerId = null;
    }
    for (let i = 0; i < room.skillPlacement.length; i++) {
      room.skillPlacement[i].playerId = null;
    }
    for (let i = 0; i < room.auctionPlacement.length; i++) {
      room.auctionPlacement[i].playerId = null;
    }
    for (let i = 0; i < room.marketPlacement.length; i++) {
      room.marketPlacement[i].playerId = null;
    }
    room.rounds +=1;
  }
}

Data.prototype.nextRoundPlayers = function(roomId, players) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {

for(let i=0; i<room.playerList.length; i++){
    room.playerList[i].myTurn = false;
    if(room.playerList[i].iStart){
      room.playerList[i].myTurn = true;
    }
  }

    for (let i = 0; i < room.playerList.length; i += 1) {
      room.playerList[i].money += room.playerList[i].income; //ger spelaren pengar

      for (let j = 0; j < room.playerList[i].bottleAmount; j += 1) {
        room.playerList[i].bottles[j] = 1;
      }
      if (room.playerList[i].bottles[2] === 0) {
        let card = room.deck.pop();
        room.playerList[i].hand.push(card);
      }
      if (room.playerList[i].bottles[3] === 0) {
        room.playerList[i].money += 1;
      }
      if (room.playerList[i].bottles[4] === 0) {
        room.playerList[i].money += 2;
      }
    }
  }
}

Data.prototype.buySkill = function(roomId, playerId, card, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;

    for (let i = 0; i < room.skillsOnSale.length; i += 1) {
      if (room.skillsOnSale[i].x === card.x &&
        room.skillsOnSale[i].y === card.y) {
        c = room.skillsOnSale.splice(i, 1, {});
        break;
      }
    }
    for (let i = 0; i < room.players[playerId].skills.length; i += 1) {
      if (room.players[playerId].skills[i].x === card.x &&
        room.players[playerId].skills[i].y === card.y) {
        c = room.players[playerId].skills.splice(i, 1);
        break;
      }
    }

    if (c[0].skill == "bottle") {
      room.players[playerId].bottleAmount += 1;
      room.players[playerId].bottles[0] = 1;
    }

    room.players[playerId].skills.push(...c);
    room.players[playerId].money -= cost;
    room.players[playerId].myTurn = false;

    nextplayer: for (let i = 0; i < room.playerCount; i++) {
      if (room.players[playerId] === room.playerList[i]) {
        let startPosition = i;

        for (let j = startPosition; j < room.playerCount - 1; j++) {
          if (room.playerList[j + 1].bottles.includes(1)) {
            room.playerList[j + 1].myTurn = true;
            break nextplayer;
          }
        }
        for (let j = -1; j < startPosition; j++) {
          if (room.playerList[j + 1].bottles.includes(1)) {
            room.playerList[j + 1].myTurn = true;
            break nextplayer;
          }
        }
      }
    }
  }
}

Data.prototype.auctionItem = function(roomId, playerId, card, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;

    for (let i = 0; i < room.playerList.length; i += 1) {
      for (let j = 0; j < room.playerList[i].skills.length; j += 1) {
        if (room.playerList[i].skills[j].skill === "auctionIncome") {
          room.playerList[i].money += 1;
        }
      }
    }

    for (let i = 0; i < room.auctionCards.length; i += 1) {
      if (room.auctionCards[i].x === card.x &&
        room.auctionCards[i].y === card.y) {
        c = room.auctionCards.splice(i, 1, {});
        break;
      }
    }
    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      if (room.players[playerId].hand[i].x === card.x &&
        room.players[playerId].hand[i].y === card.y) {
        c = room.players[playerId].hand.splice(i, 1);
        break;
      }
    }
    room.theAuctionItem.push(...c);
    room.players[playerId].money -= cost;
    room.players[playerId].myTurn = false;
    room.players[playerId].auctionTurn = true;

    nextplayer: for (let i = 0; i < room.playerCount; i++) {
      if (room.players[playerId] === room.playerList[i]) {
        let startPosition = i;

        for (let j = startPosition; j < room.playerCount - 1; j++) {
          if (room.playerList[j + 1].bottles.includes(1)) {
            room.playerList[j + 1].myTurn = true;
            break nextplayer;
          }
        }
        for (let j = -1; j < startPosition; j++) {
          if (room.playerList[j + 1].bottles.includes(1)) {
            room.playerList[j + 1].myTurn = true;
            break nextplayer;
          }
        }
      }
    }
  }
}

Data.prototype.workArea = function(roomId, playerId, cost, position) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;

for(let i = 0; i<room.players[playerId].skills.length; i++){
      if (room.players[playerId].skills[i].skill === "workerIncome"){
        room.players[playerId].money += 2;
      }
      if (room.players[playerId].skills[i].skill === "workerCard"){
        let cardFromDeck = room.deck.pop();
        room.players[playerId].hand.push(cardFromDeck);
    }
  }

      if (position === 0 ) {
        room.players[playerId].income+=2;
      }

      else if (position === 1 ) {
        room.players[playerId].bottleAmount -=1;
        for (let i=room.players[playerId].bottles.length; i>0; i--){
          if (room.players[playerId].bottles[i]===1){
            room.players[playerId].bottles[i]=0;
            break;
          }
        }
      }

      else if (position === 2) {
        let card1 = room.deck.pop();
        let card2 = room.deck.pop();
        room.players[playerId].hand.push(card1);
        room.players[playerId].hand.push(card2);

      }

      else if (position === 3 ) {
        let card = room.deck.pop();
        room.players[playerId].hand.push(card);
        for (let i=0; i<room.playerList.length; i++){
          room.playerList[i].iStart=false;
        }
        room.players[playerId].iStart=true;
      }

      else if (position === 4 ) {
        let card = room.deck.pop();
        room.players[playerId].hand.push(card);
        room.players[playerId].income+=1;
      }
      room.players[playerId].money -= cost;
      room.players[playerId].myTurn = false;

      nextplayer: for (let i = 0; i < room.playerCount; i++) {
        if (room.players[playerId] === room.playerList[i]) {
          let startPosition = i;

          for (let j = startPosition; j < room.playerCount - 1; j++) {
            if (room.playerList[j + 1].bottles.includes(1)) {
              room.playerList[j + 1].myTurn = true;
              break nextplayer;
            }
          }
          for (let j = -1; j < startPosition; j++) {
            if (room.playerList[j + 1].bottles.includes(1)) {
              room.playerList[j + 1].myTurn = true;
              break nextplayer;
            }
          }
        }
      }
  }
}

Data.prototype.placeBottle = function(roomId, playerId, action, cost, position) {
  let room = this.rooms[roomId];

  if (typeof room !== 'undefined') {

    for (let i = 0; i < room.players[playerId].bottles.length; i++) {
      if (room.players[playerId].bottles[i] === 1) {
        room.players[playerId].bottles[i] = 0;
        break;
      }
    }

    let activePlacement = [];
    if (action === "item") {
      activePlacement = room.itemPlacement;
    } else if (action === "skill") {
      activePlacement = room.skillPlacement;
    } else if (action === "auction") {
      activePlacement = room.auctionPlacement;
    } else if (action === "market") {
      activePlacement = room.marketPlacement;
    } else if (action === "work") {
      activePlacement = room.workPlacement;
    }
    for (let i = 0; i < activePlacement.length; i += 1) {
      if (activePlacement[i].position === position &&
        activePlacement[i].playerId === null) {
        activePlacement[i].playerId = playerId;
        break;
      }
    }
  }
}
/* returns the hand of the player */
Data.prototype.getCards = function(roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let i = room.players.map(d => d.playerId).indexOf(playerId)
    return room.players[i].hand;
  } else return [];
}

Data.prototype.getPlacements = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return {
      itemPlacement: room.itemPlacement,
      skillPlacement: room.skillPlacement,
      auctionPlacement: room.auctionPlacement,
      marketPlacement: room.marketPlacement,
      workPlacement: room.workPlacement
    }
  } else return {};
}

Data.prototype.getItemsOnSale = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.itemsOnSale;
  } else return [];
}

Data.prototype.getMarketValues = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let mv = {
      fastaval: 0,
      movie: 0,
      technology: 0,
      figures: 0,
      music: 0
    };
    for (let cardIndex in room.market) {
      mv[room.market[cardIndex].market] += 1;
    }
    return mv;
  } else return [];
}

Data.prototype.getMarketCards = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.market;
  } else return [];
}

Data.prototype.getSkillsOnSale = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.skillsOnSale;
  } else return [];
}

Data.prototype.getAuctionCards = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.auctionCards;
  } else return [];
}

Data.prototype.getAuctionItem = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.theAuctionItem;
  } else return [];
}

module.exports = Data;
