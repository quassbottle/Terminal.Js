export class ConsoleHandler {
    fastOutput;
    hostname;
    username;

    #consoleLog;
    #consoleInput;
    #outputHandler;
    #userInputLog;
    #commandHandler;

    constructor(hostname, username, consoleLog, consoleInput) {
        this.#outputHandler = new ConsoleOutputHandler(consoleLog);
        this.#consoleInput = consoleInput;
        this.#consoleLog = consoleLog;
        this.#userInputLog = [];
        this.#commandHandler = new ConsoleCommandHandler(this);

        this.hostname = hostname;
        this.username = username;

        this.changeFastOutput(false);
    }

    writeLine(text, fast = false) {
        this.#outputHandler.writeLine(text, fast);
    }

    clear() {
        this.#outputHandler.clear();
    }

    submit() {
        this.#outputHandler.stopDelayedOutput();

        let newLine = document.createElement("p");
        newLine.innerHTML = `<span class=\"username\">[${this.username}@${this.hostname}]</span>: `;
        newLine.innerHTML += this.#consoleInput.innerHTML;
        this.#consoleLog.append(newLine);

        let userInput = this.#consoleInput.textContent;
        this.#consoleInput.innerHTML = "";

        this.#userInputLog.push(userInput);

        this.#commandHandler.handleInput(userInput);

        return userInput;
    }

    changeFastOutput(value) {
        this.#outputHandler.fastOutput = value;
        this.fastOutput = value;
    }

    set fastOutput(value) {
        this.#outputHandler.fastOutput = value;
        this.fastOutput = value;
    }

    get currentUserInput() {
        return this.#consoleInput.textContent;
    }

    get fastOutput() {
        return this.fastOutput;
    }

    get output() {
        return this.#outputHandler;
    }

    get commandHandler() {
        return this.#commandHandler;
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

    writeLine(string, fast = false) {
        this.fastOutput || fast ? this.writeLineFast(string) : this.writeLineDelayed(string);
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

    #isWriting;

    begin(element, text, speed = 50) {
        this.bufferedText = text;
        this.bufferedElement = element;

        element.textContent = "";
        let currentIndex = 0;

        this.#isWriting = true;

        this.interval = setInterval(() => {
            if (currentIndex < text.length) {
                element.textContent += text[currentIndex++];
            } else {
                clearInterval(this.interval);
                this.#isWriting = false;
            }
        }, speed);
    }

    stop() {
        if (this.interval === undefined) return;
        this.bufferedElement.textContent = this.bufferedText;
        clearInterval(this.interval);
        this.#isWriting = false;
    }

    get isWriting() {
        return this.#isWriting;
    }
}

class ConsoleCommandHandler {
    consoleHandler;
    #commands;

    constructor(consoleHandler) {
        this.consoleHandler = consoleHandler;

        this.#commands = []; // todo: gonna move it to different file to avoid bloating console logic

        this.#commands.push(new ConsoleCommand("echo", "Echoes text", "text", (args) => {
            consoleHandler.writeLine(args);
        }));

        this.#commands.push(new ConsoleCommand("eval", "Eval input", "code", (args) => {
            eval(args);
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
                return `- ${command.title} ${command.usage === undefined || command.usage === "" ? "" : "{" + command.usage + "}"} - ${command.description} ${command.alias === undefined || command.alias.length === 0 ? "" : "(alias: " + command.alias.join(", ") + ")"}`;
            }).join("\n"));
        }));
    }

    addCommand(command) {
        if (command.constructor.name === "ConsoleCommand") this.#commands.push(command);
        else throw TypeError("Only ConsoleCommand is allowed to import");
    }

    handleInput(input) {
        const cmd = input.split(' ')[0];
        const args = input.substring(5);

        try {
            if (input === "") return;
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
        this.#usage = usage;
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