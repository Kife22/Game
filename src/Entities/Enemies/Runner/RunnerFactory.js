import Runner from "./Runner.js";
import RunnerView from "./RunnerView.js";


export default class RunnerFactory {
    #worldContainer
    constructor(worldContainer) {
        this.#worldContainer = worldContainer;

    }

    create(x, y) {
        const view  = new RunnerView();
        this.#worldContainer.addChild(view);

        const runner = new Runner(view);
        runner.x = x;
        runner.y = y;

        return runner;
    }


}