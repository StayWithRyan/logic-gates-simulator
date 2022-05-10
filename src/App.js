import {draw} from './drawing';
import {
    FieldInputElement, FieldOutputElement,
    addInputElement, removeInputElement,
    addOutputElement, removeOutputElement
} from './elements/FieldIO';
import {useRef, useEffect, useState} from "react";
import {createOrElement} from "./elements/OR";
import {createAndElement} from "./elements/AND";
import {createNotElement} from "./elements/NOT";
import {createXorElement} from "./elements/XOR";
import {createCustomElement} from "./elements/CustomElement";
import {GateInputElement, GateOutputElement} from "./elements/GateIO";
import Constants from "./constants";
import ModalCreatingElement from "./ModalCreatingElement"

const updateGates = () => {
    elements.forEach(element => {
        element.calculateSignal();
    });
}

let inputs = [];
addInputElement();
addInputElement();
let outputs = [];
addOutputElement();
let elements = [];
const clearField = () => {
    inputs = [];
    addInputElement();
    addInputElement();
    outputs = [];
    addOutputElement();
    elements = [];
}
let line = null; // [x, y, toX, toY]
let spawningElement = null; // element to draw when spawning

let lastElementX = Constants.fieldBeginX;
let elementsOnBar = [];
const addElementToBar = (name, functionToCreateElement) => {
    let width = name.length * 24 + 30;
    if(width + lastElementX > Constants.fieldEndX) {
        return;
    }
    elementsOnBar.push(
        {
            name: name,
            createElement: functionToCreateElement,
            x: lastElementX,
            y: Constants.fieldEndY + 30,
            width: width,
            height: 40
        }
    );
    lastElementX += width + 20;
}
const addCustomElementToBar = (name) => {
    let customElement = createCustomElement(name);
    addElementToBar(name, (x, y) => { return customElement.createElement(x, y);});
}

addElementToBar("CREATE", addCustomElementToBar);
addElementToBar("OR", createOrElement);
addElementToBar("AND", createAndElement);
addElementToBar("NOT", createNotElement);
addElementToBar("XOR", createXorElement);

const isInsideRectangle = (x, y, squareX, squareY, width, height) => {
    return (
        x >= squareX && x <= squareX + width
        &&
        y >= squareY && y <= squareY + height
    );
}

const isInsideCircle = (x, y, centerX, centerY, r) => {
    return (
        Math.sqrt(
            Math.pow(Math.abs(x - centerX), 2) + Math.pow(Math.abs(y - centerY), 2)
        ) < r
    );
}

const updateInputsIfRelated = () => {
    inputs.forEach(input => {
        if(isInsideCircle(xDown, yDown, input.fieldX, input.y, Constants.FieldIOSize / 2)) {
            input.toggleSignaled();
        }
    });
}

const clickButtonsIfRelated = () => {
    if(isInsideRectangle(xDown, yDown, Constants.plusInputX, Constants.plusInputY, Constants.buttonSize, Constants.buttonSize)) {
        addInputElement();
    }
    if(isInsideRectangle(xDown, yDown, Constants.minusInputX, Constants.minusInputY, Constants.buttonSize, Constants.buttonSize)) {
        removeInputElement();
    }
    if(isInsideRectangle(xDown, yDown, Constants.plusOutputX, Constants.plusOutputY, Constants.buttonSize, Constants.buttonSize)) {
        addOutputElement();
    }
    if(isInsideRectangle(xDown, yDown, Constants.minusOutputX, Constants.minusOutputY, Constants.buttonSize, Constants.buttonSize)) {
        removeOutputElement();
    }
}

const getIONodeByPosition = (x, y) => {
    let node = null;
    inputs.forEach(input => {
        if(isInsideCircle(x, y, input.x, input.y, Constants.GateIOSize / 2)) {
            node = input;
        }
    });
    
    outputs.forEach(output => {
        if(isInsideCircle(x, y, output.x, output.y, Constants.GateIOSize / 2)) {
            node = output;
        }
    });
    
    elements.forEach(element => {
        element.inputs.forEach(input => {
            if(isInsideCircle(x, y, input.x, input.y, Constants.GateIOSize / 2)) {
                node = input;
            }
        });
        element.outputs.forEach(output => {
            if(isInsideCircle(x, y, output.x, output.y, Constants.GateIOSize / 2)) {
                node = output;
            }
        });
    });

    return node;
}

