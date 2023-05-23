import { TOKEN_TYPES } from "../constants.js";
import lexerUtils from "./lexerUtils.js";

class Lexer {
    tokenize(text) {
        const str = text.split(""),
            tokens = [];
        while (str.length) {
            if (lexerUtils.canSkip(str[0])) {
                str.shift();
            } else if (lexerUtils.isNum(str[0])) {
                let num = "";
                while (str.length && lexerUtils.isNum(str[0])) {
                    num += str[0];
                    str.shift();
                }
                // Add logic for showing bug when "." is encountered
                if (str.length) {
                    if (str[0] === ".") {
                        throw new Error("Error: Decimals are not supported.");
                    } else if (!lexerUtils.canSkip(str[0])) {
                        throw new Error("Error: Number is incorrect.");
                    }
                }
                tokens.push({ type: TOKEN_TYPES.NUMBER, value: Number(num) });
            } else if (lexerUtils.isChar(str[0])) {
                let token = "";
                while (str.length && lexerUtils.isChar(str[0])) {
                    token += str[0];
                    str.shift();
                }
                if (lexerUtils.isReserved(token)) {
                    tokens.push({ type: TOKEN_TYPES.KEYWORD, value: token });
                } else {
                    tokens.push({ type: TOKEN_TYPES.IDENTIFIER, value: token });
                }
            } else if (lexerUtils.isBracs(str[0])) {
                tokens.push({ type: TOKEN_TYPES.BRACKETS, value: str[0] });
                str.shift();
            } else if (str[0] === '"') {
                str.shift();
                let token = "";
                while (str.length && !lexerUtils.canSkip(str[0])) {
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
}

export default Lexer;

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
