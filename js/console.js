class ConsoleHandler {
    delayedOutputHandler;
    constructor(consoleContainer) {

    }

    writeLine(string) {

    }

    writeLineDelayed(string) {

    }

    clear() {

    }

    handleInput() {

    }
}

export class DelayedOutputHandler {
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