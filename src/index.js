import Game from "./Game.js"
import *as PIXI from "../lib/pixi.mjs"


const pixApp = new PIXI.Application({
    widht: 1080,
    height: 1920, 
})

const game = new Game(pixApp);


document.body.appendChild(pixApp.view);
document.addEventListener("keydown", function(key){
    game.keyboardProcessor.onKeyDown(key)
});
document.addEventListener("keyup", function(key){
    game.keyboardProcessor.onKeyUp(key)
});

pixApp.ticker.add(game.update, game);