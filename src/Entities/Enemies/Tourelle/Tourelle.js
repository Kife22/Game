import Entity from "../../Entity.js";

export default class Tourelle extends Entity {
    #target;

    constructor(view, target){
        super(view);

        this.#target = target; 
    }

    update(){
        let angle = Math.atan2(this.#target.y - this.y, this.#target.x - this.x);
        this._view.gunRotation = angle;
    }
}