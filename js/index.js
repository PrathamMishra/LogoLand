import LogoInterpreter from "./compiler/index.js";

// Elements
const container = document.getElementById("container");
const code = document.getElementById("code");
const runBtn = document.getElementById("runBtn");
const error = document.getElementById("error");
const errorBlock = document.getElementById("errorBlock");
const fillingLoader = document.getElementById("fillingLoader");
const hideErr = document.getElementById("hideErr");

// Initialize interpreter
const interpreter = new LogoInterpreter(container);

// Listeners
runBtn.addEventListener("click", () => {
    errorBlock.style.display = "none";
    const text = code.value;
    interpreter.runCommand(text);
});

hideErr.addEventListener("click", () => {
    errorBlock.style.display = "none";
});

// Utils
interpreter.onError(function showError(err) {
    error.innerText = err;
    errorBlock.style.display = "flex";
});

export function showFillingLoader() {
    fillingLoader.style.display = "block";
    runBtn.disabled = true;
}

export function hideFillingLoader() {
    fillingLoader.style.display = "none";
    runBtn.disabled = false;
}
