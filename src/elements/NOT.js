import {GateInputElement, GateOutputElement} from "./GateIO";
import BasicLogicGate from './BasicLogicGate';
import Constants from '../constants';

class NOTElement extends BasicLogicGate {
    constructor(x, y) {
        super("NOT");
        this.inputs.push(new GateInputElement());
        this.outputs.push(new GateOutputElement());
        this.setHeight(1);
        this.updatePosition(x, y);
        this.color = Constants.notElementsColor;
        this.selectedColor = Constants.notElementsSelectedColor;
    }
    
    createElement() {
        return new NOTElement();
    }

    calculateSignal() {
        let result = !this.inputs[0].signaled;
        this.outputs[0].signaled = result;
        
        this.outputs[0].nextElements.forEach(nextElement => {
            nextElement.signaled = result;
        });
    }
}

const createNotElement = (x, y) => {
    return new NOTElement(x, y);
}

export {createNotElement};
