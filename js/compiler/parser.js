import { BINARY_COMMANDS, CANVAS_COMMANDS, COMMAND_TYPES, NODE_TYPES, TOKEN_TYPES, UNARY_COMMANDS } from "./constants.js";

const UnaryKeywords = Object.values(UNARY_COMMANDS),
    CanvasKeywords = Object.values(CANVAS_COMMANDS),
    BinaryKeywords = Object.values(BINARY_COMMANDS);

export function produceAst(tokens) {
    const prog = {
        type: NODE_TYPES.PROGRAM,
        body: [], // Array of statements
    };
    while (tokens[0].type !== TOKEN_TYPES.END_OF_FILE) {
        if (tokens[0].type === TOKEN_TYPES.KEYWORD) {
            if (BinaryKeywords.includes(tokens[0].value)) {
                if (tokens[0].value === BINARY_COMMANDS.REPEAT) {
                    let iterations,
                        subProg = [];
                    tokens.shift();
                    if (tokens[0].type !== TOKEN_TYPES.NUMBER) {
                        throw new Error(
                            "Error: Repeat expects the number of iterations."
                        );
                    } else {
                        iterations = tokens[0].value;
                        tokens.shift();
                    }
                    if (
                        tokens[0].type !== TOKEN_TYPES.BRACKETS ||
                        tokens[0].value !== "["
                    ) {
                        throw new Error(
                            "Error: Repeat expects an opening bracket ('[')."
                        );
                    } else {
                        tokens.shift();
                        // stack used to parse nested loops.
                        const st = ["["];
                        while (tokens[0].type !== TOKEN_TYPES.END_OF_FILE && st.length) {
                            if (tokens[0].value === "[") st.push("[");
                            else if (tokens[0].value === "]") st.pop();
                            if (st.length) {
                                subProg.push(tokens[0]);
                                tokens.shift();
                            }
                        }
                        if (tokens[0].type === TOKEN_TYPES.END_OF_FILE) {
                            throw new Error(
                                "Error: UnExpected End of file, was expecting ']'."
                            );
                        } else {
                            tokens.shift();
                        }
                        subProg.push({ type: TOKEN_TYPES.END_OF_FILE });
                        subProg = produceAst(subProg);
                    }
                    prog.body.push({
                        type: COMMAND_TYPES.BINARY_COMMAND,
                        command: BINARY_COMMANDS.REPEAT,
                        iterations,
                        subProg,
                    });
                } else if (tokens[0].value === BINARY_COMMANDS.SET_POSITION) {
                    let x, y;
                    tokens.shift();
                    if (
                        tokens[0].type !== TOKEN_TYPES.BRACKETS ||
                        tokens[0].value !== "["
                    ) {
                        throw new Error(
                            "Error: setxy expects an opening bracket ('[')."
                        );
                    } else {
                        tokens.shift();
                        if (
                            tokens[0].type !== TOKEN_TYPES.NUMBER ||
                            tokens[1].type !== TOKEN_TYPES.NUMBER
                        ) {
                            throw new Error(
                                "Error: setxy expects two numbers for x and y inside braces."
                            );
                        } else {
                            x = tokens[0].value;
                            y = tokens[1].value;
                            tokens.splice(0, 2);
                            if (
                                tokens[0].type !== TOKEN_TYPES.BRACKETS ||
                                tokens[0].value !== "]"
                            ) {
                                throw new Error(
                                    "Error: Expected a closing bracket (']')."
                                );
                            } else {
                                tokens.shift();
                            }
                        }
                    }
                    prog.body.push({
                        type: COMMAND_TYPES.BINARY_COMMAND,
                        command: BINARY_COMMANDS.SET_POSITION,
                        x,
                        y,
                    });
                } else if (tokens[0].value === BINARY_COMMANDS.ARC) {
                    let angle, radius;
                    tokens.shift();
                    if (
                        tokens[0].type !== TOKEN_TYPES.NUMBER ||
                        tokens[1].type !== TOKEN_TYPES.NUMBER
                    ) {
                        throw new Error(
                            "Error: arc expects two numbers for angle and radius."
                        );
                    } else {
                        angle = tokens[0].value;
                        radius = tokens[1].value;
                        tokens.splice(0, 2);
                    }
                    prog.body.push({
                        type: COMMAND_TYPES.BINARY_COMMAND,
                        command: BINARY_COMMANDS.ARC,
                        angle,
                        radius,
                    });
                } else if (tokens[0].value === BINARY_COMMANDS.RANDOM) {
                    let start, end;
                    tokens.shift();
                    if (
                        tokens[0].type !== TOKEN_TYPES.NUMBER ||
                        tokens[1].type !== TOKEN_TYPES.NUMBER
                    ) {
                        throw new Error(
                            "Error: random expects two numbers for range."
                        );
                    } else {
                        start = tokens[0].value;
                        end = tokens[1].value;
                        tokens.splice(0, 2);
                    }
                    prog.body.push({
                        type: COMMAND_TYPES.BINARY_COMMAND,
                        command: BINARY_COMMANDS.RANDOM,
                        start,
                        end,
                    });
                }
            } else if (UnaryKeywords.includes(tokens[0].value)) {
                if (
                    (tokens[0].value === UNARY_COMMANDS.SET_PEN_COLOR ||
                        tokens[0].value === UNARY_COMMANDS.SET_FILL_COLOR) &&
                    tokens[1].type !== TOKEN_TYPES.STRING
                ) {
                    throw new Error(`Error: ${tokens[0].value} expects a string.`);
                } else if (
                    tokens[0].value !== UNARY_COMMANDS.SET_PEN_COLOR &&
                    tokens[0].value !== UNARY_COMMANDS.SET_FILL_COLOR &&
                    tokens[1].type !== TOKEN_TYPES.NUMBER
                ) {
                    throw new Error(
                        `Error: ${tokens[0].value} expects a number.`
                    );
                }
                prog.body.push({
                    type: COMMAND_TYPES.UNARY_COMMAND,
                    command: tokens[0].value,
                    value: tokens[1].value,
                });
                tokens.splice(0, 2);
            } else if (CanvasKeywords.includes(tokens[0].value)) {
                prog.body.push({
                    type: COMMAND_TYPES.CANVAS_COMMAND,
                    command: tokens[0].value,
                });
                tokens.shift();
            } else {
                throw new Error(
                    `Error: Unexpected keyword found: ${tokens[0].value}`
                );
            }
        } else {
            throw new Error(
                `Error: Unexpected token found: ${tokens[0].value}`
            );
        }
    }
    return prog;
}
