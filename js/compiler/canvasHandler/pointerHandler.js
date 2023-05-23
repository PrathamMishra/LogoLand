export default class PointerHandler {
    constructor(canvasHandler) {
        this.pointerData = canvasHandler.pointerData;
        this.pointer = canvasHandler.pointer;
        this.update();
    }

    show() {
        this.pointer.style.visibility = "visible";
    }

    hide() {
        this.pointer.style.visibility = "hidden";
    }

    update() {
        const relativeX = this.pointerData.x - this.pointerData.originX;
        const relativeY = this.pointerData.y - this.pointerData.originY;
        const relativeAngle = this.pointerData.defaultAngle - this.pointerData.angle;
        this.pointer.style.transform = `translate(calc(${relativeX}px - 50%), calc(${relativeY}px - 50%)) rotate(${relativeAngle}deg)`;
    }
}