import { AnimatedSprite, Container, Sprite } from "../../../lib/pixi.mjs";

export default class PowerupView extends Container{

    #collisionBox = {
        x:0,
        y:0,
        width:0,
        height:0,
    }

    #view;
    #assets;

    constructor(assets){
        super();

        this.#view = new Sprite(assets.getTexture("powerup0000"));
        this.addChild(this.#view);

        this.#collisionBox.width = 50;
        this.#collisionBox.height = 20;

        this.#assets = assets;
    }

    get collisionBox(){
        this.#collisionBox.x = this.x;
        this.#collisionBox.y = this.y;
        return this.#collisionBox;
    }

    get hitBox(){
        return this.collisionBox;
    }

    showAndGetDeadAnimation(){
        this.#view.visible = false;
        this.#collisionBox.width = 0;
        this.#collisionBox.height = 0;

        const explosion = new AnimatedSprite(this.#assets.getAnimationTextures("explosion"));
        explosion.animationSpeed = 1/5;
        explosion.y = -explosion.height/2;
        explosion.loop = false;
        explosion.play();
        this.addChild(explosion);

        return explosion;
    }
}