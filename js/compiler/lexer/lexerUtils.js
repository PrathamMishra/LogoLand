import {
    BINARY_COMMANDS,
    CANVAS_COMMANDS,
    UNARY_COMMANDS,
} from "../constants.js";

const lexerUtils = {
    canSkip: (char) => {
        return char === " " || char === "\n" || char === "\t";
    },

    isNum: (char) => {
        return char >= "0" && char <= "9";
    },

    isChar: (char) => {
        return char.toLowerCase() >= "a" && char.toLowerCase() <= "z";
    },

    isReserved: (token) => {
        const reserved = [
            // Canvas & Pointer commands
            ...Object.values(CANVAS_COMMANDS),
            // Unary commands
            ...Object.values(UNARY_COMMANDS),
            // Binary commands
            ...Object.values(BINARY_COMMANDS),
        ];
        return reserved.includes(token);
    },

    isBracs: (char) => {
        return char === "[" || char === "]";
    },
};

export default lexerUtils;
