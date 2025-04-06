export default class Camera {

    #world;
    #target;
    #isBackScrollX;
    #centerScrenPointX;
    #rightBorderWorldPointX;
    #lastTargetX = 0;

    constructor(cameraSettings) {
        this.#target = cameraSettings.target;
        this.#world = cameraSettings.world;
        this.#isBackScrollX = cameraSettings.isBackScroll;

        this.#centerScrenPointX = cameraSettings.screenSize.width / 2;
        this.#rightBorderWorldPointX = this.#world.width - this.#centerScrenPointX;

    }

    

    update() {
        if (this.#target.x > this.#centerScrenPointX 
            && this.#target.x < this.#rightBorderWorldPointX 
            && (this.#isBackScrollX|| this.#target.x > this.#lastTargetX)){
            this.#world.x = this.#centerScrenPointX - this.#target.x;
            this.#lastTargetX = this.#target.x;
        }
    }
}