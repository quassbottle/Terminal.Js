export class ConsoleHandler {
    fastOutput;
    hostname;
    username;

    #consoleLog;
    #consoleInput;
    #consoleOutputHandler;
    #userInputLog;
    #commandHandler;

    constructor(hostname, username, consoleLog, consoleInput) {
        this.#consoleOutputHandler = new ConsoleOutputHandler(consoleLog);
        this.#consoleInput = consoleInput;
        this.#consoleLog = consoleLog;
        this.#userInputLog = [];
        this.#commandHandler = new ConsoleCommandHandler(this);

        this.hostname = hostname;
        this.username = username;

        this.changeFastOutput(false);
    }

    writeLine(text) {
        this.#consoleOutputHandler.writeLine(text);
    }

    clear() {
        this.#consoleOutputHandler.clear();
    }

    submit() {
        this.#consoleOutputHandler.stopDelayedOutput();

        let newLine = document.createElement("p");
        newLine.innerHTML = `<span class=\"username\">${this.username}@${this.hostname}</span>:~$ `;
        newLine.innerHTML += this.#consoleInput.innerHTML;
        this.#consoleLog.append(newLine);

        let userInput = this.#consoleInput.innerHTML;
        this.#consoleInput.innerHTML = "";

        this.#userInputLog.push(userInput);

        this.#commandHandler.handleInput(userInput);

        return userInput;
    }

    changeFastOutput(value) {
        this.#consoleOutputHandler.fastOutput = value;
        this.fastOutput = value;
    }

    set fastOutput(value) {
        console.log(value);
        this.#consoleOutputHandler.fastOutput = value;
        this.fastOutput = value;
    }

    get fastOutput() {
        return this.fastOutput;
    }

    get output() {
        return this.#consoleOutputHandler;
    }
}

class ConsoleInputHandler {
    consoleInput;
    constructor(consoleInput) {
        this.consoleInput = consoleInput;
    }
    // todo: may get deprecated
}

class ConsoleOutputHandler {
    consoleLog;
    delayedOutputHandler;
    fastOutput;
    constructor(consoleLog) {
        this.delayedOutputHandler = new DelayedOutputHandler();
        this.fastOutput = false;
        this.consoleLog = consoleLog;
    }

    writeLine(string) {
        this.fastOutput ? this.writeLineFast(string) : this.writeLineDelayed(string);
    }

    writeLineDelayed(text, delay = 25) {
        let newLine = document.createElement("p");
        this.consoleLog.append(newLine);
        this.delayedOutputHandler.begin(newLine, text, delay);
    }

    writeLineFast(text) {
        let newLine = document.createElement("p");
        newLine.innerHTML = text;
        this.consoleLog.append(newLine);
    }

    stopDelayedOutput() {
        this.delayedOutputHandler.stop();
    }

    clear() {
        this.consoleLog.innerHTML = "";
    }
}

class DelayedOutputHandler {
    interval;

    bufferedText;
    bufferedElement;

    begin(element, text, speed = 50) {
        this.bufferedText = text;
        this.bufferedElement = element;

        element.textContent = "";
        let currentIndex = 0;

        this.interval = setInterval(function() {
            if (currentIndex < text.length) {
                element.textContent += text[currentIndex++];
            } else {
                clearInterval(this);
            }
        }, speed);
    }

    stop() {
        if (this.interval === undefined) return;
        this.bufferedElement.textContent = this.bufferedText;
        clearInterval(this.interval);
    }
}

class ConsoleCommandHandler {
    consoleHandler;
    #commands;

    constructor(consoleHandler) {
        this.consoleHandler = consoleHandler;

        this.#commands = []; // todo: gonna move it to different file to avoid bloating console logic

        this.#commands.push(new ConsoleCommand("echo", "Echoes text", "{text}", (args) => {
            consoleHandler.writeLine(args);
        }));

        this.#commands.push(new ConsoleCommand("cls", "Clears console", "", () => {
            consoleHandler.clear();
            }, "clear", "clr"));

        this.#commands.push(new ConsoleCommand("output-speed", "Toggle typewriter effect", "",() => {
            this.consoleHandler.changeFastOutput(!this.consoleHandler.fastOutput);
            this.consoleHandler.writeLine(`Changed fast output to "${this.consoleHandler.fastOutput}".`);
            }, "outs"));

        this.#commands.push(new ConsoleCommand("help", "Help command", "",(args) => {
            this.consoleHandler.writeLine(this.#commands.map(command => {
                return `${command.title} - ${command.description}`;
            }).join("\n"));
        }));
    }

    handleInput(input) {
        const cmd = input.split(' ')[0];
        const args = input.substring(5);

        try {
            this.#commands.find(value => {
                if (value.title === cmd) {
                    return value;
                } else if (value.alias.includes(cmd)) {
                    return value;
                }
            }).execute(args);
        } catch (e) {
            this.consoleHandler.writeLine(`Unknown executable nor command is "${input}".`)
        }
    }
}

class ConsoleCommandArguments {
    // todo: add arguments parsing
}

export class ConsoleCommand {
    #title;
    #alias;
    #description;
    #usage;
    #action;
    constructor(title, description, usage, action, ...alias) {
        this.#title = title;
        this.#alias = alias;
        this.#description = description;
        this.#action = action;
    }

    execute(args) {
        this.action(args);
    }

    get title() {
        return this.#title;
    }

    get alias() {
        return this.#alias;
    }

    get description() {
        return this.#description;
    }

    get usage() {
        return this.#usage;
    }

    get action() {
        return this.#action;
    }
}