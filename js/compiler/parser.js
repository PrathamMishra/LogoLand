const UnaryKeywords = [
        "rt",
        "fd",
        "bk",
        "lt",
        "seth",
        "setheading",
        "setpencolor",
        "setfillcolor",
        "setx",
        "sety",
    ],
    CanvasCommands = ["home", "cs", "pd", "pu", "ht", "st", "fill"],
    BinaryCommands = ["setxy", "repeat", "arc"];

export function produceAst(tokens) {
    const prog = {
        type: "program",
        body: [], // Array of statements
    };
    while (tokens[0].type !== "EOF") {
        if (tokens[0].type === "keyword") {
            if (BinaryCommands.includes(tokens[0].value)) {
                if (tokens[0].value === "repeat") {
                    let iterations,
                        subProg = [];
                    tokens.shift();
                    if (tokens[0].type !== "number") {
                        throw new Error(
                            "Error: Repeat expects the number of iterations."
                        );
                    } else {
                        iterations = tokens[0].value;
                        tokens.shift();
                    }
                    if (
                        tokens[0].type !== "braces" ||
                        tokens[0].value !== "["
                    ) {
                        throw new Error(
                            "Error: Repeat expects an opening bracket ('[')."
                        );
                    } else {
                        tokens.shift();
                        // stack used to parse nested loops.
                        const st = ["["];
                        while (tokens[0].type !== "EOF" && st.length) {
                            if (tokens[0].value === "[") st.push("[");
                            else if (tokens[0].value === "]") st.pop();
                            if (st.length) {
                                subProg.push(tokens[0]);
                                tokens.shift();
                            }
                        }
                        if (tokens[0].type === "EOF") {
                            throw new Error(
                                "Error: UnExpected End of file, was expecting ']'."
                            );
                        } else {
                            tokens.shift();
                        }
                        subProg.push({ type: "EOF" });
                        subProg = produceAst(subProg);
                    }
                    prog.body.push({
                        type: "BinaryCommand",
                        command: "repeat",
                        iterations,
                        subProg,
                    });
                } else if (tokens[0].value === "setxy") {
                    let x, y;
                    tokens.shift();
                    if (
                        tokens[0].type !== "braces" ||
                        tokens[0].value !== "["
                    ) {
                        throw new Error(
                            "Error: setxy expects an opening bracket ('[')."
                        );
                    } else {
                        tokens.shift();
                        if (
                            tokens[0].type !== "number" ||
                            tokens[1].type !== "number"
                        ) {
                            throw new Error(
                                "Error: setxy expects two numbers for x and y inside braces."
                            );
                        } else {
                            x = tokens[0].value;
                            y = tokens[1].value;
                            tokens.splice(0, 2);
                            if (
                                tokens[0].type !== "braces" ||
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
                        type: "BinaryCommand",
                        command: "setxy",
                        x,
                        y,
                    });
                } else if (tokens[0].value === "arc") {
                    let angle, radius;
                    tokens.shift();
                    if (
                        tokens[0].type !== "number" ||
                        tokens[1].type !== "number"
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
                        type: "BinaryCommand",
                        command: "arc",
                        angle,
                        radius,
                    });
                } else if (tokens[0].value === "random") {
                    let start, end;
                    tokens.shift();
                    if (
                        tokens[0].type !== "number" ||
                        tokens[1].type !== "number"
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
                        type: "BinaryCommand",
                        command: "arc",
                        start,
                        end,
                    });
                }
            } else if (UnaryKeywords.includes(tokens[0].value)) {
                if (
                    (tokens[0].value === "setpencolor" ||
                        tokens[0].value === "setfillcolor") &&
                    tokens[1].type !== "string"
                ) {
                    throw new Error(`Error: setpencolor expects a string.`);
                } else if (
                    tokens[0].value !== "setpencolor" &&
                    tokens[0].value !== "setfillcolor" &&
                    tokens[1].type !== "number"
                ) {
                    throw new Error(
                        `Error: ${tokens[0].value} expects a number.`
                    );
                }
                prog.body.push({
                    type: "UnaryCommand",
                    command: tokens[0].value,
                    value: tokens[1].value,
                });
                tokens.splice(0, 2);
            } else if (CanvasCommands.includes(tokens[0].value)) {
                prog.body.push({
                    type: "CanvasCommand",
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
