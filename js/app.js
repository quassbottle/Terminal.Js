import {ConsoleCommand, ConsoleHandler}from "./console.js";

const consoleContainer = document.querySelector(".console");
const consoleInput = consoleContainer.querySelector(".console__input");
const consoleLog = consoleContainer.querySelector(".console__log");
const consoleTypeInput = consoleInput.querySelector(".type-input");
const scanlines = document.getElementsByClassName("scanlines")[0];

function main() {
    const hostname = window.location.host;
    const username = "user";
    const logs = [];
    let logPointer = 0;

    [...document.getElementsByClassName("username")].forEach(value => {
       value.innerHTML = `[${username}@${hostname}]`;
    });

    const terminal = new ConsoleHandler(hostname, username, consoleLog, consoleTypeInput);

    let date;

    if (localStorage["lastLogin"] === undefined) {
        date = new Date();
        localStorage["lastLogin"] = date.toDateString() + " " + date.toLocaleTimeString();
    }

    terminal.writeLine(`Welcome to Terminal.JS! Last login: ${localStorage["lastLogin"]} 
    
    * For a list of available commands type "help".
    * Github repository: https://github.com/quassbottle/Terminal.Js
    
`);

    date = new Date();
    localStorage["lastLogin"] = date.toDateString() + " " + date.toLocaleTimeString();

    terminal.commandHandler.addCommand(new ConsoleCommand("scanlines", "Disable scanlines effect", "", () => {
        scanlines.hidden = !scanlines.hidden;
    }));

    window.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            if (document.activeElement === consoleTypeInput) {
                if (terminal.currentUserInput === "" && terminal.output.delayedOutputQueue.isWriting) terminal.output.stopDelayedOutput();
                else {
                    logs.push(terminal.submit());
                    logPointer = logs.length;
                }
            }
            e.preventDefault();
        }
        if (e.key === "ArrowUp") {
            consoleTypeInput.textContent = logs[--logPointer];
        }
        if (e.key === "ArrowDown") {
            consoleTypeInput.textContent = logs[++logPointer];
        }
    })

    consoleInput.addEventListener("click", e => {
       consoleTypeInput.focus();
    });

    document.querySelector("body").addEventListener("click", () => {
        consoleTypeInput.focus();
    })

    document.querySelector(".scanlines").addEventListener("click", () => {
        consoleTypeInput.focus();
    })
}

main();