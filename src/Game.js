import { Container } from "../lib/pixi.mjs";
import Camera from "./Camera.js";
import RunnerFactory from "./Entities/Enemies/Runner/RunnerFactory.js";
import KeyboardProcessor from "./KeyboardProcessor.js";
import PlatformFactory from "./Entities/Platforms/PlatformFactory.js";
import BulletFactory from "./Entities/bullets/BulletFactory.js";
import HeroFactory from "./Entities/Hero/HeroFactory.js";
import Physics from "./Physics.js";
import TourelleFactory from "./Entities/Enemies/Tourelle/TourelleFactory.js";


export default class Game {
    #pixiApp;
    #hero;
    #platforms = [];
    #entities = [];
    #camera;
    #bulletFactory;
    #worldContainer;
    #runnerFactory
    #tourelleFactory

    keyboardProcessor;

    constructor(pixiApp) {
        this.#pixiApp = pixiApp;
        this.#worldContainer = new Container();
        this.#pixiApp.stage.addChild(this.#worldContainer);
        const heroFactory = new HeroFactory(this.#worldContainer); 
        this.#hero = heroFactory.create(100,100);

        this.#entities.push(this.#hero )

        const platformFactory = new PlatformFactory(this.#worldContainer)

        this.#platforms.push(platformFactory.createPlatform(100, 400));
        this.#platforms.push(platformFactory.createPlatform(300, 400));
        this.#platforms.push(platformFactory.createPlatform(500, 400));
        this.#platforms.push(platformFactory.createPlatform(700, 400));
        this.#platforms.push(platformFactory.createPlatform(1100, 500));
        this.#platforms.push(platformFactory.createPlatform(1200, 600));
        this.#platforms.push(platformFactory.createPlatform(1400, 600));
        this.#platforms.push(platformFactory.createPlatform(1800, 600));

        this.#platforms.push(platformFactory.createPlatform(300, 550));

        this.#platforms.push(platformFactory.createBox(0, 738));
        this.#platforms.push(platformFactory.createBox(200, 738));
        this.#platforms.push(platformFactory.createBox(600, 738));
        this.#platforms.push(platformFactory.createBox(1000, 738));
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

        this.#bulletFactory = new BulletFactory(this.#worldContainer, this.#entities);

        this.#runnerFactory = new RunnerFactory(this.#worldContainer);
        this.#entities.push(this.#runnerFactory.create(800, 150))
        this.#entities.push(this.#runnerFactory.create(850, 150))
        this.#entities.push(this.#runnerFactory.create(860, 150))
        this.#entities.push(this.#runnerFactory.create(1600, 150))
        const tourelleFactory = new TourelleFactory(this.#worldContainer, this.#hero, this.#bulletFactory)
        this.#entities.push(tourelleFactory.create(500, 200))
    }

    update() {
        for(let i = 0; i < this.#entities.length; i ++ ){
            const entity = this.#entities[i];
            entity.update();

            if(entity.type == "hero" || entity.type == "enemy"){
                this.#checkDamage(entity);
                this.#checkPlatforms(entity); 
            }

            this.#checkEntityStatus(entity,i);

            
        }
        this.#camera.update()
    }

    #checkDamage(entity){
        const damagers = this.#entities.filter(damager => (entity.type == "enemy" && damager.type == "heroBullet")
                                                            || (entity.type == "hero" && (damager.type == "enemyBullet"  || damager.type == "enemy")));
        for (let damager of damagers){
            if(Physics.isCheckAABNB(damager.collisionBox, entity.collisionBox)){
                entity.damage();
                if(damager.type != "enemy"){
                    damager.dead();
                }
                break;
            }
        }
    }

    #checkPlatforms(character){
        if(character.isDead || !character.gravitable){
            return;
        }

        for (let platform of this.#platforms){
            if(character.isJumpState()  && platform.type != "box"){
                continue;
            }
            this.checkPlatformCollision(character, platform)
        }
    }


    checkPlatformCollision(character, platform) {

        const prevPoint = character.prevPoint
        const collisionResult = Physics.getOrientCollisionResult(character.collisionBox, platform, prevPoint);
        if (collisionResult.vertical == true) {
            character.y = prevPoint.y;
            this.#hero.stay(platform.y);
        }
        if (collisionResult.horizontal == true && platform.type == "box") {
            if (platform.isStep) {
                character.stay(platform.y);
            }
            else {
                character.x = prevPoint.x;
            }
        }

    }

    setKeys() {
        this.keyboardProcessor.getButton("KeyA").executeDown = function () {
            this.#bulletFactory.createBullet(this.#hero.bulletContext);


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

    #checkEntityStatus(entity, index){
        if (entity.isDead || this.#isScreenOut(entity)){
            entity.removeFromStage();
            this.#entities.splice(index, 1)
        }
    }

    #isScreenOut(entity){
        return(entity.x > (this.#pixiApp.screen.width - this.#worldContainer.x)
            || entity.x < (- this.#worldContainer.x)
            || entity.y > this.#pixiApp.screen.height
            || entity.y < 0) 

    }
}
