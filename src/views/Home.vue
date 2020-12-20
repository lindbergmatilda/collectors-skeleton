<template>
  <main>


<div class="center">
  <div>
    <div class="upper-grid">
      <h1>COLLECTORS</h1>
    </div>
    <div class="lower-grid">
      <div id="holder">

        <div class="left">
            <center><img src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Flag_of_the_United_Kingdom.svg" width="110"></center>
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
      </div>

      <div id="holder">
        <div class="right">
          <center><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Flag_of_Sweden.svg/2560px-Flag_of_Sweden.svg.png" width="90"></center>
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
            <p class="btnText">4 SPELARE</p>
            <div class="btnTwo">
              <p class="btnText2">KÖR!</p>
            </div>
          </div>

        </div>
      </div>




    </div>
  </div>
</div>
</main>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  created: function() {
    this.$store.commit('SET_ROOM_ID');
  },
  methods: {
    setupCollectors: function(playerCount, lang) {
      this.$store.commit('SETUP_GAME', {
        roomId: this.$store.state.roomId,
        playerCount: playerCount,
        lang: lang
      });
      this.$router.push("/room/" + this.$store.state.roomId);
    },
  }
}
</script>
<style scoped>
@import url(https://fonts.googleapis.com/css?family=Roboto:700);

html,
body {
  background: #FBC02D;
  height: 100%;
  width: 100%;
  margin: 0;
}

.center {
  display: grid;
  display: flex;
  align-items: center;
  justify-content: center;
  grid-template-areas: 'up''down';
  background: radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%);
}

#holder {
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
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.25);
  border-radius: 2px;
  display: inline-block;

}

.button {
  background: #3D4C53;
  margin: 20px auto;
  width: 200px;
  height: 50px;
  overflow: hidden;
  text-align: center;
  transition: .2s;
  font-family: "Lexend Deca", sans-serif;
  cursor: pointer;
  border-radius: 3px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, .2);
}

.btnTwo {
  position: relative;
  width: 200px;
  height: 100px;
  margin-top: -100px;
  padding-top: 2px;
  background: #26A69A;
  left: -250px;
  transition: .3s;
}

.btnText {
  color: white;
  transition: .3s;
}

.btnText2 {
  margin-top: 63px;
  margin-right: -130px;
  color: #FFF;
}

.button:hover .btnTwo {
  /*When hovering over .button change .btnTwo*/
  left: -130px;
}

.button:hover .btnText {
  /*When hovering over .button change .btnText*/
  margin-left: 65px;
}

.button:active {
  /*Clicked and held*/
  box-shadow: 0px 5px 6px rgba(0, 0, 0, 0.3);
}

.upper-grid {
  grid-area: up;
  padding:70px;
font-family: 'Helvetica Neue', sans-serif;
font-size: 48px;
font-weight: bold;
letter-spacing: -1px;
  color: #313131;
  -webkit-animation: colorchange 15s infinite alternate;
  text-shadow: 2px 0 0 #fff, -2px 0 0 #fff, 0 2px 0 #fff, 0 -2px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;
}

@-webkit-keyframes colorchange {
  0% {
    color: #26A69A;
  }
  10% {
    color: #8e44ad;
  }
  20% {
    color: #1abc9c;
  }
  30% {
    color: #d35400;
  }
  40% {
    color: #26A69A;
  }
  50% {
    color: #lightgrey;
  }
  60% {
    color: #26A69A;
  }
  70% {
    color: #2980b9;
  }
  80% {
    color: #f1c40f;
  }
  90% {
    color: #2980b9;
  }
  100% {
    color: pink;
  }
}


.lower-grid {
  display: grid;
  grid-area:down;
  grid-template-areas: 'left right';
  grid-template-columns: 400px 400px;
}

.left {
  grid-area: left;
}

.right {
  grid-area: right;
}
@media screen and (max-width: 600px) {

  main {
    scale: 0.6;
    font-size: 120%;
  }

  #holder{
    scale:120%;
  }
}
</style>
