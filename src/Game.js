import { Container } from "../lib/pixi.mjs";
import Camera from "./Camera.js";
import Hero from "./Entities/Hero/Hero.js";
import KeyboardProcessor from "./Entities/KeyboardProcessor.js";
import PlatformFactory from "./Entities/Platforms/PlatformFactory.js";
import BulletFactory from "./Entities/bullets/BulletFactory.js";


export default class Game {
    #pixiApp;
    #hero;
    #platforms = [];
    #bullets = []
    #camera;
    #bulletFactory;
    #worldContainer;

    keyboardProcessor;

    constructor(pixiApp) {
        this.#pixiApp = pixiApp;
        this.#worldContainer = new Container();
        this.#pixiApp.stage.addChild(this.#worldContainer);

        this.#hero = new Hero(this.#worldContainer);
        this.#hero.x = 100;
        this.#hero.y = 100;

        const platformFactory = new PlatformFactory(this.#worldContainer)

        this.#platforms.push(platformFactory.createPlatform(100, 400));
        this.#platforms.push(platformFactory.createPlatform(300, 400));
        this.#platforms.push(platformFactory.createPlatform(500, 400));
        this.#platforms.push(platformFactory.createPlatform(700, 400));
        this.#platforms.push(platformFactory.createPlatform(1100, 400));
        this.#platforms.push(platformFactory.createPlatform(300, 550));
        this.#platforms.push(platformFactory.createBox(0, 738));
        this.#platforms.push(platformFactory.createBox(200, 738));
        const box = (platformFactory.createBox(400, 708));
        box.isStep = true;
        this.#platforms.push(box);

        this.keyboardProcessor = new KeyboardProcessor(this);
        this.setKeys();
        const cameraSettings = {
            target: this.#hero,
            world: this.#worldContainer,
            screenSize: this.#pixiApp.screen,
            maxWorldWidth: this.#worldContainer.width,
            isBackScrollX: false,

        }
        this.#camera = new Camera(cameraSettings);

        this.#bulletFactory = new BulletFactory();
    }

    update() {

        const prevPoint = {
            x: this.#hero.x,
            y: this.#hero.y
        };

        this.#hero.update();

        for (let i = 0; i < this.#platforms.length; i++) {

            if (this.#hero.isJumpState() && this.#platforms[i].type != "box") {
                continue;
            }

            const collisionResult = this.getPlatformCollisionResult(this.#hero, this.#platforms[i], prevPoint);
            if (collisionResult.vertical == true) {
                this.#hero.stay(this.#platforms[i].y);
            }
        }

        this.#camera.update();

        for (let i = 0; i < this.#bullets.length; i++) {
            this.#bullets[i].update();
        }
    }

    getPlatformCollisionResult(character, platform, prevPoint) {
        const collisionResult = this.getOrientCollisionResult(character.collisionbox, platform, prevPoint);
        if (collisionResult.vertical == true) {
            character.y = prevPoint.y;
        }
        if (collisionResult.horizontal == true && platform.type == "box") {
            if (platform.isStep) {
                character.stay(platform.y);
            }
            character.x = prevPoint.x;
        }

        return collisionResult;
    }

    getOrientCollisionResult(aaRect, bbRect, aaPrevPoint) {
        const collisionResult = {
            horizontal: false,
            vertical: false,
        }

        if (!this.isCheckAABNB(aaRect, bbRect)) {
            return collisionResult;
        }

        aaRect.y = aaPrevPoint.y;
        if (!this.isCheckAABNB(aaRect, bbRect)) {
            collisionResult.vertical = true;
            return collisionResult;
        }

        collisionResult.horizontal = true;
        return collisionResult;
    }

    isCheckAABNB(entity, area) {
        return (
            entity.x < area.x + area.width &&
            entity.x + entity.width > area.x &&
            entity.y < area.y + area.height &&
            entity.y + entity.height > area.y
        );
    }

    setKeys() {
        this.keyboardProcessor.getButton("KeyA").executeDown = function () {
            const bullet = this.#bulletFactory.createBullet(this.#hero.bulletContext);
            this.#worldContainer.addChild(bullet);
            this.#bullets.push(bullet);

        }
        this.keyboardProcessor.getButton("KeyS").executeDown = function () {
            if (this.keyboardProcessor.isButtonPerssed("ArrowDown")
                && !(this.keyboardProcessor.isButtonPerssed("ArrowLeft") || (this.keyboardProcessor.isButtonPerssed("ArrowRight")))) {
                this.#hero.throwDown();
            }
            else {
                this.#hero.jump();
            }
        };

        const arrowLeft = this.keyboardProcessor.getButton("ArrowLeft");
        arrowLeft.executeDown = function () {
            this.#hero.startLM();
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowLeft.executeUp = function () {
            this.#hero.stopLM();
            this.#hero.setView(this.getArrowButtonContext());
        };

        const arrowRight = this.keyboardProcessor.getButton("ArrowRight");
        arrowRight.executeDown = function () {
            this.#hero.startRM();
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowRight.executeUp = function () {
            this.#hero.stopRM();
            this.#hero.setView(this.getArrowButtonContext());
        };

        const arrowUp = this.keyboardProcessor.getButton("ArrowUp");
        arrowUp.executeDown = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowUp.executeUp = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };

        const arrowDown = this.keyboardProcessor.getButton("ArrowDown");
        arrowDown.executeDown = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };
        arrowDown.executeUp = function () {
            this.#hero.setView(this.getArrowButtonContext());
        };
    }

    getArrowButtonContext() {
        const buttonContext = {}
        buttonContext.arrowLeft = this.keyboardProcessor.isButtonPerssed("ArrowLeft");
        buttonContext.arrowRight = this.keyboardProcessor.isButtonPerssed("ArrowRight");
        buttonContext.arrowUp = this.keyboardProcessor.isButtonPerssed("ArrowUp");
        buttonContext.arrowDown = this.keyboardProcessor.isButtonPerssed("ArrowDown");
        return buttonContext;
    }

}
