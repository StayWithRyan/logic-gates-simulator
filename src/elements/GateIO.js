
import Constants from '../constants';

class GateIOElement {
    constructor() {
        this.signaled = false;
        this.x = 0;
        this.y = 0;
    }

    draw(canvas) {
        let context = canvas.getContext('2d');
        context.beginPath();
        context.fillStyle = "black";
        context.arc(this.x, this.y, Constants.GateIOSize / 2, 0, Math.PI * 2, false);
        context.fill();
    }
}

class GateInputElement extends GateIOElement{
    constructor() {
        super();
        this.prevElement = null;
    }


}

class GateOutputElement extends GateIOElement{
    constructor() {
        super();
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

    drawPathToNextElements(canvas) {
        let context = canvas.getContext('2d');
        this.nextElements.forEach(nextElement => {
            context.beginPath();
            context.lineWidth = 5;
            context.strokeStyle = this.signaled ? Constants.signalColor : Constants.noSignalColor;
            context.moveTo(this.x, this.y);
            context.lineTo(nextElement.x, nextElement.y);
            context.stroke();
        });
    }
}

export {GateInputElement, GateOutputElement};