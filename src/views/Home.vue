<template>

  <div class="center">
    <div>

<h1>Collectors</h1>

      <div id="holder">

      <div class="button" @click="setupCollectors(2, 'en')">
          <p class="btnText">2 PLAYERS</p>
          <div class="btnTwo">
            <p class="btnText2">GO!</p>
          </div>
       </div>

      <div class="button" @click="setupCollectors(3, 'en')">
          <p class="btnText">3 PLAYERS</p>
          <div class="btnTwo">
            <p class="btnText2">GO!</p>
          </div>
       </div>

       <div class="button" @click="setupCollectors(4, 'en')">
           <p class="btnText">4 PLAYERS</p>
           <div class="btnTwo">
             <p class="btnText2">GO!</p>
           </div>
        </div>

      </div>

      <div id="holder">

      <div class="button" @click="setupCollectors(2, 'se')">
          <p class="btnText">2 SPELARE</p>
          <div class="btnTwo">
            <p class="btnText2">KÖR!</p>
          </div>
       </div>

      <div class="button" @click="setupCollectors(3, 'se')">
          <p class="btnText">3 SPELARE</p>
          <div class="btnTwo">
            <p class="btnText2">KÖR!</p>
          </div>
       </div>

       <div class="button" @click="setupCollectors(4, 'se')">
           <p class="btnText">4 SPLEARE</p>
           <div class="btnTwo">
             <p class="btnText2">KÖR!</p>
           </div>
        </div>

      </div>




    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  created: function () {
    this.$store.commit('SET_ROOM_ID');
  },
  methods: {
    setupCollectors: function (playerCount, lang="en") {
      this.$store.commit('SETUP_GAME', {roomId: this.$store.state.roomId,
        playerCount: playerCount,
        lang: lang });
      this.$router.push("/room/" + this.$store.state.roomId);
    },
  }
}
</script>
<style scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto:700);
html, body{background : #FBC02D; font-family : Roboto; height: 100%; width: 100%; margin: 0;}

  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 1em;

  }

  #holder{
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  background: white;
  padding: 10px;
  width: 250px;
  margin: 0 auto;
  position: relative;
  top: 50%;
  transform: translateY(-65%);
  box-shadow: 0px 3px 8px rgba(0,0,0,0.25);
  border-radius: 2px;
  display: inline-block;

}
.button {
  background: #3D4C53;
  margin : 20px auto;
  width : 200px;
  height : 50px;
  overflow: hidden;
  text-align : center;
  transition : .2s;
  cursor : pointer;
  border-radius: 3px;
  box-shadow: 0px 1px 2px rgba(0,0,0,.2);
}
.btnTwo {
  position : relative;
  width : 200px;
  height : 100px;
  margin-top: -100px;
  padding-top: 2px;
  background : #26A69A;
  left : -250px;
  transition : .3s;
}
.btnText {
  color : white;
  transition : .3s;
}
.btnText2 {
  margin-top : 63px;
  margin-right : -130px;
  color : #FFF;
}
.button:hover .btnTwo{ /*When hovering over .button change .btnTwo*/
  left: -130px;
}
.button:hover .btnText{ /*When hovering over .button change .btnText*/
  margin-left : 65px;
}
.button:active { /*Clicked and held*/
  box-shadow: 0px 5px 6px rgba(0,0,0,0.3);
}


</style>
