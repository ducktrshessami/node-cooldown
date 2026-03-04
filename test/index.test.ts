import { createHash } from "crypto";
import { describe, expect, it } from "vitest";
import { cooldown, cooldownAsync } from "../dist/index";

describe("cooldown", function () {
    it("starts off cooldown", function () {
        function foo() {
            return true;
        }
        expect(cooldown(foo, 1000)()).toEqual(true);
    });
    it("same return as normal when off cooldown", function () {
        function foo(input = "bar") {
            const hash = createHash("sha256");
            hash.write(input);
            return hash
                .digest()
                .toString("utf8");
        }
        expect(cooldown(foo)()).toEqual(foo());
    });
    it("ensure 'this' integrity", function () {
        const obj = {
            foo: 0,
            bar() {
                return this.foo;
            }
        };
        const other = {
            foo: 1,
            bar: cooldown(obj.bar, 1000)
        };
        const bound = cooldown(obj.bar.bind(obj), 1000);
        expect(other.bar()).toEqual(other.foo);
        expect(bound()).toEqual(obj.foo);
    });
    it("returns undefined while on cooldown", function () {
        const normal = "bar";
        function foo() {
            return normal;
        }
        const foobar = cooldown(foo, 1000);
        expect(foobar()).toEqual(foo());
        expect(foobar()).toEqual(undefined);
    });
    it("ready property tracks cooldown state", function () {
        function foo() {
            return true;
        }
        const bar = cooldown(foo, 1000);
        expect(bar.ready).toEqual(true);
        bar();
        expect(bar.ready).toEqual(false);
    });
    it("comes off cooldown after expected time", async function () {
        const ms = 500;
        function foo() {
            return true;
        }
        const bar = cooldown(foo, ms);
        const start = Date.now();
        bar();
        await new Promise<void>(resolve => {
            let interval = setInterval(() => {
                if (bar()) {
                    resolve();
                    clearInterval(interval);
                }
            }, 1);
        });
        expect(Math.abs(Date.now() - start - ms)).toBeLessThan(50);
    })
});

describe("cooldownAsync", function () {
    it("always async", function () {
        function foo() {
            return true;
        }
        const bar = cooldownAsync(foo, 1000);
        expect(bar()).toBeInstanceOf(Promise);
        expect(bar()).toBeInstanceOf(Promise);
    });
    it("starts off cooldown", async function () {
        async function foo() {
            return true;
        }
        expect(await cooldownAsync(foo, 1000)()).toEqual(true);
    });
    it("same resolution as normal when off cooldown", async function () {
        async function foo(input = "bar") {
            const hash = createHash("sha256");
            hash.write(input);
            return hash
                .digest()
                .toString("utf8");
        }
        expect(await cooldownAsync(foo)()).toEqual(await foo());
    });
    it("ensure 'this' integrity", async function () {
        const obj = {
            foo: 0,
            bar() {
                return this.foo;
            }
        };
        const other = {
            foo: 1,
            bar: cooldownAsync(obj.bar, 1000)
        };
        const bound = cooldownAsync(obj.bar.bind(obj), 1000);
        expect(await other.bar()).toEqual(other.foo);
        expect(await bound()).toEqual(obj.foo);
    });
    it("resolves with undefined while on cooldown", async function () {
        const normal = "bar";
        async function foo() {
            return normal;
        }
        const foobar = cooldownAsync(foo, 1000);
        expect(await foobar()).toEqual(await foo());
        expect(await foobar()).toEqual(undefined);
    });
    it("ready property tracks cooldown state", async function () {
        async function foo() {
            return true;
        }
        const bar = cooldownAsync(foo, 1000);
        expect(bar.ready).toEqual(true);
        await bar();
        expect(bar.ready).toEqual(false);
    });
    it("comes off cooldown after expected time", async function () {
        const ms = 500;
        async function foo() {
            return true;
        }
        const bar = cooldownAsync(foo, ms);
        const start = Date.now();
        await bar();
        await new Promise<void>(resolve => {
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
        expect(Math.abs(Date.now() - start - ms)).toBeLessThan(50);
    })
});
