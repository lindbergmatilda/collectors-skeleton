function sockets(io, socket, data) {
    socket.on('setupCollectors', function(d) {
      data.createRoom(d.roomId, d.playerCount, d.lang);
    })
    socket.on('collectorsLoaded', function(d) {
      socket.join(d.roomId);
      if (data.joinGame(d.roomId, d.playerId)) {
        socket.emit('collectorsInitialize', {
            labels: data.getUILabels(d.roomId),
            players: data.getPlayers(d.roomId),
            itemsOnSale: data.getItemsOnSale(d.roomId),
            marketValues: data.getMarketValues(d.roomId),
            skillsOnSale: data.getSkillsOnSale(d.roomId),
            auctionCards: data.getAuctionCards(d.roomId),
            auctionItem: data.getAuctionItem(d.roomId),
            placements: data.getPlacements(d.roomId)
          }
        );
      }
    });

    socket.on('collectorsFirstPlayer', function(d) {
      io.to(d.roomId).emit('collectorsClaimedFirstPlayer',
        data.claimedFirst(d.roomId, d.playerId)
      );
    });

    socket.on('collectorsDrawCard', function(d) {
      io.to(d.roomId).emit('collectorsCardDrawn',
        data.drawCard(d.roomId, d.playerId)
      );
    });

    socket.on('collectorsClaimCard', function(d) {
      data.claimAuctionCard(d.roomId, d.playerId, d.buttonAction)
      io.to(d.roomId).emit('collectorsClaimedCard', {
        playerId: d.playerId,
        players: data.getPlayers(d.roomId),
        theAuctionItem: data.getAuctionItem(d.roomId),
        market: data.getMarketCards(d.roomId),
        marketValues: data.getMarketValues(d.roomId)
      }
      );
    });

    socket.on('collectorsBuyItem', function(d) {
      data.buyItem(d.roomId, d.playerId, d.card, d.cost)
      io.to(d.roomId).emit('collectorsItemBought', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          itemsOnSale: data.getItemsOnSale(d.roomId)
        }
      );
    });

    socket.on('collectorsBuySkill', function(d) {
      console.log("socket blir anropad");
      data.buySkill(d.roomId, d.playerId, d.card, d.cost)
      io.to(d.roomId).emit('collectorsSkillBought', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          skillsOnSale: data.getSkillsOnSale(d.roomId)
        }
      );
    });

    socket.on('collectorsRaiseValue', function(d) {
      data.raiseValue(d.roomId, d.playerId, d.card, d.cost)
      io.to(d.roomId).emit('collectorsRaisedValue', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          marketValues: data.getMarketValues(d.roomId),
          market: data.getMarketCards(d.roomId)
        }
      );
    });

    socket.on('collectorsAuctionItem', function(d) {
      data.auctionItem(d.roomId, d.playerId, d.card, d.cost)
      io.to(d.roomId).emit('collectorsItemAuctioned', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          theAuctionItem: data.getAuctionItem(d.roomId),
          auctionCards: data.getAuctionCards(d.roomId)
        }
      );
    });

    socket.on('collectorsPlaceBottle', function(d) {
      data.placeBottle(d.roomId, d.playerId, d.action, d.cost);
      io.to(d.roomId).emit('collectorsBottlePlaced', data.getPlacements(d.roomId)
      );
    });
}

module.exports = sockets;
