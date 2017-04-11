"use strict";

function Star(x, y, scale, angle) {
   return { x:x, y:y, scale:scale, angle:angle };
}

function Point(x, y) {
   return { x:x || 0, y: y || 0 };
}

Point.inbounds = function(p, bounds) {
   return p.x > bounds.left && p.x < bounds.left + bounds.width && p.y > bounds.top && p.y < bounds.top + bounds.height;
}

Point.fromEvent = function(evt) {
   return Point(evt.layerX, evt.layerY);
}

var App   = window.App || (window.App = { HOME_SCREEN:0, HELP_SCREEN:1, GAME_SCREEN:2 });
App.state = App.state || {
   games: [
      {
         score: 0,
         index: "jeu1/index.html",
         helpscreen: "pixs/jeu1-helpscreen@2x.png",
         homescreen: {
            pict: "pixs/jeu1-homescreen@2x.png",
            bounds: { top:0, left:0, width: 512, height: 384 },
            stars: [Star(148,72,1,-3), Star(254,95,.90,45), Star(353,114,1.2,-45), Star(410,193,1,35), Star(352,250,.80,0)]
         },
      },
      {
         score: 0,
         index: "jeu2/index.html",
         helpscreen: "pixs/jeu2-helpscreen@2x.png",
         homescreen: {
            pict: "pixs/jeu2-homescreen@2x.png",
            bounds: { top:0, left:512, width: 512, height: 384 },
            stars: [Star(666,102,.80,0), Star(758,104,1.2,0), Star(888,128,1.2,350), Star(820,190,1,0), Star(890,260,.80,0)]
         }
      },
      {
         score: 0,
         index: "jeu3/index.html",
         helpscreen: "pixs/jeu3-helpscreen@2x.png",
         homescreen: {
            pict: "pixs/jeu3-homescreen@2x.png",
            bounds: { top:384, left:0, width: 512, height: 384 },
            stars: [Star(148,480,1.1,-10), Star(232,456,1,0), Star(310,485,.9,0), Star(368,556,1.1,0), Star(358,642,.80,0)]
         }
      },
      {
         score: 0,
         index: "jeu4/index.html",
         helpscreen: "pixs/jeu4-helpscreen@2x.png",
         homescreen: {
            pict: "pixs/jeu4-homescreen@2x.png",
            bounds: { top:384, left:512, width: 512, height: 384 },
            stars: [Star(628,560,1.2,0), Star(702,508,.90,0), Star(786,475,1,0), Star(842,554,1.1,0), Star(834,652,.80,0)]
         }
      }
   ],
   screensize: { width: 1024, height: 768 },
   gamelayer: document.getElementById("game-layer"),
   canvas: makeHDPICanvas(document.getElementById("canvas-layer")),
   playbtn: document.getElementById("play-btn"),
   resetbtn: document.getElementById("reset-btn"),
   quitbtn: document.getElementById("quit-btn"),
   ranktxt: document.getElementById("rank-text"),
   assets: [],
   drawables: []
}

/**
 * Assets util
 */

App.loadImage = function (src, callback) {
   var image = new Image();
   image.onload = partial(callback, image);
   image.src = src;
   return image;
}

App.loadAsset = function (file, callback) {
   App.loadImage(file, compose(callback, partial(App.addAsset, file)));
}

App.addAsset = function (key, asset) {
   var assets = App.state.assets;
   assets[key] = asset;
   return asset;
}

App.getAsset = function (key) {
   return App.state.assets[key];
}

App.preloadAssets = function (files, callback) {   
   var loaded = ntimes(files.length, callback || noop);
   each(arity(partial(flip(App.loadAsset),loaded), 1), files);
}

/**
 * UI
 */

App.hideElement = function (el, state) {
   state[el].classList.add("hidden");
}

App.showElement = function (el, state) {
   state[el].classList.remove("hidden");
}

App.hideResetButton = partial(App.hideElement, "resetbtn");
App.showResetButton = partial(App.showElement, "resetbtn");

App.hideQuitButton = partial(App.hideElement, "quitbtn");
App.showQuitButton = partial(App.showElement, "quitbtn");

App.showPlayButton = partial(App.showElement, "playbtn");
App.hidePlayButton = partial(App.hideElement, "playbtn");

App.showRankText = partial(App.showElement, "ranktxt");
App.hideRankText = partial(App.hideElement, "ranktxt");

App.showCanvas = partial(App.showElement, "canvas");
App.hideCanvas = partial(App.hideElement, "canvas");

App.showHomeScreen = function (state, game) {
   App.showResetButton(state);
   App.showQuitButton(state);
   App.showRankText(state);
   App.state.drawables = [App.HomeScreen(state)];   
   //App.render(state);
   state.currenscreen = App.HOME_SCREEN;
}

