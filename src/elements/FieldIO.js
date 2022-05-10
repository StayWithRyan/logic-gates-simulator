import {inputs, outputs} from '../App';
import Constants from '../constants';

let distance = Constants.distanceBetweenFieldIOElements;

class FieldIOElement {
    constructor() {
        this.fieldX = 0;
        this.x = 0;
        this.y = 0;
        this.signaled = false;
    }

    innerDraw(canvas) {
        let context = canvas.getContext('2d');
        //line
        context.beginPath();
        context.lineWidth = 5;
        context.strokeStyle = "black";
        context.moveTo(this.fieldX, this.y);
        context.lineTo(this.x, this.y);
        context.stroke();
        //FiledIO
        context.beginPath();
        context.fillStyle = this.signaled ? Constants.signalColor : Constants.noSignalColor;
        context.arc(this.fieldX, this.y, Constants.FieldIOSize / 2, 0, Math.PI * 2, false);
        context.fill();
        //IO
        context.beginPath();
        context.fillStyle = "black";
        context.arc(this.x, this.y, Constants.GateIOSize / 2, 0, Math.PI * 2, false);
        context.fill();
    }
}

class FieldInputElement extends FieldIOElement{
    constructor() {
        super();
        this.x = Constants.fieldBeginX + 70;
        this.fieldX = Constants.fieldBeginX;
        this.nextElements = [];
    }
    
    deleteNextElement(element) {
        for(let i = 0; i < this.nextElements.length; ++i) {
            if(this.nextElements[i] == element) {
                this.nextElements.splice(i, 1);
                return;
            }
        }
    }

    draw(canvas) {
        // path to next element
        let context = canvas.getContext('2d');
        this.nextElements.forEach(nextElement => {
            context.beginPath();
            context.lineWidth = 5;
            context.strokeStyle = this.signaled ? Constants.signalColor : Constants.noSignalColor;
            context.moveTo(this.x, this.y);
            context.lineTo(nextElement.x, nextElement.y);
            context.stroke();
        });

        this.innerDraw(canvas);
    }

    toggleSignaled() {
        this.signaled = !this.signaled;
        this.nextElements.forEach(nextElement => {
            nextElement.signaled = this.signaled;
        });
    }
}

class FieldOutputElement extends FieldIOElement{
    constructor() {
        super();
        this.fieldX = Constants.fieldEndX;
        this.x = Constants.fieldEndX - 70;
        this.prevElement = null;
    }

    draw(canvas) {
        this.innerDraw(canvas);
    }
}

const addInputElement = () => {
    if(calculateInputsBarHeight() + distance + Constants.FieldIOSize + 200 > Constants.fieldHeight) {
        return; // no more fits on screen
    }
    inputs.push(new FieldInputElement());
    setInputsPositions();
}

const removeInputElement = () => {
    if(inputs.length <= 1) {
        return;
    }
    let elementToDelete = inputs[inputs.length - 1];
    elementToDelete.nextElements.forEach(nextElement => {
        nextElement.prevElement = null;
        nextElement.signaled = false;
    });
    inputs.pop();
    setInputsPositions();
}

const calculateInputsBarHeight = () => {
    return inputs.length * Constants.FieldIOSize + (inputs.length - 1) * distance;
}

const setInputsPositions = () => {
    let inputYPosition = Constants.fieldBeginY + (Constants.fieldHeight - calculateInputsBarHeight()) / 2 + Constants.FieldIOSize / 2;
    inputs.forEach(input => {
        input.y = inputYPosition;
        inputYPosition += distance + Constants.FieldIOSize;
    });
}

const addOutputElement = () => {
    if(calculateOutputBarHeight() + distance + Constants.FieldIOSize + 200 > Constants.fieldHeight) {
        return; // no more fits on screen
    }
    outputs.push(new FieldOutputElement());
    setOutputsPositions();
}

const removeOutputElement = () => {
    if(outputs.length <= 1) {
        return;
    }
    let elementToDelete = outputs[outputs.length - 1];
    if(elementToDelete.prevElement) {
        elementToDelete.prevElement.deleteNextElement(elementToDelete);
    }
    outputs.pop();
    setOutputsPositions();
}

const setOutputsPositions = () => {
    let outputYPosition = Constants.fieldBeginY + (Constants.fieldHeight - calculateOutputBarHeight()) / 2 + Constants.FieldIOSize / 2;
    outputs.forEach(output => {
        output.y = outputYPosition;
        outputYPosition += distance + Constants.FieldIOSize;
    });
}

const calculateOutputBarHeight = () => {
    return outputs.length * Constants.FieldIOSize + (outputs.length - 1) * distance;
}


export {
    FieldInputElement, FieldOutputElement,
    addInputElement, removeInputElement, 
    addOutputElement, removeOutputElement
};