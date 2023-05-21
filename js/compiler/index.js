import { tokenize } from "./lexer.js";
import { produceAst } from "./parser.js";
import { executeAst } from "./interpreter.js";

export default class LogoInterpreter {
    constructor(container, pointerLink = "") {
        // TODO: move this logic and its styling inside a shadowDOM.
        if (!container)
            throw new Error(
                "Please provide a canvas to initialize interpreter"
            );
        let canvasHtml, pointerHtml;
        canvasHtml = `<canvas id="cnv" width="1000" height="500"></canvas>`;
        if (pointerLink) {
            pointerHtml = `<img src=${pointerLink} id="pointer" width="15px" height="15px" alt="pointer"/>`;
        } else {
            pointerHtml = `<svg id="pointer" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="15px" viewBox="0 0 100 200">
                <polygon points="50 15, 100 100, 0 100"></polygon>
                <polygon points="0 100, 100 100, 100 200, 0 200"></polygon>
            </svg>`;
        }
        container.innerHTML = canvasHtml + pointerHtml;
        container.style.position = "relative";
        container.style.overflow = "hidden";
        this.canvas = container.querySelector("#cnv");
        this.pointer = container.querySelector("#pointer");
    }

    runCommand(command) {
        try {
            const tokens = tokenize(command);
            const ast = produceAst(tokens);
            executeAst(ast, this.canvas, this.pointer);
        } catch (err) {
            this.throwError(err.message);
        }
    }

    onError(callback = () => {}) {
        this.errorCallback = callback;
    }

    throwError(errorMessage) {
        if (this.errorCallback) {
            this.errorCallback(errorMessage);
        } else {
            throw new Error(errorMessage);
        }
    }
}
