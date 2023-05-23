import { BINARY_COMMANDS, CANVAS_COMMANDS, COMMAND_TYPES, UNARY_COMMANDS } from "../constants.js";
import { utils } from "../utils.js";

class Interpreter {
    constructor(canvasHandler) {
        this.canvasHandler = canvasHandler;
    }

    executeAst(ast) {
        if (ast.type === "program") {
            const statements = ast.body;
            while (statements.length) {
                const command = statements[0];
                if (command.type === COMMAND_TYPES.UNARY_COMMAND) {
                    this.handleUnaryCommand(command, this.canvasHandler.unaryCommands);
                } else if (command.type === COMMAND_TYPES.BINARY_COMMAND) {
                    this.handleBinaryCommand(command, this.canvasHandler.binaryCommands);
                } else if (command.type === COMMAND_TYPES.CANVAS_COMMAND) {
                    this.handleCanvasCommand(command);
                }
                statements.shift();
            }
        }
    }

    handleUnaryCommand (command, commandHandler){
        switch (command.command) {
            case UNARY_COMMANDS.FORWARD:
                commandHandler.forward(command.value);
                break;
            case UNARY_COMMANDS.BACKWARD:
                commandHandler.backward(command.value);
                break;
            case UNARY_COMMANDS.RIGHT_TURN:
                commandHandler.rightTurn(command.value);
                break;
            case UNARY_COMMANDS.LEFT_TURN:
                commandHandler.leftTurn(command.value);
                break;
            case UNARY_COMMANDS.SET_HEADING:
                commandHandler.setHeading(command.value);
                break;
            case UNARY_COMMANDS.SET_X:
                commandHandler.setX(command.value);
                break;
            case UNARY_COMMANDS.SET_Y:
                commandHandler.setY(command.value);
                break;
            case UNARY_COMMANDS.SET_PEN_COLOR:
                if (utils.isValidColor(command.value)) {
                    commandHandler.setPenColor(command.value);
                } else {
                    throw new Error("Error: Invalid color name.");
                }
                break;
            case UNARY_COMMANDS.SET_FILL_COLOR:
                if (utils.isValidColor(command.value)) {
                    commandHandler.setFillColor(command.value);
                } else {
                    throw new Error("Error: Invalid color name.");
                }
                break;
        }
    }

    handleBinaryCommand (command, commandHandler) {
        if (command.command === BINARY_COMMANDS.REPEAT) {
            while (command.iterations--) {
                const copy = JSON.parse(JSON.stringify(command));
                this.executeAst(copy.subProg, canvas, pointer);
            }
        } else if (command.command === BINARY_COMMANDS.SET_POSITION) {
            commandHandler.setPosition(command.x, command.y);
        } else if (command.command === BINARY_COMMANDS.ARC) {
            commandHandler.arc(command.angle, command.radius);
        }
        // TODO: IMPLEMENT random.
    }

    handleCanvasCommand (command) {
        switch (command.command) {
            case CANVAS_COMMANDS.CENTER_POINTER:
                this.canvasHandler.centerPointer();
                break;
            case CANVAS_COMMANDS.CLEAR_SCREEN:
                this.canvasHandler.clearScreen();
                break;
            case CANVAS_COMMANDS.PEN_UP:
                this.canvasHandler.penUp();
                break;
            case CANVAS_COMMANDS.PEN_DOWN:
                this.canvasHandler.penDown();
                break;
            case CANVAS_COMMANDS.HIDE_POINTER:
                this.canvasHandler.hidePointer();
                break;
            case CANVAS_COMMANDS.SHOW_POINTER:
                this.canvasHandler.showPointer();
                break;
            case CANVAS_COMMANDS.FILL_REGION:
                this.canvasHandler.fillRegion();
                break;
        }
    }
}

export default Interpreter;