App.showHelpScreen = function (state, game) {
   App.hideResetButton(state);
   App.hideQuitButton(state);
   App.hideRankText(state);
   App.showPlayButton(state);
   App.state.drawables = [App.HelpScreen(game)];
   //App.render(state);
   state.currenscreen = App.HELP_SCREEN;
}

/**
 * Logic
 */

App.setScore = function (game, score) {
   game.score = score;
}

App.resetScores = function (state) {
   each(partial(flip(App.setScore), 0), state.games);
   state.drawables = [App.HomeScreen(state)];
   App.render(state);
}

App.getTotalScore = function(state) {
   return reduce(function(g, acc) { return acc + g.score; }, state.games, 0);
}

App.getRank = function (state) {
   var score = App.getTotalScore(state);
   switch(true) {
      case score >= 12 && score < 16 :
         return "amateur d'oiseaux";
      case score >= 16 && score <= 19 :
         return "très bon ornitho";
      case score > 19 :
         return "ornithologue pro";
      default :
         return "";
   }
}

App.loadGame = function (game, callback) {
   var iframe = document.createElement("iframe");
   iframe.onload = partial(callback, iframe);
   iframe.src = game.index;
   App.state.gamelayer.appendChild(iframe);
}

App.initGame = function (game, gameframe) {
   l("INIT GAME:", gameframe);
   gameframe.contentWindow.startChrono = startChrono;
   gameframe.contentWindow.stopChrono = stopChrono;
   gameframe.contentWindow.gameComplete = partial(App.completeGame, game, gameframe);
   return gameframe;
}

App.unloadGame = function (gameframe) {
   l("UNLOAD GAME:", gameframe);
   App.state.gamelayer.removeChild(gameframe);
   gameframe.innerHTML = "";
   return gameframe;
}

App.completeGame = function (game, gameframe, score) {
   l("COMLETE GAME", gameframe, score);
   stopChrono();
   App.setScore(game, score);
   App.unloadGame(gameframe);
   App.showCanvas(App.state);
   App.showHomeScreen(App.state);
};

App.startGame = function (gameframe) {
   l("START GAME", gameframe);
   App.hideCanvas(App.state);
   gameframe.contentWindow.startGame();
}   

App.runGame = function (game) {
   App.loadGame(game, compose(partial(App.startGame), partial(App.initGame, game)));
}

/**
 * Rendering
 */

App.getGraphics = function (state) {
   return state.canvas.getContext("2d");
}

App.drawable = function(state, ctx, dt) {
   return function(d) {
      d(state, ctx, dt);
   }
}   

App.render = function (state, ctx, dt) {
   var ctx = App.getGraphics(state),
       dws = state.drawables;
   each(App.drawable(state, ctx, dt), dws);
}

App.HomeScreen = function (state) {
   var entrys = map(App.HomeScreenGame, state.games);
   //var rank = App.HomeScreenRank();
   state.ranktxt.textContent = App.getRank(state);
   var r = 0;
   return function draw(state, ctx, dt) {
      ctx.clearRect(0,0, state.screensize.width, state.screensize.height);
      
//      var w = state.screensize.width/2, h = state.screensize.height/2;
//      r+= (w - r)*0.5;
//      if(r < w) {
//         l("rank");
//         ctx.beginPath();         
//         ctx.arc(w,h, r, 0,2*Math.PI);
//         ctx.clip();
//         requestAnimationFrame(partial(draw, state, ctx));
//      }
      
      each(App.drawable(state, ctx), entrys);
   //   rank(state, ctx);
   }
}

App.HomeScreenRank = function() {
   return function(state, ctx, dt) {
      return;
      ctx.save();
      ctx.font = "46px CooperBlackStd";
      var txt = App.getRank(state),
          txw = ctx.measureText(txt).width,
          psx = state.screensize.width/2 - txw/2,
          psy = state.screensize.height/2,
          gdt = ctx.createLinearGradient(psx,0,psx+txw,0);
      gdt.addColorStop(0,"#FBD700");
      gdt.addColorStop(1,"#FF9506");
      ctx.fillStyle = gdt;
      ctx.shadowColor = "rgba(0,0,0,.9)";
      ctx.shadowBlur = 20;
      ctx.textBaseline = "top";
      ctx.fillText(txt, psx, psy);
      ctx.shadowBlur = 0;
      //ctx.strokeStyle = "rgba(0,0,0,.5)";
      //ctx.strokeText(txt, psx, psy);
      ctx.restore();
   }
}

