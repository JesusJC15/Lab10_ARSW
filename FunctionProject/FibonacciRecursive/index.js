var bigInt = require("big-integer");

const cache = {
    0: bigInt.zero,
    1: bigInt.one
};

module.exports = async function (context, req) {
    context.log('FibonacciRecursive HTTP trigger function processed a request.');

    const bodyN = req && req.body && (req.body.nth || req.body.n);
    const queryN = req && req.query && (req.query.n || req.query.nth);
    const raw = bodyN !== undefined ? bodyN : queryN;
    const n = parseInt(raw, 10);

    if (isNaN(n) || n < 0) {
        context.res = {
            status: 400,
            body: { error: 'Invalid input: provide a non-negative integer as `nth` in body or `n` query param.' }
        };
        return;
    }

    const start = Date.now();
    const wasCachedBefore = cache[n] !== undefined;

    function fib(k) {
        if (cache[k] !== undefined) return cache[k];
        const val = fib(k - 1).add(fib(k - 2));
        cache[k] = val;
        return val;
    }

    const result = fib(n);
    const timeMs = Date.now() - start;

    context.res = {
        body: {
            nth: n,
            result: result.toString(),
            timeMs: timeMs,
            wasCachedBefore: wasCachedBefore
        }
    };
}
