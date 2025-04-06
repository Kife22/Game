import Platform from './Platform.js';
import Box from './Box.js'


export default class PlatformFactory{
    #worldContainer
    constructor(worldContainer){
        this.#worldContainer = worldContainer;

    }

    createPlatform(x, y) {
        const platform = new Platform();
        platform.x = x;
        platform.y = y;
        this.#worldContainer.addChild(platform);

        return platform;
    }

    createBox(x, y) {
        const box = new Box();
        box.x = x;
        box.y = y;
        this.#worldContainer.addChild(box);

        return box;
    }
}