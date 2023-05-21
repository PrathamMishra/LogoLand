import Lexer from "./lexer/index.js";
import { produceAst } from "./parser.js";
import { executeAst } from "./interpreter.js";

export default class LogoInterpreter {
    constructor(container, canvasData = {width: 1000, height: 500}, pointerData = {pointerLink: "", width: 15, height: 15}) {
        // TODO: move this logic and its styling inside a shadowDOM.
        if (!container)
            throw new Error(
                "Please provide a canvas to initialize interpreter"
            );
        let canvasHtml, pointerHtml;
        canvasHtml = `<canvas id="cnv" width="${canvasData.width}" height="${canvasData.height}"></canvas>`;
        if (pointerData.pointerLink) {
            pointerHtml = `<img src=${pointerData.pointerLink} id="pointer" width="${pointerData.width}px" height="${pointerData.height}px" alt="pointer"/>`;
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
        this.lexer = new Lexer();
    }

    runCommand(command) {
        try {
            const tokens = this.lexer.tokenize(command);
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
