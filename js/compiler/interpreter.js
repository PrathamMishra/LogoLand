import { showFillingLoader, hideFillingLoader } from "../index.js";
import { BINARY_COMMANDS, CANVAS_COMMANDS, COMMAND_TYPES, UNARY_COMMANDS } from "./constants.js";

// setup worker.
const worker = new Worker("/js/compiler/fillWorker.js");

const pointerData = {
    defaultX: 0,
    defaultY: 0,
    defaultAngle: 90,
    pu: false,
};
let ctx;

export function executeAst(ast, canvas, pointer) {
    ctx = ctx || canvas.getContext("2d", { willReadFrequently: true });
    pointerData.defaultX = Math.floor(canvas.width / 2);
    pointerData.defaultY = Math.floor(canvas.height / 2);
    pointerData.x =
        typeof pointerData.x !== "undefined"
            ? pointerData.x
            : pointerData.defaultX;
    pointerData.y =
        typeof pointerData.y !== "undefined"
            ? pointerData.y
            : pointerData.defaultY;
    pointerData.angle =
        typeof pointerData.angle === "undefined" ? 90 : pointerData.angle;
    ctx.beginPath();
    ctx.moveTo(pointerData.x, pointerData.y);
    updatePointerPosition();
    if (ast.type === "program") {
        const statements = ast.body;
        while (statements.length) {
            const command = statements[0];
            if (command.type === COMMAND_TYPES.UNARY_COMMAND) {
                switch (command.command) {
                    case UNARY_COMMANDS.FORWARD:
                        forward(command.value);
                        break;
                    case UNARY_COMMANDS.BACKWARD:
                        backward(command.value);
                        break;
                    case UNARY_COMMANDS.RIGHT_TURN:
                        setAngle(pointerData.angle - command.value);
                        break;
                    case UNARY_COMMANDS.LEFT_TURN:
                        setAngle(pointerData.angle + command.value);
                        break;
                    case UNARY_COMMANDS.SET_HEADING:
                        setAngle(pointerData.defaultAngle - command.value);
                        break;
                    case UNARY_COMMANDS.SET_X:
                        setPosition(
                            pointerData.defaultX + command.value,
                            pointerData.y
                        );
                        break;
                    case UNARY_COMMANDS.SET_Y:
                        setPosition(
                            pointerData.x,
                            pointerData.defaultY + command.value
                        );
                        break;
                    case UNARY_COMMANDS.SET_PEN_COLOR:
                        if (isValidColor(command.value)) {
                            ctx.strokeStyle = command.value;
                        } else {
                            throw new Error("Error: Invalid color name.");
                        }
                        break;
                    case UNARY_COMMANDS.SET_FILL_COLOR:
                        if (isValidColor(command.value)) {
                            ctx.fillStyle = command.value;
                        } else {
                            throw new Error("Error: Invalid color name.");
                        }
                        break;
                }
            } else if (command.type === COMMAND_TYPES.BINARY_COMMAND) {
                if (command.command === BINARY_COMMANDS.REPEAT) {
                    while (command.iterations--) {
                        const copy = JSON.parse(JSON.stringify(command));
                        executeAst(copy.subProg, canvas, pointer);
                    }
                } else if (command.command === BINARY_COMMANDS.SET_POSITION) {
                    setPosition(
                        pointerData.defaultX + command.x,
                        pointerData.defaultY - command.y
                    );
                } else if (command.command === BINARY_COMMANDS.ARC) {
                    drawArc(command.angle, command.radius);
                }
                // TODO: IMPLEMENT random.
            } else if (command.type === COMMAND_TYPES.CANVAS_COMMAND) {
                switch (command.command) {
                    case CANVAS_COMMANDS.CENTER_TURTLE:
                        centerTurtle();
                        break;
                    case CANVAS_COMMANDS.CLEAR_SCREEN:
                        clearScreen();
                        break;
                    case CANVAS_COMMANDS.PEN_UP:
                        pointerData.pu = true;
                        break;
                    case CANVAS_COMMANDS.PEN_DOWN:
                        pointerData.pu = false;
                        break;
                    case CANVAS_COMMANDS.HIDE_POINTER:
                        pointer.style.visibility = "hidden";
                        break;
                    case CANVAS_COMMANDS.SHOW_POINTER:
                        pointer.style.visibility = "visible";
                        break;
                    case CANVAS_COMMANDS.FILL_REGION:
                        floodFillWithWorker();
                        break;
                }
            }
            statements.shift();
        }
    }
}

function isValidColor(strColor) {
    var s = new Option().style;
    s.color = strColor;

    // return 'false' if color wasn't assigned
    return s.color == strColor.toLowerCase();
}

// Move this inside a canvas handler class
function convertToRadians(deg) {
    const rad = (Math.PI * deg) / 180;
    return rad;
}

function forward(value) {
    pointerData.x += value * Math.cos(convertToRadians(pointerData.angle));
    pointerData.y -= value * Math.sin(convertToRadians(pointerData.angle));
    moveTurtle();
    updatePointerPosition();
}

function backward(value) {
    pointerData.x -= value * Math.cos(convertToRadians(pointerData.angle));
    pointerData.y += value * Math.sin(convertToRadians(pointerData.angle));
    moveTurtle();
    updatePointerPosition();
}

function centerTurtle() {
    pointerData.x = pointerData.defaultX;
    pointerData.y = pointerData.defaultY;
    ctx.moveTo(pointerData.x, pointerData.y);
    pointerData.angle = pointerData.defaultAngle;
    updatePointerPosition();
}

function clearScreen() {
    centerTurtle();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function setAngle(angle) {
    pointerData.angle = angle;
    updatePointerPosition();
}

function setPosition(x, y) {
    pointerData.x = x;
    pointerData.y = y;
    moveTurtle();
    updatePointerPosition();
}

function updatePointerPosition() {
    const relativeX = pointerData.x - pointerData.defaultX;
    const relativeY = pointerData.y - pointerData.defaultY;
    const relativeAngle = pointerData.defaultAngle - pointerData.angle;
    pointer.style.transform = `translate(calc(${relativeX}px - 50%), calc(${relativeY}px - 50%)) rotate(${relativeAngle}deg)`;
}

function moveTurtle() {
    if (pointerData.pu) {
        ctx.moveTo(pointerData.x, pointerData.y);
    } else {
        ctx.lineTo(pointerData.x, pointerData.y);
        ctx.stroke();
    }
}

function drawArc(angle, radius) {
    ctx.beginPath();
    ctx.arc(
        pointerData.x,
        pointerData.y,
        radius,
        convertToRadians(-1 * pointerData.angle),
        convertToRadians(angle - pointerData.angle)
    );
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
    const imageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
    );
    showFillingLoader();
    // send them over to the worker to fill
    worker.postMessage({
        x: Math.floor(pointerData.x),
        y: Math.floor(pointerData.y),
        fillColor: hexToRGB(ctx.fillStyle),
        imageData,
    });
}

function hexToRGB(hex) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, 255];
}
