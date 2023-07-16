import { ConsoleCommand,DelayedOutputHandler } from "./console.js";

const consoleContainer = document.querySelector(".console");
const consoleInput = consoleContainer.querySelector(".console__input");
const consoleLog = consoleContainer.querySelector(".console__log");
const consoleTypeInput = consoleInput.querySelector(".type-input");
const consoleInputTextArea = consoleContainer.querySelector(".input-handler");

const delayedOuputHandler = new DelayedOutputHandler();

function main() { // todo: will refactor everything here later after I find out the best way to do everything. This all was made just for testing purposes
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
/*    let newLine = document.createElement("p");
    newLine.innerHTML = consoleInput.innerHTML;
    //newLine.removeChild(newLine.querySelector(".cursor"));
    consoleLog.append(newLine);
    //consoleInputTextArea.value = "";
    consoleTypeInput.value = "";
    return newLine.querySelector(".type-input").value;*/
    delayedOuputHandler.stop();
    let newLine = document.createElement("p");
    newLine.innerHTML = `<span class=\"username\">test@vpive.ru</span>:~$ `;
    newLine.innerHTML += consoleTypeInput.innerHTML;
    consoleLog.append(newLine);
    let userInput = consoleTypeInput.innerHTML;
    consoleTypeInput.innerHTML = "";
    return userInput;
}

function writeLineFast(text) {
    let newLine = document.createElement("p");
    newLine.innerHTML = text;
    consoleLog.append(newLine);
}

function writeLine(text) {
    let newLine = document.createElement("p");
    consoleLog.append(newLine);
    delayedOuputHandler.begin(newLine, text);
}


main();