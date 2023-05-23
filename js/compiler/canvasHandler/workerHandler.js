import { WORKER_MESSAGES } from "../constants.js";

export default class WorkerHandler {
    constructor(canvasHandler) {
        this.canvasHandler = canvasHandler;
        this.worker = new Worker("/js/compiler/worker/fillWorker.js", { type: "module" });
        this.setupMessaging();
    }

    setupMessaging() {
        this.worker.onmessage = (e) => {
            switch (e.data.message) {
                case WORKER_MESSAGES.FILL_REGION: {
                    const imageData = e.data.imageData;
                    this.canvasHandler.ctx.putImageData(imageData, 0, 0);
                    break;
                }
                default: {
                    console.warn("Unknown Message recieved.");
                }
            }
        };
    }

    postMessage(message, data) {
        this.worker.postMessage({
            message,
            data,
        });
    }
}
