export class ConsoleHandler {
    fastOutput;
    #consoleLog;
    #consoleInput;
    #consoleOutputHandler;
    #userInputLog;

    constructor(consoleLog, consoleInput) {
        this.#consoleOutputHandler = new ConsoleOutputHandler(consoleLog);
        this.#consoleInput = consoleInput;
        this.#consoleLog = consoleLog;
        this.#userInputLog = [];

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
        newLine.innerHTML = `<span class=\"username\">test@vpive.ru</span>:~$ `;
        newLine.innerHTML += this.#consoleInput.innerHTML;
        this.#consoleLog.append(newLine);

        let userInput = this.#consoleInput.innerHTML;
        this.#consoleInput.innerHTML = "";

        this.#userInputLog.push(userInput);

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

class CommandHandler {

}

export class ConsoleCommand {
    title;
    description;
    action;
    constructor(title, description, action) {
        this.title = title;
        this.description = description;
        this.action = action;
    }

    execute(args) {
        this.action(args);
    }
}

// todo