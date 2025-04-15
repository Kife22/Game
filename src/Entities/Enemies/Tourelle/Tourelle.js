import Entity from "../../Entity.js";

export default class Tourelle extends Entity {
    #target;
    #bulletFactory;
    #timeCounter = 0;
    #health = 5; 

    type = "enemy";

    constructor(view, target, bulletFactory){
        super(view);

        this.#target = target; 
        this.#bulletFactory = bulletFactory;
    }

    update(){

        if (this.#target.isDead){
            return;
        }
        let angle = Math.atan2(this.#target.y - this.y, this.#target.x - this.x);
        this._view.gunRotation = angle;

        this.#fire(angle);
    }

    damage(){
        this.#health--;
        if (this.#health < 1){
            this.dead();
        }
    }

    #fire(angle){
        this.#timeCounter++;
        if(this.#timeCounter < 250){
            return;
        }
        const bulletContext = []
        bulletContext.x = this.x;
        bulletContext.y = this.y
        bulletContext.angle = angle / Math.PI * 180;
        bulletContext.type = "enemyBullet";

        this.#bulletFactory.createBullet(bulletContext);

        this.#timeCounter = 0;
    }
}