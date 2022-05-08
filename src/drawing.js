import Constants from "./constants"

const draw = (canvas) => {
    const context = canvas.getContext('2d');
    context.fillStyle = Constants.backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

export {draw}