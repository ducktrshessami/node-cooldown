function cooldown(callback, ms = 0) {
    let ready = true;
    return function (...args) {
        if (ready) {
            ready = false;
            setTimeout(() => ready = true, ms);
            return callback.apply(this, args);
        }
    }
}
