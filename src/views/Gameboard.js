var v = new Vue ({
  el: '#gameboard',
  data:{
    itemCards: items,
    skillCards: [],
    marketCards: []
  }
})

var items = getItemCards()

function getItemCards(){
  let theCards = [];
  for (i=0; i<5; i++){
    theCards+=card;
  }
  return theCards;
}
