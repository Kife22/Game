import { Container, Graphics, LineStyle } from "../../../../lib/pixi.mjs";

export default class TourelleView extends Container {

    #gunView;

    constructor(){
        super();

        const view = new Graphics();
        view.lineStyle(2, 0xff0000);
        view.drawCircle(0,0,50);

        this.addChild(view);

        this.#gunView = new Graphics();
        this.#gunView.lineStyle(2, 0xff0000);
        this.#gunView.drawRect(0,0,70,10);
        this.#gunView.pivot.x = 5;
        this.#gunView.pivot.y = 5;
        this.#gunView.x = 0;
        this.#gunView.y = 0;

        this.addChild(this.#gunView);
    }

    get gunRotation(){
        return this.#gunView.rotation;
    }

    set gunRotation(value){
        this.#gunView.rotation = value;
    }
}