import {GateInputElement, GateOutputElement} from "./GateIO";
import BasicLogicGate from './BasicLogicGate';
import {elements} from '../App';

class ORElement extends BasicLogicGate {
    constructor(x, y) {
        super("OR");
        this.inputs.push(new GateInputElement());
        this.inputs.push(new GateInputElement());
        this.outputs.push(new GateOutputElement());
        this.setHeight(2);
        this.updatePosition(x, y);
    }
    
    createElement() {
        return new ORElement();
    }

    calculateSignal() {
        let result = false;
        this.inputs.forEach(input => {
            if(input.signaled) {
                result = true;
            }
        });
        this.outputs[0].signaled = result;
        
        this.outputs[0].nextElements.forEach(nextElement => {
            nextElement.signaled = result;
        });
    }
}

const createOrElement = (x, y) => {
    return new ORElement(x, y);
}

export {createOrElement};
