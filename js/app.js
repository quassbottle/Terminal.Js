import { ConsoleCommand } from "./console.js";

const consoleContainer = document.querySelector(".console");
const consoleInput = consoleContainer.querySelector(".console__input");
const consoleLog = consoleContainer.querySelector(".console__log");
const consoleTypeInput = consoleInput.querySelector(".type-input");
const consoleInputTextArea = consoleContainer.querySelector(".input-handler");

const consoleTypeCursor = document.createElement("b")
consoleTypeCursor.classList.add("cursor")
consoleInput.append(consoleTypeCursor);

function main() { // todo: will refactor everything here later after I find out the best way to do everything. This all was made just for testing purposes
    document.addEventListener("click", () => {
        document.querySelector('.input-handler').focus();
    })

    consoleInput.addEventListener("click", (e) => {
        document.querySelector('.input-handler').focus();
    })

    consoleInputTextArea.addEventListener("input", (e) => {
        consoleTypeInput.textContent = consoleInputTextArea.value;
    })

    const ping = new ConsoleCommand("ping", "returns Pong!", () => {
        writeLine("Pong!");
    });
    const echo = new ConsoleCommand("echo", "returns Pong!", (args) => {
        args.length === 0 ? writeLine("Empty string has given.") : writeLine(args);
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const input = submitLine();
            const cmd = input.split(' ')[0];
            if (cmd === "ping") {
                ping.execute();
            } else if (cmd === "echo") {
                echo.execute(input.substring(5, input.length));
            }
            else if (input.length !== 0) {
                writeLine(`Unknown executable nor command is "${input}".`)
            }
            e.preventDefault();
        }
    })
}

function submitLine() {
    let newLine = document.createElement("p");
    newLine.innerHTML = consoleInput.innerHTML;
    newLine.removeChild(newLine.querySelector(".cursor"));
    consoleLog.append(newLine);
    consoleInputTextArea.value = "";
    consoleTypeInput.textContent = "";
    return newLine.querySelector(".type-input").innerHTML;
}

function writeLine(text) {
    let newLine = document.createElement("p");
    newLine.innerHTML = text;
    consoleLog.append(newLine);
}

main();