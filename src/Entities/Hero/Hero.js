import Entity from "../Entity.js";
import HerpWeaponUnit from "./HeroWeaponUnit.js";


const States = {
    Stay: "stay",
    Jump: "jump",
    FlyDown: "fl",
}

export default class Hero extends Entity {

    #GRAVITY_FORCE = 0.2;
    #speed = 3;
    #JUMP_FORCE = 9;
    #velocityY = 0;
    #velocityx = 0;

    #movement = {
        x: 0,
        y: 0,
    }

    #directionContext = {
        left: 0,
        right: 0,
    }

    #state = States.Stay;

    #isLay = false;
    #isStayUp = false;



    #prevPoint = {
        x: 0,
        y: 0,
    };




    #heroWeaponUnit

    type = "hero";

    constructor(view) {
        super(view);

        this.#heroWeaponUnit = new HerpWeaponUnit(this._view);
        this.#state = States.jump;
        this._view.showJump();
        this.gravitable = true;
    }

    get bulletContext() {
        return this.#heroWeaponUnit.bulletContext;
    }

    get prevPoint() {
        return this.#prevPoint
    }

    update() {

        this.#prevPoint.x = this.x;
        this.#prevPoint.y = this.y;

        this.#velocityx = this.#movement.x * this.#speed;
        this.x += this.#velocityx;

        if (this.#velocityY > 0) {
            if (!(this.#state == States.Jump || this.#state == States.FlyDown)) {
                this._view.showFall();
            }
            this.#state = States.FlyDown
        }

        this.#velocityY += this.#GRAVITY_FORCE
        this.y += this.#velocityY;

    }

    damage(){
        this.dead();
    }

    stay(platformY) {

        if (this.#state == States.Jump || this.#state == States.FlyDown) {
            const fakeButtonContext = {};
            fakeButtonContext.arrowRight = this.#movement.x == 1;
            fakeButtonContext.arrowLeft = this.#movement.x == -1;
            fakeButtonContext.arrowUp = this.#isStayUp;
            fakeButtonContext.arrowDown = this.#isLay;
            this.#state = States.Stay;
            this.setView(fakeButtonContext);
        }
        this.#state = States.Stay;
        this.#velocityY = 0;

        this.y = platformY - this._view.collisionBox.height;

    }

    jump() {
        if (this.#state == States.Jump || this.#state == States.FlyDown) {
            return;
        }

        this.#state = States.Jump
        this.#velocityY -= this.#JUMP_FORCE;
        this._view.showJump();
    }



    isJumpState() {
        return this.#state == States.Jump;
    }
    throwDown() {
        this.#state = States.Jump
        this._view.showFall();
    }

    startLM() {
        this.#directionContext.left = -1;

        if (this.#directionContext.right > 0) {
            this.#movement.x = 0;
            return;
        }

        this.#movement.x = -1;
    }

    startRM() {
        this.#directionContext.right = 1;

        if (this.#directionContext.left < 0) {
            this.#movement.x = 0;
            return;
        }

        this.#movement.x = 1;
    }

    stopLM() {
        this.#directionContext.left = 0;
        this.#movement.x = this.#directionContext.right;
    }

    stopRM() {
        this.#directionContext.right = 0;
        this.#movement.x = this.#directionContext.left;
    }


    setView(buttonContext) {

        this._view.flip(this.#movement.x)
        this.#isLay = buttonContext.arrowDown;
        this.#isStayUp = buttonContext.arrowUp;

        this.#heroWeaponUnit.setBulletAngle(buttonContext, this.isJumpState());

        if (this.isJumpState() || this.#state == States.FlyDown) {
            return;
        }

        if (buttonContext.arrowLeft || buttonContext.arrowRight) {
            if (buttonContext.arrowUp) {
                this._view.showRunUp()
            }
            else if (buttonContext.arrowDown) {
                this._view.showRunDown()
            } else {
                this._view.showRun();
            }

        } else {
            if (buttonContext.arrowUp) {
                this._view.showStayUp()
            } else if (buttonContext.arrowDown) {
                this._view.showLay()
            } else {
                this._view.showStay();
            }

        }
    }
}