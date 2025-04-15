import Game from "./Game.js"
import *as PIXI from "../lib/pixi.mjs"


const pixApp = new PIXI.Application({
    widht: 1980,
    height: 1980, 
})

const game = new Game(pixApp);


document.body.appendChild(pixApp.view);
document.addEventListener("keydown", (key) => game.keyboardProcessor.onKeyDown(key));
document.addEventListener("keyup", (key) => game.keyboardProcessor.onKeyUp(key));

pixApp.ticker.add(game.update, game);