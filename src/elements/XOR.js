import {GateInputElement, GateOutputElement} from "./GateIO";
import BasicLogicGate from './BasicLogicGate';
import Constants from '../constants';

class XORElement extends BasicLogicGate {
    constructor(x, y) {
        super("XOR");
        this.inputs.push(new GateInputElement());
        this.inputs.push(new GateInputElement());
        this.outputs.push(new GateOutputElement());
        this.setHeight(2);
        this.updatePosition(x, y);
        this.color = Constants.xorElementsColor;
        this.selectedColor = Constants.xorElementsSelectedColor;
    }
    
    createElement() {
        return new XORElement();
    }

    calculateSignal() {
        let result = false;
        if(this.inputs[0].signaled !== this.inputs[1].signaled) {
            result = true;
        }

        this.outputs[0].signaled = result;
        this.outputs[0].nextElements.forEach(nextElement => {
            nextElement.signaled = result;
        });
    }
}

const createXorElement = (x, y) => {
    return new XORElement(x, y);
}

export {createXorElement};
