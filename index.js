function cooldown(callback, ms = 0) {
    let ready = true;
    let wrapped = function (...args) {
        if (ready) {
            ready = false;
            setTimeout(() => ready = true, ms);
            return callback.apply(this, args);
        }
    };
    Object.defineProperty(wrapped, "ready", {
        get: () => ready,
        enumerable: true
    });
    return wrapped;
}

// Always async
function cooldownAsync(callback, ms = 0) {
    let ready = true;
    let wrapped = async function (...args) {
        if (ready) {
            ready = false;
            setTimeout(() => ready = true, ms);
            return callback.apply(this, args);
        }
    };
    Object.defineProperty(wrapped, "ready", {
        get: () => ready,
        enumerable: true
    });
    return wrapped;
}

Object.defineProperties(module.exports, {
    cooldown: {
        value: cooldown,
        enumerable: true
    },
    cooldownAsync: {
        value: cooldownAsync,
        enumerable: true
    }
});
