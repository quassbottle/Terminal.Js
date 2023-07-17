import { ConsoleHandler } from "./console.js";

const consoleContainer = document.querySelector(".console");
const consoleInput = consoleContainer.querySelector(".console__input");
const consoleLog = consoleContainer.querySelector(".console__log");
const consoleTypeInput = consoleInput.querySelector(".type-input");

function main() {
    const console = new ConsoleHandler(consoleLog, consoleTypeInput);

    window.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const input = console.submit();
            e.preventDefault();
        }
    })
}

main();