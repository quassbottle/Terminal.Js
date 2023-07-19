import { ConsoleHandler } from "./console.js";

const consoleContainer = document.querySelector(".console");
const consoleInput = consoleContainer.querySelector(".console__input");
const consoleLog = consoleContainer.querySelector(".console__log");
const consoleTypeInput = consoleInput.querySelector(".type-input");

function main() {
    const hostname = window.location.host;
    const username = "user";

    [...document.getElementsByClassName("username")].forEach(value => {
       value.innerHTML = `${username}@${hostname}`;
    });

    const terminal = new ConsoleHandler(hostname, username, consoleLog, consoleTypeInput);

    terminal.writeLine(`Welcome to Terminal
    
    * For a list of available commands type "help".
    
    `)

    window.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const input = terminal.submit();
            e.preventDefault();
        }
    })

    consoleInput.addEventListener("click", e => {
       consoleTypeInput.focus();
    });
}

main();