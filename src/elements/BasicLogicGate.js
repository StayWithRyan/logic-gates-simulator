import Constants from '../constants';

class BasicLogicGate {
    constructor(name) {
        this.y = 0;
        this.x = 0;
        this.height = 0;
        this.name = name;
        this.width = name.length * 24 + 100;
        this.inputs = [];
        this.outputs = [];
        this.selected = false;
    }

    setHeight(IOMax) {
        this.height = Constants.GateIOElementsMargin + (Constants.GateIOElementsMargin + Constants.GateIOSize) * IOMax;
    }

    drawPaths(canvas) {
        this.outputs.forEach(output => {
            output.drawPathToNextElements(canvas);
        });
    }

    draw(canvas) {
        const context = canvas.getContext('2d');
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        if(this.selected) {
            context.strokeStyle = this.selectedColor;
            context.lineWidth = 5;
            context.strokeRect(this.x, this.y, this.width, this.height);
        }

        this.inputs.forEach(input => {
            input.draw(canvas);
        });

        this.outputs.forEach(output => {
            output.draw(canvas);
        });
        
        context.font = "36px Roboto Mono";
        context.fillStyle = "white";
        context.fillText(this.name, this.x + (this.width -  this.name.length * 22) / 2, this.y + this.height / 2 + 12);
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;

        const calculateInputsBarHeight = () => {
            return this.inputs.length * Constants.GateIOSize + (this.inputs.length + 1) * Constants.GateIOElementsMargin;
        }
        const calculateOutputsBarHeight = () => {
            return this.outputs.length * Constants.GateIOSize + (this.outputs.length + 1) * Constants.GateIOElementsMargin;
        }


        let inputYPosition = this.y + (this.height - calculateInputsBarHeight()) / 2 + Constants.GateIOSize / 2 + Constants.GateIOElementsMargin;
        this.inputs.forEach(input => {
            input.x = x;
            input.y = inputYPosition;
            inputYPosition += Constants.GateIOElementsMargin + Constants.GateIOSize;
        });

        let outputYPosition = this.y + (this.height - calculateOutputsBarHeight()) / 2 + Constants.GateIOSize / 2 + Constants.GateIOElementsMargin;
        this.outputs.forEach(output => {
            output.x = x + this.width;
            output.y = outputYPosition;
            outputYPosition += Constants.GateIOElementsMargin + Constants.GateIOSize;
        });

    }

    calculateSignal() {
        throw "Must be overridden"
    }
}

export default BasicLogicGate;