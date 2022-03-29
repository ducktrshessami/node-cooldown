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
