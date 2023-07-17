import { ConsoleCommand,ConsoleHandler } from "./console.js";

const consoleContainer = document.querySelector(".console");
const consoleInput = consoleContainer.querySelector(".console__input");
const consoleLog = consoleContainer.querySelector(".console__log");
const consoleTypeInput = consoleInput.querySelector(".type-input");

const console = new ConsoleHandler(consoleLog, consoleTypeInput);

function main() { // todo: will refactor everything here later after I find out the best way to do everything. This all was made just for testing purposes
    const ping = new ConsoleCommand("ping", "returns Pong!", () => {
        console.writeLine("Pong!");
    });
    const echo = new ConsoleCommand("echo", "returns Pong!", (args) => {
        args.length === 0 ? console.writeLine("Empty string has given.") : console.writeLine(args);
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const input = console.submit();
            const cmd = input.split(' ')[0];
            if (cmd === "cls") {
                console.clear();
            } else if (cmd === "echo") {
                echo.execute(input.substring(5, input.length));
            } else if (cmd === "ping") {
                ping.execute();
            } else if (cmd === "output-speed") {
                console.changeFastOutput(!console.fastOutput);
                console.writeLine(`Changed fast output to "${console.fastOutput}".`);
            }
            else if (input.length !== 0) {
                console.writeLine(`Unknown executable nor command is "${input}".`)
            }
            e.preventDefault();
        }
    })
}

main();