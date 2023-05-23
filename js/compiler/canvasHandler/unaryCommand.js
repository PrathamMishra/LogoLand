import { utils } from "../utils.js";

class UnaryCommandHandler {
    constructor(canvasHandler) {
        this.canvasHandler = canvasHandler;
        this.pointerData = canvasHandler.pointerData;
    }

    forward(dist) {
        this.pointerData.x += dist * Math.cos(utils.convertToRadians(this.pointerData.angle));
        this.pointerData.y -= dist * Math.sin(utils.convertToRadians(this.pointerData.angle));
        this.canvasHandler.movePointer();
    }

    backward(dist) {
        this.pointerData.x -= dist * Math.cos(utils.convertToRadians(this.pointerData.angle));
        this.pointerData.y += dist * Math.sin(utils.convertToRadians(this.pointerData.angle));
        this.canvasHandler.movePointer();
    }

    setPenColor(color) {
        this.canvasHandler.ctx.strokeStyle = color;
    }

    setFillColor(color) {
        this.canvasHandler.ctx.fillStyle = color;
    }

    setHeading(angle) {
        this.pointerData.angle = angle;
        this.canvasHandler.movePointer();
    }

    rightTurn(diffAngle){
        this.pointerData.angle -= diffAngle;
        this.canvasHandler.movePointer();
    }

    leftTurn(diffAngle){
        this.pointerData.angle += diffAngle;
        this.canvasHandler.movePointer();
    }

    setX(xPos) {
        this.pointerData.x = this.pointerData.originX + xPos;
        this.canvasHandler.movePointer();
    }

    setY(yPos) {
        this.pointerData.y = this.pointerData.originY - yPos;
        this.canvasHandler.movePointer();
    }
}

export default UnaryCommandHandler;