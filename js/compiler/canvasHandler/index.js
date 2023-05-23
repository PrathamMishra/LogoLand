import { WORKER_MESSAGES } from "../constants.js";
import { utils } from "../utils.js";
import BinaryCommandHandler from "./binaryCommand.js";
import PointerHandler from "./pointerHandler.js";
import UnaryCommandHandler from "./unaryCommand.js";
import WorkerHandler from "./workerHandler.js";

class CanvasHandler {
    constructor(canvas, pointer) {
        this.canvas = canvas;
        this.pointer = pointer;
        this.ctx = canvas.getContext("2d", { willReadFrequently: true });
        this.width = canvas.width;
        this.height = canvas.height;
        this.pointerData = {
            originX: Math.floor(canvas.width / 2),
            x: Math.floor(canvas.width / 2),
            originY: Math.floor(canvas.height / 2),
            y: Math.floor(canvas.height / 2),
            defaultAngle: 90,
            angle: 90,
            pu: false,
        };
        this.ctx.beginPath();
        this.ctx.moveTo(this.pointerData.x, this.pointerData.y);
        this.unaryCommands = new UnaryCommandHandler(this);
        this.pointerHandler = new PointerHandler(this);
        this.binaryCommands = new BinaryCommandHandler(this);
        this.worker = new WorkerHandler(this);
    }

    clearScreen() {
        this.centerPointer();
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    centerPointer() {
        this.pointerData.x = this.pointerData.originX;
        this.pointerData.y = this.pointerData.originY;
        this.pointerData.angle = this.pointerData.defaultAngle;
        this.movePointer();
    }

    penUp() {
        this.pointerData.pu = true;
    }

    penDown() {
        this.pointerData.pu = false;
    }

    movePointer() {
        if (this.pointerData.pu) {
            this.ctx.moveTo(this.pointerData.x, this.pointerData.y);
        } else {
            this.ctx.lineTo(this.pointerData.x, this.pointerData.y);
            this.ctx.stroke();
        }
        this.pointerHandler.update();
    }

    hidePointer() {
        this.pointerHandler.hide();
    }

    showPointer() {
        this.pointerHandler.show();
    }

    fillRegion() {
        const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        this.worker.postMessage(WORKER_MESSAGES.FILL_REGION, {
            x: Math.floor(this.pointerData.x),
            y: Math.floor(this.pointerData.y),
            fillColor: utils.hexToRGB(this.ctx.fillStyle),
            imageData,
        });
    }
}
export default CanvasHandler;
