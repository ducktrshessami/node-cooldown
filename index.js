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

// Always async
function cooldownAsync(callback, ms = 0) {
    let ready = true;
    return async function (...args) {
        if (ready) {
            ready = false;
            setTimeout(() => ready = true, ms);
            return callback.apply(this, args);
        }
    }
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
