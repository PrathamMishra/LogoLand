import { TOKEN_TYPES } from "./constants";

export function tokenize(text) {
    const str = text.split(""),
        tokens = [];
    while (str.length) {
        if (canSkip(str[0])) {
            str.shift();
        } else if (isNum(str[0])) {
            let num = "";
            while (str.length && isNum(str[0])) {
                num += str[0];
                str.shift();
            }
            // Add logic for showing bug when "." is encountered
            if (str[0] === ".") {
                throw new Error("Error: Decimals are not supported.");
            }
            tokens.push({ type: TOKEN_TYPES.NUMBER, value: Number(num) });
        } else if (isChar(str[0])) {
            let token = "";
            while (str.length && isChar(str[0])) {
                token += str[0];
                str.shift();
            }
            if (isReserved(token)) {
                tokens.push({ type: TOKEN_TYPES.KEYWORD, value: token });
            } else {
                tokens.push({ type: TOKEN_TYPES.IDENTIFIER, value: token });
            }
        } else if (isBracs(str[0])) {
            tokens.push({ type: TOKEN_TYPES.BRACKETS, value: str[0] });
            str.shift();
        } else if (str[0] === '"') {
            str.shift();
            let token = "";
            while (str.length && !canSkip(str[0])) {
                token += str[0];
                str.shift();
            }
            tokens.push({
                type: TOKEN_TYPES.STRING,
                value: token,
            });
        } else {
            throw new Error(`Unidentified character ${str[0]}`);
        }
    }
    tokens.push({ type: TOKEN_TYPES.END_OF_FILE });
    return tokens;
}

function canSkip(char) {
    return char === " " || char === "\n" || char === "\t";
}

function isNum(char) {
    return char >= "0" && char <= "9";
}

function isChar(char) {
    return char.toLowerCase() >= "a" && char.toLowerCase() <= "z";
}

function isReserved(token) {
    const reserved = [
        // Canvas & Pointer commands
        "home",
        "cs",
        "pd",
        "pu",
        "ht",
        "st",
        "fill",
        // Unary commands
        "fd",
        "bk",
        "rt",
        "lt",
        "seth",
        "setheading",
        "setpencolor",
        "setfillcolor",
        "setx",
        "sety",
        // Binary commands
        "repeat",
        "setxy",
        "arc",
        "random",
    ];
    return reserved.includes(token);
}

function isBracs(token) {
    return token === "[" || token === "]";
}

// TODO: add support for variables.
// TODO: add support for expressions (Arithmetic Operations, accessing vars, calling functions etc.).
// TODO: add support for strings.
// TODO: add label (it writes text on screen).
// TODO: Update the code editor to only execute single line of code rather than multiple lines and have a command history/Console.
// TODO: Add a seperate code editor to define procedures and use them as soon as they are written on main code editor.
// TODO: add support for procedures/functions.
// TODO: add safety check for recursion.
// TODO: add support for conditionals.
// TODO: add support for conditional loops.
// TODO: add support for negative numbers.
// TODO: add support for Binary operators without braces.
// TODO: Add cleartext/CT command which clears command history.
// TODO: Add Support for defining custom colors just like procedures. and provide a color picker.
