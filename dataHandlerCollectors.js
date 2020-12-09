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
  room.lang = lang;
  room.deck = this.createDeck(lang);
  room.playerCount = playerCount;
  room.itemsOnSale = room.deck.splice(0, 5);
  room.skillsOnSale = room.deck.splice(0, 5);
  room.auctionCards = room.deck.splice(0, 4);
  room.theAuctionItem = [];
  room.market = [];
  room.itemPlacement = [{
      cost: 1,
      playerId: null
    },
    {
      cost: 1,
      playerId: null
    },
    {
      cost: 2,
      playerId: null
    },
    {
      cost: 2,
      playerId: null
    },
    {
      cost: 3,
      playerId: null
    }
  ];
  room.skillPlacement = [{
      cost: 0,
      playerId: null
    },
    {
      cost: 0,
      playerId: null
    },
    {
      cost: 0,
      playerId: null
    },
    {
      cost: 1,
      playerId: null
    },
    {
      cost: 1,
      playerId: null
    }
  ];
  room.auctionPlacement = [{
      cost: -2,
      playerId: null
    },
    {
      cost: -1,
      playerId: null
    },
    {
      cost: 0,
      playerId: null
    },
    {
      cost: 0,
      playerId: null
    }
  ];
  room.marketPlacement = [{
      cost: 0,
      playerId: null
    },
    {
      cost: -2,
      playerId: null
    },
    {
      cost: 0,
      playerId: null
    }
  ];
  room.workPlacement = [{
      cost: -3,
      playerId: null
    },
    {
      cost: -1,
      playerId: null
    },
    {
      cost: 1,
      playerId: null
    },
    {
      cost: 0,
      playerId: null
    },
    {
      cost: 0,
      playerId: null
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
        money: 100,
        points: 0,
        skills: [],
        items: [],
        income: [],
        secret: [],
        myTurn: false,
        bottles: [1, 1, 0, 0, 0],
        bottleAmount: 2
      };
      room.playerList.push(room.players[playerId]);
      for (let i = 0; i < 3; i += 1) {
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

Data.prototype.updatePoints = function(roomId, player, points) {
  let room = this.rooms[roomId]
  if (typeof room !== 'undefined') {
    room.points[player] += points;
    return room.points;
  } else return {};
}

Data.prototype.claimedFirst = function(roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    room.players[playerId].myTurn = true;
    console.log(room.playerList);
    return playerId;
  } else return {};
}

/* returns players after a new card is drawn */
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
    console.log(room.playerList);
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
  }
}

Data.prototype.raiseValue = function(roomId, playerId, card, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;
    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      if (room.players[playerId].hand[i].x === card.x &&
        room.players[playerId].hand[i].y === card.y) {
        console.log("knasigt");
        c = room.players[playerId].hand.splice(i, 1);
        break;
      }
    }
    room.market.push(...c);
    room.players[playerId].money -= cost;
    room.players[playerId].myTurn = false;
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
    for(let i = 0; i<room.itemPlacement.length; i++){
        room.itemPlacement[i].playerId = null;
        console.log("vi kom in sara");
        // vi vill uppdatera knappen också!
    }
    console.log(room.itemPlacement);
  }
}

Data.prototype.nextRoundPlayers = function(roomId, players) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    for (let i = 0; i < room.playerList.length; i += 1) {
      room.playerList[i].money += room.playerList[i].income.length; //ger spelaren pengar

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
    console.log(room.playerList);
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
      console.log("du fick en flaska");
      room.players[playerId].bottleAmount += 1;
      room.players[playerId].bottles[0] = 1;
    }

    room.players[playerId].skills.push(...c);
    room.players[playerId].money -= cost;
    room.players[playerId].myTurn = false;
  }
}

Data.prototype.auctionItem = function(roomId, playerId, card, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;

    for (let i = 0; i < room.playerList.length; i += 1) {
      for (let j = 0; j < room.playerList[i].skills.length; i += 1) {
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
        console.log(c);
        break;
      }
    }
    room.theAuctionItem.push(...c);
    room.players[playerId].money -= cost;
    room.players[playerId].myTurn = false;
  }
}

Data.prototype.workArea = function(roomId, playerId, cost){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;
      console.log("hejsan, gå tillbaka till arbetet");
  }
}

Data.prototype.placeBottle = function(roomId, playerId, action, cost) {
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
      if (activePlacement[i].cost === cost &&
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
