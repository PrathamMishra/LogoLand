export const TOKEN_TYPES = {
    KEYWORD: "keyword",
    STRING: "string",
    END_OF_FILE: "EOF",
    NUMBER: "number",
    BRACKETS: "brackets",
    IDENTIFIER: "identifier",
};

export const COMMAND_TYPES = {
    UNARY_COMMAND: "UnaryCommand",
    CANVAS_COMMAND: "CanvasCommand",
    BINARY_COMMAND: "BinaryCommand",
};

export const NODE_TYPES = {
    PROGRAM: "program"
};

export const UNARY_COMMANDS = {
    RIGHT_TURN: "rt",
    LEFT_TURN: "lt",
    FORWARD: "fd",
    BACKWARD: "bk",
    SET_HEADING: "setheading",
    SET_PEN_COLOR: "setpencolor",
    SET_FILL_COLOR: "setfillcolor",
    SET_X: "setx",
    SET_Y: "sety",
};

export const BINARY_COMMANDS = {
    SET_POSITION: "setxy",
    REPEAT: "repeat",
    ARC: "arc",
    RANDOM: "random",
};

export const CANVAS_COMMANDS = {
    CENTER_POINTER: "home",
    CLEAR_SCREEN: "cs",
    PEN_DOWN: "pd",
    PEN_UP: "pu",
    HIDE_POINTER: "hp",
    SHOW_POINTER: "sp",
    FILL_REGION: "fill",
};
