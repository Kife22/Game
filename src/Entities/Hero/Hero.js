import { Container, Graphics } from "../../../lib/pixi.mjs"
import HeroView from "./HeroView.js";


const States = {
    Stay: "stay",
    Jump: "jump",
    FlyDown: "fl",
}

export default class Hero {

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

    #bulletContext = {
        x: 0,
        y: 0,
        angle: 0,
    }


    #view;
    #bulletAngle;

    constructor(stage) {
        this.#view = new HeroView();
        stage.addChild(this.#view);

        this.#state = States.jump;
        this.#view.showJump();
    }

    get collisionbox() {


        return this.#view.collisionBox;
    }

    get x() {
        return this.#view.x
    }

    set x(value) {

        this.#view.x = value
    }

    get y() {
        return this.#view.y
    }

    set y(value) {

        this.#view.y = value
    }

    get bulletContext() {
        this.#bulletContext.x = this.x + this.#view.bulletPointShift.x;
        this.#bulletContext.y = this.y + this.#view.bulletPointShift.y;
        this.#bulletContext.angle = this.#view.isFliped
            ? this.#bulletAngle * -1 + 180
            : this.#bulletAngle;
        return this.#bulletContext;
    }

    update() {
        this.#velocityx = this.#movement.x * this.#speed;
        this.x += this.#velocityx;

        if (this.#velocityY > 0) {
            if (!(this.#state == States.Jump || this.#state == States.FlyDown)) {
                this.#view.showFall();
            }
            this.#state = States.FlyDown
        }

        this.#velocityY += this.#GRAVITY_FORCE
        this.y += this.#velocityY;

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

        this.y = platformY - this.#view.collisionBox.height;

    }

    jump() {
        if (this.#state == States.Jump || this.#state == States.FlyDown) {
            return;
        }

        this.#state = States.Jump
        this.#velocityY -= this.#JUMP_FORCE;
        this.#view.showJump();
    }



    isJumpState() {
        return this.#state == States.Jump;
    }
    throwDown() {
        this.#state = States.Jump
        this.#view.showFall();
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

        this.#view.flip(this.#movement.x)
        this.#isLay = buttonContext.arrowDown;
        this.#isStayUp = buttonContext.arrowUp;

        this.#setBulletAngel(buttonContext);

        if (this.#state == States.Jump || this.#state == States.FlyDown) {
            return;
        }

        if (buttonContext.arrowLeft || buttonContext.arrowRight) {
            if (buttonContext.arrowUp) {
                this.#view.showRunUp()
            }
            else if (buttonContext.arrowDown) {
                this.#view.showRunDown()
            } else {
                this.#view.showRun();
            }

        } else {
            if (buttonContext.arrowUp) {
                this.#view.showStayUp()
            } else if (buttonContext.arrowDown) {
                this.#view.showLay()
            } else {
                this.#view.showStay();
            }

        }
    }

    #setBulletAngel(buttonContext) {
        if (buttonContext.arrowLeft || buttonContext.arrowRight) {
            if (buttonContext.arrowUp) {
                this.#bulletAngle = -45;
            }
            else if (buttonContext.arrowDown) {
                this.#bulletAngle = 45;
            } else {
                this.#bulletAngle = 0
            }
        } else {
            if (buttonContext.arrowUp) {
                this.#bulletAngle = -90;
            } else if (buttonContext.arrowDown && this.#state == States.Jump) {
                this.#bulletAngle = 90;
            } else {
                this.#bulletAngle = 0;
            }

        }
    }

}