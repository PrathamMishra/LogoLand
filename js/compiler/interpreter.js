import { showFillingLoader, hideFillingLoader } from "../index.js";

// setup worker.
const worker = new Worker("/js/compiler/fillWorker.js");

const pointerData = {
    origX: 0,
    origY: 0,
    x: 0,
    y: 0,
    angle: 90,
    pu: false
};
let ctx;

export function executeAst(ast, canvas, pointer) {
    ctx = ctx || canvas.getContext("2d", { willReadFrequently: true });
    pointerData.origX = Math.floor(canvas.width / 2);
    pointerData.origY = Math.floor(canvas.height / 2);
    pointerData.x = pointerData.x || pointerData.origX;
    pointerData.y = pointerData.y || pointerData.origY; 
    pointerData.angle =  typeof pointerData.angle === "undefined" ? 90 : pointerData.angle;
    ctx.beginPath();
    ctx.moveTo(pointerData.x, pointerData.y);
    updateTurtlePosition();
    if (ast.type === "program") {
        const statements = ast.body;
        while (statements.length) {
            const command = statements[0];
            if (command.type === "UnaryCommand") {
                switch (command.command) {
                    case "fd":
                        forward(command.value);
                        break;
                    case "bk":
                        backward(command.value);
                        break;
                    case "rt":
                        setAngle(pointerData.angle-command.value);
                        break;
                    case "lt":
                        setAngle(pointerData.angle+command.value);
                        break; 
                    case "seth":
                    case "setheading":
                        setAngle(90 - command.value);
                        break;
                    case "setx":
                        // TODO : move this to a function
                        pointerData.x = pointerData.origX + command.value;
                        moveTurtle();
                        updateTurtlePosition();
                        break;
                    case "sety":
                        // TODO : move this to a function
                        pointerData.y = pointerData.origY + command.value;
                        moveTurtle();
                        updateTurtlePosition();
                        break;
                    case "setpencolor":
                        ctx.strokeStyle = command.value;
                        // TODO : check for unsafe colors
                        break;
                    case "setfillcolor":
                        ctx.fillStyle = command.value;
                        // TODO : check for unsafe colors
                        break;
                }
            }
            else if (command.type === "BinaryCommand") {
                if (command.command === "repeat") {
                    while (command.iterations--) {
                        const copy = JSON.parse(JSON.stringify(command));
                        executeAst(copy.subProg, canvas, pointer);
                    }
                }
                else if (command.command === "setxy") {
                    pointerData.x = pointerData.origX + command.x;
                    pointerData.y = pointerData.origY - command.y;
                    moveTurtle();
                    updateTurtlePosition();
                }
                else if (command.command === "arc") {
                    drawArc(command.angle, command.radius);
                }
                // TODO: IMPLEMENT random.
            }
            else if (command.type === "CanvasCommand") {
                switch (command.command) {
                    case "home":
                        centerTurtle();
                        break;
                    case "cs":
                        clearScreen();
                        break;
                    case "pu":
                        pointerData.pu=true;
                        break;
                    case "pd":
                        pointerData.pu=false;
                        break; 
                    case "ht":
                        pointer.style.visibility = "hidden";
                        break;
                    case "st":
                        pointer.style.visibility = "visible";
                        break; 
                    case "fill":
                        // floodFill();
                        floodFillWithWorker();
                        break; 
                }
            }
            statements.shift();
        }
    }
}

// Move this inside a canvas handler class
function convertToRadians(deg) {
    const rad = Math.PI * deg / 180;
    return rad;
}

function forward(value) {
    pointerData.x += value*Math.cos(convertToRadians(pointerData.angle));
    pointerData.y -= value*Math.sin(convertToRadians(pointerData.angle));
    moveTurtle();
    updateTurtlePosition();
}

function backward(value) {
    pointerData.x -= value*Math.cos(convertToRadians(pointerData.angle));
    pointerData.y += value*Math.sin(convertToRadians(pointerData.angle));
    moveTurtle();
    updateTurtlePosition();
}

function centerTurtle(){
    pointerData.x = pointerData.origX;
    pointerData.y = pointerData.origY;
    ctx.moveTo(pointerData.x, pointerData.y);
    updateTurtlePosition();
    setAngle(90);
}

function clearScreen() {
    ctx.clearRect(0,0,1000,500);
    centerTurtle();
}

function setAngle(angle) {
    pointerData.angle = angle;
    pointer.style.transform = `translate(calc(${pointerData.x-pointerData.origX}px - 50%), calc(${pointerData.y-pointerData.origY}px - 50%)) rotate(${90-pointerData.angle}deg)`;
}

function updateTurtlePosition() {
    const relativeX = pointerData.x - pointerData.origX;
    const relativeY = pointerData.y - pointerData.origY;
    const relativeAngle = 90 - pointerData.angle;
    pointer.style.transform = `translate(calc(${relativeX}px - 50%), calc(${relativeY}px - 50%)) rotate(${relativeAngle}deg)`;
}

function moveTurtle() {
    if (pointerData.pu) {
        ctx.moveTo(pointerData.x, pointerData.y);
    } 
    else {
        ctx.lineTo(pointerData.x, pointerData.y);
        ctx.stroke();
    }
}

function drawArc(angle, radius) {
    ctx.beginPath();
    ctx.arc(pointerData.x, pointerData.y, radius, convertToRadians(-1*pointerData.angle), convertToRadians(angle-pointerData.angle));
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pointerData.x, pointerData.y);
}

// when the worker finished filling it will pass us
// back an imagedata.
worker.onmessage = (e) => {
    const imageData = e.data;
    // put the data back
    ctx.putImageData(imageData, 0, 0);
    hideFillingLoader();
};

function floodFillWithWorker() {
    // read the pixels in the canvas
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    showFillingLoader();
    // send them over to the worker to fill
    worker.postMessage({x: Math.floor(pointerData.x), y: Math.floor(pointerData.y), fillColor: hexToRGB(ctx.fillStyle), imageData});
}

function hexToRGB(hex) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
}