import Tourelle from "./Tourelle.js";
import TourelleView from "./TourelleView.js";

export default class TourelleFactory {
    #worldContainer;
    #target;

    constructor(worldContainer, target){
        this.#worldContainer = worldContainer;
        this.#target = target;
    }

    create(x, y ){
        const view = new TourelleView();
        this.#worldContainer.addChild(view);

        const tourelle = new Tourelle(view,this.#target);
        tourelle.x = x;
        tourelle.y = y; 

        return tourelle;
    }
}