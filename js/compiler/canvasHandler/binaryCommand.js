import { utils } from "../utils.js";

export default class BinaryCommandHandler {
    constructor(canvasHandler) {
        this.canvasHandler = canvasHandler;
        this.pointerData = canvasHandler.pointerData;
    }

    setPosition(x, y) {
        this.pointerData.x = this.pointerData.originX + x;
        this.pointerData.y = this.pointerData.originY - y;
        this.canvasHandler.movePointer();
    }

    arc(angle, radius) {
        this.canvasHandler.ctx.beginPath();
        this.canvasHandler.ctx.arc(
            this.pointerData.x,
            this.pointerData.y,
            radius,
            utils.convertToRadians(-1 * this.pointerData.angle),
            utils.convertToRadians(angle - this.pointerData.angle)
        );
        this.canvasHandler.ctx.stroke();
        this.canvasHandler.ctx.beginPath();
        this.canvasHandler.ctx.moveTo(this.pointerData.x, this.pointerData.y);
    }

    random() {
        // TODO: implement random function
    }
}
