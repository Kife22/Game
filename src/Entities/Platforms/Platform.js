import { Container, Graphics } from "../../../../lib/pixi.mjs"

export default class Platform extends Container{
    constructor(){

        super();

        const view = new Graphics();
        view.lineStyle(1 , 0x00ff00);
        view.drawRect(0,0,200,30);
        
        this.addChild(view);
    }
}