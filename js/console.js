class ConsoleHandler {
    constructor(consoleContainer) {

    }

    write(string) {

    }

    writeLine(string) {

    }

    clear() {

    }

    handleInput() {

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