App.HomeScreenGame = function (game) {
   var bnds  = game.homescreen.bounds,
       score = game.score,
//          onstars = game.homescreen.stars.slice(0, score),
//          ofstars = game.homescreen.stars.slice(score);
        onstars = map(partial(App.HomeScreenStar,App.getAsset("pixs/star-on.svg")),
                              game.homescreen.stars.slice(0, score)),
        ofstars = map(partial(App.HomeScreenStar,App.getAsset("pixs/star-off.svg")),
                              game.homescreen.stars.slice(score));
   var i = Math.random() * 100;
   return function draw(state, ctx) {
      ctx.save();
      ctx.shadowColor = "#bcf235";
      //ctx.shadowBlur = 100 + (50 * Math.sin(i));
      ctx.shadowBlur = 100;
      i+= 0.05;
      ctx.drawImage(App.getAsset(game.homescreen.pict), bnds.left,bnds.top, bnds.width,bnds.height);
      
      ctx.shadowColor = "#bcf235";
      //ctx.shadowBlur = 30 + (20 * Math.sin(i));
      ctx.shadowBlur = 30;
      //ctx.rotate(degToRad(.2*Math.sin(i)));
      //ctx.translate(1*Math.sin(i), 1*Math.sin(i));
      each(App.drawable(state, ctx), onstars);
      //each(partial(App.drawAsset, ctx, App.getAsset("pixs/star-on.svg")), onstars);
      ctx.shadowBlur = 0;
      each(App.drawable(state, ctx), ofstars);
      //each(partial(App.drawAsset, ctx, App.getAsset("pixs/star-off.svg")), ofstars);
      ctx.restore();      
   }
}

App.HomeScreenStar = function (asset, conf) {
   var i = Math.random() * 3;
   var o = 10 + Math.random() * 30;
   return function (state, ctx) {
      ctx.save();         
      //ctx.translate(conf.x, conf.y);
      ctx.translate(conf.x + Math.sin(i), conf.y + Math.sin(i));
      //ctx.rotate(degToRad(conf.angle));
      //ctx.rotate(degToRad(conf.angle + o*Math.sin(i)));
      ctx.scale(conf.scale, conf.scale);
      //ctx.scale(conf.scale + Math.sin(i)*.05, conf.scale + Math.sin(i)*.05);
      ctx.translate(-conf.x, -conf.y);
      ctx.drawImage(asset, conf.x-(asset.width/2), conf.y-(asset.height/2), asset.width, asset.height);
      ctx.restore();
      i+= 0.05;
   }
}

App.HelpScreen = function(game) {
   var screen = App.getAsset(game.helpscreen);
   return function(state, ctx) {
      var w = state.screensize.width, h = state.screensize.height;
      ctx.clearRect(0,0, w,h);
      ctx.drawImage(screen, 0,0, w,h);
   }
}

App.starTick = function(dt) {
   var state = App.state;
   state.ticking = true;
   (function tick(etime) {
      if (!state.ticking)
         return;

      state.etime = etime;
      App.render(state);
      requestAnimationFrame(tick);
   })(0);
}

App.stopTick = function() {
   var state = App.state;
   state.ticking = false;
}

/**
 * Init
 */

App.preload = function (state, callback) {
   var games = state.games;
   var files = map(function(g) { return g.homescreen.pict; }, games).concat(map(function(g) { return g.helpscreen; }, games));
   files.push("pixs/star-on.svg", "pixs/star-on@2x.png", "pixs/star-off.svg");
   App.preloadAssets(files, callback);
}

App.init = function (state) {
   // Reset score btn
   var resetouched = cue.from(["click"], state.resetbtn);
   cue.bind(partial(App.resetScores, state), resetouched);
   // Quit app btn
   var quitouched = cue.from(["click"], state.quitbtn);
   cue.bind(() => require('remote').app.quit(), quitouched);
   // Home games btns
   var canvastouched = cue.from(["click"], state.canvas);
   var hometouched = cue.filter(() => state.currenscreen == App.HOME_SCREEN, canvastouched);
   var inbounds = (evt, g) => Point.inbounds(Point.fromEvent(evt), g.homescreen.bounds);
   var gametouched = cue.map(function(evt) {
      return filter(partial(inbounds, evt), state.games)[0];
   }, hometouched);
   // game clicked > help screen
   cue.bind(partial(App.showHelpScreen, state), gametouched);
   // Start game btn
   var playtouched = cue.from(["click"], state.playbtn);
   // Seq : game clicked > start btn > start game
   var startgame = cue.sync([gametouched, playtouched]);
   cue.bind(compose(App.runGame, tap(partial(App.hidePlayButton, state))), startgame);
}

window.onload = function() {
   var istate = App.state;
   App.preload(istate, compose(partial(App.showHomeScreen, istate), partial(App.init, istate)));
   App.starTick();
}