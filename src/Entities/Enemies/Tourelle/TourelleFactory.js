import Tourelle from "./Tourelle.js";
import TourelleView from "./TourelleView.js";

export default class TourelleFactory {
    #worldContainer;
    #target;
    #bulletFactory;

    constructor(worldContainer, target, bulletFactory){
        this.#worldContainer = worldContainer;
        this.#target = target;
        this.#bulletFactory = bulletFactory;
    }

    create(x, y ){
        const view = new TourelleView();
        this.#worldContainer.addChild(view);

        const tourelle = new Tourelle(view,this.#target, this.#bulletFactory);
        tourelle.x = x;
        tourelle.y = y; 

        return tourelle;
    }
}