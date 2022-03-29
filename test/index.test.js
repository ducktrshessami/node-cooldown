const assert = require("assert");
const crypto = require("crypto");
const { cooldown, cooldownAsync } = require("../");

describe("cooldown", function () {
    it("starts off cooldown", function () {
        function foo() {
            return true;
        }
        assert(cooldown(foo, 1000)());
    });
    it("same return as normal when off cooldown", function () {
        function foo(input = "bar") {
            const hash = crypto.createHash("sha256");
            hash.write(input);
            return hash
                .digest()
                .toString("utf8");
        }
        assert.strictEqual(cooldown(foo)(), foo());
    });
    it("ensure 'this' integrity", function () {
        const obj = {
            foo: 16,
            bar() {
                return this.foo;
            }
        };
        obj.foobar = cooldown(obj.bar, 1000);
        assert.strictEqual(obj.foobar(), obj.bar());
    });
    it("returns undefined while on cooldown", function () {
        const normal = "bar";
        function foo() {
            return normal;
        }
        const foobar = cooldown(foo, 1000);
        assert.strictEqual(foobar(), foo());
        assert.strictEqual(foobar(), undefined);
    });
    it("comes off cooldown after expected time", async function () {
        const ms = 500;
        function foo() {
            return true;
        }
        const bar = cooldown(foo, ms);
        const start = Date.now();
        bar();
        await new Promise(resolve => {
            let interval = setInterval(() => {
                if (bar()) {
                    resolve();
                    clearInterval(interval);
                }
            }, 1);
        });
        assert(Math.abs(Date.now() - start - ms) < 50);
    }).slow(600).timeout(1000);
});

describe("cooldownAsync", function () {
    it("always async", function () {
        function foo() {
            return true;
        }
        const bar = cooldownAsync(foo, 1000);
        assert(bar() instanceof Promise);
        assert(bar() instanceof Promise);
    });
    it("starts off cooldown", async function () {
        async function foo() {
            return true;
        }
        assert(await cooldownAsync(foo, 1000)());
    });
    it("same resolution as normal when off cooldown", async function () {
        async function foo(input = "bar") {
            const hash = crypto.createHash("sha256");
            hash.write(input);
            return hash
                .digest()
                .toString("utf8");
        }
        assert.strictEqual(await cooldownAsync(foo)(), await foo());
    });
    it("ensure 'this' integrity", async function () {
        const obj = {
            foo: 16,
            async bar() {
                return this.foo;
            }
        };
        obj.foobar = cooldownAsync(obj.bar, 1000);
        assert.strictEqual(await obj.foobar(), await obj.bar());
    });
    it("resolves with undefined while on cooldown", async function () {
        const normal = "bar";
        async function foo() {
            return normal;
        }
        const foobar = cooldownAsync(foo, 1000);
        assert.strictEqual(await foobar(), await foo());
        assert.strictEqual(await foobar(), undefined);
    });
    it("comes off cooldown after expected time", async function () {
        const ms = 500;
        async function foo() {
            return true;
        }
        const bar = cooldownAsync(foo, ms);
        const start = Date.now();
        await bar();
        await new Promise(resolve => {
            let interval = setInterval(async () => {
                try {
                    if (await bar()) {
                        resolve();
                        clearInterval(interval);
                    }
                }
                catch {
                    console.error(new Error("What"));
                }
            }, 1);
        });
        assert(Math.abs(Date.now() - start - ms) < 50);
    }).slow(600).timeout(1000);
});
