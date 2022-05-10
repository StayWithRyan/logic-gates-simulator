import {GateInputElement, GateOutputElement} from "./GateIO";
import BasicLogicGate from './BasicLogicGate';
import {elements} from '../App';

class ANDElement extends BasicLogicGate {
    constructor(x, y) {
        super("AND");
        this.inputs.push(new GateInputElement());
        this.inputs.push(new GateInputElement());
        this.outputs.push(new GateOutputElement());
        this.setHeight(2);
        this.updatePosition(x, y);
    }

    createElement() {
        return new ANDElement();
    }

    calculateSignal() {
        let result = true;
        this.inputs.forEach(input => {
            if(!input.signaled) {
                result = false;
            }
        });
        this.outputs[0].signaled = result;
        this.outputs[0].nextElements.forEach(nextElement => {
            nextElement.signaled = result;
        });
    }
}

const createAndElement = (x, y) => {
    return new ANDElement(x, y);
}


export {createAndElement};
