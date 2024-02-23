class Updater {
    constructor() {
        this.events = []
    }

    on(eventName, listener) {
        if(!this.events[eventName]) {
            this.events[eventName] = []
        }
        this.events[eventName].push(listener)
    }

    off(eventName, listener) {
        if(!this.events[eventName]) {
            return;
        }

        this.events[eventName] = this.events[eventName].filter(fn => fn !== listener)
    }

    emit(eventName, ...args) {
        if(!this.events[eventName]) {
            return;
        }

        this.events[eventName].forEach(listener => listener.apply(null, args))
    }
}

export const updaterEmitter = new Updater();