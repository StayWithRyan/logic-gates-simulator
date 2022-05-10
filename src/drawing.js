import Constants from "./constants"
import {inputs, outputs, elements, line, spawningElement, elementsOnBar} from "./App"

const draw = (canvas) => {
    drawHood(canvas);
    drawLine(canvas);
    inputs.forEach(input => {
        input.draw(canvas)
    });
    elements.forEach(element => {
        element.drawPaths(canvas)
    });
    elements.forEach(element => {
        element.draw(canvas)
    });
    outputs.forEach(output => {
        output.draw(canvas)
    });
    drawElementsBar(canvas);
    drawBarElement(canvas, spawningElement);
}

const drawLine = (canvas) => {
    if(line === null) {
        return;
    }
    const context = canvas.getContext('2d');
    context.beginPath();
    context.lineWidth = 5;
    context.strokeStyle = Constants.noSignalColor;
    context.moveTo(line[0], line[1]);
    context.lineTo(line[2], line[3]);
    context.stroke();
}

const drawElementsBar = (canvas) => {
    elementsOnBar.forEach(element => {
        drawBarElement(canvas, element)
        
    });
}

const drawBarElement = (canvas, element) => {
    if(!element) {
        return;
    }
    const context = canvas.getContext('2d');
    context.fillStyle = Constants.fieldBorderColor;
    context.fillRect(element.x, element.y, element.width, element.height);
    context.font = "36px Roboto Mono";
    context.fillStyle = "white";
    context.fillText(element.name, element.x + (element.width -  element.name.length * 22) / 2, element.y + element.height / 2 + 12);
}

const drawHood = (canvas) => {
    const context = canvas.getContext('2d');

    //background
    context.fillStyle = Constants.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    //field
    context.fillStyle = Constants.fieldColor;
    context.fillRect(Constants.fieldBeginX, Constants.fieldBeginY, Constants.fieldWidth, Constants.fieldHeight);
    
    //components background
    context.fillStyle = Constants.componentsBackgroundColor;
    context.fillRect(0, Constants.fieldEndY + 20, window.innerWidth, 60);

    //field border
    context.strokeStyle = Constants.fieldBorderColor;
    context.lineWidth = 5;
    context.strokeRect(Constants.fieldBeginX, Constants.fieldBeginY, Constants.fieldWidth, Constants.fieldHeight);

    //plus input
    context.fillStyle = Constants.elementsColor;
    context.fillRect(Constants.plusInputX + 10, Constants.plusInputY, Constants.buttonSize - 20, Constants.buttonSize);
    context.fillRect(Constants.plusInputX, Constants.plusInputY + 10, Constants.buttonSize, Constants.buttonSize - 20);
    //minus input
    context.fillRect(Constants.minusInputX, Constants.minusInputY + 10, Constants.buttonSize, Constants.buttonSize - 20);
    //plus output
    context.fillRect(Constants.plusOutputX + 10, Constants.plusOutputY, Constants.buttonSize - 20, Constants.buttonSize);
    context.fillRect(Constants.plusOutputX, Constants.plusOutputY + 10, Constants.buttonSize, Constants.buttonSize - 20);
    //minus output
    context.fillRect(Constants.minusOutputX, Constants.minusOutputY + 10, Constants.buttonSize, Constants.buttonSize - 20);
}

export {draw}