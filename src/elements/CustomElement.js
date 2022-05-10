import {GateInputElement, GateOutputElement} from "./GateIO";
import BasicLogicGate from './BasicLogicGate';
import {inputs, outputs, updateGates} from '../App';

class CustomElement extends BasicLogicGate {
    constructor(inputsCount, outputsCount, combinations, results, name) {
        super(name);
        this.inputsCount = inputsCount;
        this.outputsCount = outputsCount;
        this.combinations = combinations;
        this.results = results;
        for(let i = 0; i < inputsCount; ++i) {
            this.inputs.push(new GateInputElement());
        }
        for(let i = 0; i < outputsCount; ++i) {
            this.outputs.push(new GateOutputElement());
        }
        this.setHeight(Math.max(inputsCount, outputsCount));
    }

    createElement(x, y) {
        let element = new CustomElement(this.inputsCount, this.outputsCount, this.combinations, this.results, this.name);
        element.updatePosition(x, y);
        return element;
    }

    calculateSignal() {
        let current = [];
        for(let i = 0; i < this.inputsCount; ++i) {
            current.push(this.inputs[i].signaled);
        }
        for(let i = 0; i < this.combinations.length; ++i) {
            let found = true;
            for(let j = 0; j < this.inputsCount; ++j) {
                if(this.combinations[i][j] !== current[j]) {
                    found = false;
                }
            }
            if(found) {
                for(let j = 0; j < this.outputsCount; ++j) {
                    this.outputs[j].signaled = this.results[i][j];
                    this.outputs[j].nextElements.forEach(nextElement => {
                        nextElement.signaled = this.results[i][j];
                    });
                }
            }
        }

    }
}

const createCustomElement = (name = "Custom") => {
    let combinations = [];
    let results = [];

    for (let i = 0; i < 1 << inputs.length; i++) {
        let combination = [];
        for(let j = inputs.length-1; j >= 0; --j) {
            combination.push(!!(i & (1<<j)))
        }
        combinations.push(combination);
    }
    
    for(let i = 0; i < combinations.length; ++i) {
        for(let j = 0; j < inputs.length; j++) {
            inputs[j].signaled = combinations[i][j];
            inputs[j].nextElements.forEach(nextElement => {
                nextElement.signaled = combinations[i][j];
            });
        }
        for(let j = 0; j < 10; ++j) {
            updateGates();
        }
        let result = [];
        for(let j = 0; j < outputs.length; ++j) {
            result.push(outputs[j].signaled);
        }
        results.push(result);
    }

    return new CustomElement(inputs.length, outputs.length, combinations, results, name);
}

export {CustomElement, createCustomElement};