const getBarElementByPosition = (x, y) => {
    let element = null;
    elementsOnBar.forEach(barElement => {
        if(isInsideRectangle(x, y, barElement.x , barElement.y, barElement.width, barElement.height)) {
            element = barElement;
        }
    })
    return element;
}

let selectedElement = null;
// x and y of mouse when clicked
let xDown, yDown;
// x and y of selected element when mouse clicked
let selectedXWhenDown, selectedYWhenDown;

let drawingFromNode = null;
let elementToSpawn = null;
let creatingElementName = "";
let setCreatingElementName = (name) => {
    creatingElementName = name;
};

function App() {

    const [isMovingElement, setIsMovingElement] = useState(false);
    const [isDrawingPath, setIsDrawingPath] = useState(false);
    const [isSpawningElement, setIsSpawningElement] = useState(false);
    let [isModalOpened, setisModalOpened] = useState(false);
    const canvasRef = useRef(null);

    useEffect(() => {
        let intervalId = setInterval(() =>  {draw(canvasRef.current); updateGates();}, 10);
        return () => {clearInterval(intervalId);};
    }, []);

    const handleKeyDown = (event) => {
        if(event.code == 'Delete') {
            if(selectedElement) {
                for(let i = 0; i < elements.length; ++i) {
                    if(elements[i] === selectedElement) {
                        selectedElement.inputs.forEach(input => {
                            if(input.prevElement) {
                                input.prevElement.deleteNextElement(input);
                            }
                        });
                        selectedElement.outputs.forEach(output => {
                            output.nextElements.forEach(nextElement => {
                                nextElement.prevElement = null;
                                nextElement.signaled = false;
                            });
                        });
                        elements.splice(i, 1);
                    }
                }

            }
        }
        if(event.code == 'Escape') {
            setisModalOpened(false);
        }
        if(event.code == 'Enter') {
            setisModalOpened(false);
            elementToSpawn.createElement(creatingElementName);
            clearField();
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    
    const getMousePosition = (canvas, event) => {
        let y = event.clientY - canvas.offsetTop;
        let x = event.clientX - canvas.offsetLeft;
        return [x, y];
    }
        
    const updateSelectedElement = () => {
        let isFieldClick = true;

        //elements
        elements.forEach(element => {
            if(isInsideRectangle(xDown, yDown, element.x, element.y, element.width, element.height)) {
                isFieldClick = false;
                elements.forEach(e => {
                    e.selected = false;
                });
                element.selected = true;
                selectedElement = element;
                selectedXWhenDown = element.x;
                selectedYWhenDown = element.y;
                setIsMovingElement(true);
            }
        });

        // unselect if clicked on field
        if(isFieldClick) {
            unselectElements();
        }
    }

    const unselectElements = () => {
        elements.forEach(e => {
            e.selected = false;
        });
        selectedElement = null;
    }

    const handleDown = (e) => {
        [xDown, yDown] = getMousePosition(canvasRef.current, e);
        unselectElements();
        updateInputsIfRelated();
        clickButtonsIfRelated();

        let node = getIONodeByPosition(xDown, yDown);
        if(node) {
            drawingFromNode = node;
            setIsDrawingPath(true);
            return;
        }

        let element = getBarElementByPosition(xDown, yDown);
        if(element) {
            if(element.name === "CREATE") {
                setisModalOpened(true);
            }
            else {
                setIsSpawningElement(true);
            }
            elementToSpawn = element;
            return;
        }


        updateSelectedElement();
    }

    const handleUp = (e) => {
    //FieldInputElement, FieldOutputElement, GateInputElement, GateOutputElement
        if(isDrawingPath) {
            let [x, y] = getMousePosition(canvasRef.current, e);
            let node = getIONodeByPosition(x, y);
            if(node !== null && node!== drawingFromNode) {
                let from = null;
                let to = null;
                if(
                    drawingFromNode instanceof FieldInputElement && node instanceof GateInputElement
                    ||
                    drawingFromNode instanceof GateOutputElement && node instanceof GateInputElement
                    ||
                    drawingFromNode instanceof GateOutputElement && node instanceof FieldOutputElement
                ) {
                    from = drawingFromNode;
                    to = node;
                }
                else if(
                    drawingFromNode instanceof GateInputElement && node instanceof FieldInputElement
                    ||
                    drawingFromNode instanceof GateInputElement && node instanceof GateOutputElement
                    ||
                    drawingFromNode instanceof FieldOutputElement && node instanceof GateOutputElement
                ) {
                    from = node;
                    to = drawingFromNode;
                }
                if(from) {
                    if(to.prevElement) {
                        to.prevElement.deleteNextElement(to);
                    }
                    from.nextElements.push(to);
                    to.prevElement = from;
                    to.signaled = from.signaled;
                }
            }
        }
        
        if(isSpawningElement) {
            let element = elementToSpawn.createElement(spawningElement.x, spawningElement.y);
            if(
                element.x > Constants.fieldBeginX + 100 &&
                element.y > Constants.fieldBeginY + 5 &&
                element.x + element.width < Constants.fieldEndX - 100 &&
                element.y + element.height < Constants.fieldEndY - 5
            ){
                elements.push(element);
            }
        }

        setIsMovingElement(false);
        setIsDrawingPath(false);
        setIsSpawningElement(false);
        line = null;
        spawningElement = null;
    }

    const handleLeave = (e) => {
        setIsMovingElement(false);
        setIsDrawingPath(false);
        setIsSpawningElement(false);
        line = null;
        spawningElement = null;
    }

    const handleMove = (e) => {
        if(isDrawingPath) {
            if(
                (drawingFromNode instanceof FieldOutputElement || drawingFromNode instanceof GateInputElement)  
                && drawingFromNode.prevElement
            ) {
                drawingFromNode.prevElement.deleteNextElement(drawingFromNode);
                drawingFromNode.signaled = false;
                drawingFromNode.prevElement = null;
            }
            let [x, y] = getMousePosition(canvasRef.current, e);
            line = [x, y, drawingFromNode.x, drawingFromNode.y]
        }

        if(isMovingElement) {
            let [x, y] = getMousePosition(canvasRef.current, e);
            let xChange = x - xDown;
            let yChange = y - yDown;
            if(selectedXWhenDown + xChange > Constants.fieldBeginX + 100 && selectedYWhenDown + yChange > Constants.fieldBeginY + 5
                && selectedXWhenDown + xChange + selectedElement.width < Constants.fieldEndX - 100
                && selectedYWhenDown + yChange + selectedElement.height < Constants.fieldEndY - 5
            ) {
                selectedElement.updatePosition(selectedXWhenDown + xChange, selectedYWhenDown + yChange);
            }
        }

        if(isSpawningElement) {
            let [x, y] = getMousePosition(canvasRef.current, e);
            spawningElement = {
                name: elementToSpawn.name,
                x: x - elementToSpawn.width / 2,
                y: y - elementToSpawn.height / 2,
                width: elementToSpawn.width,
                height: elementToSpawn.height
            }
        }
    }


	return (
        <>
            {isModalOpened && <ModalCreatingElement />}
            <canvas
                ref={canvasRef}
                height={window.innerHeight}
                width={window.innerWidth}
                onMouseDown={(e) => {handleDown(e)}}
                onMouseUp={(e) => {handleUp(e)}}
                onMouseLeave={(e) => {handleLeave(e)}}
                onMouseMove={(e) => {handleMove(e)}}
            />
        </>
    );
}

export {
    App, inputs, outputs, elements, line, setCreatingElementName,
    elementsOnBar, spawningElement, updateGates
};