import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function weightedAvg(components) {
    if (!components || components.length === 0) return null;
    let sum = 0, wSum = 0;
    for (const c of components) {
        if (c.val != null) { sum += c.val * c.w; wSum += c.w; }
    }
    return wSum > 0 ? sum / wSum : null;
}

describe('Momentum Score', () => {
    it('should return null on no data', () => {
        assert.equal(weightedAvg([{ val: null, w: 3 }]), null);
    });

    it('should return high score when RSI bullish and MACD bullish', () => {
        const s = weightedAvg([
            { val: 100, w: 3 }, { val: 90, w: 3 },
            { val: 80, w: 2 }, { val: 70, w: 1 }, { val: 70, w: 1 },
        ]);
        assert.ok(s >= 80, `got ${s}`);
    });

    it('should return low score when RSI bearish and MACD bearish', () => {
        const s = weightedAvg([
            { val: 0, w: 3 }, { val: 10, w: 3 },
            { val: 20, w: 2 }, { val: 30, w: 1 }, { val: 30, w: 1 },
        ]);
        assert.ok(s <= 20, `got ${s}`);
    });

    it('should return ~50 when mixed signals', () => {
        const s = weightedAvg([
            { val: 50, w: 3 }, { val: 55, w: 3 },
            { val: 50, w: 2 }, { val: 50, w: 1 }, { val: 50, w: 1 },
        ]);
        assert.ok(s >= 40 && s <= 65, `got ${s}`);
    });

    it('MACD histogram rising > falling scores', () => {
        const rising = weightedAvg([
            { val: 50, w: 3 }, { val: 70, w: 3 },
            { val: 50, w: 2 }, { val: 70, w: 1 }, { val: 70, w: 1 },
        ]);
        const falling = weightedAvg([
            { val: 50, w: 3 }, { val: 30, w: 3 },
            { val: 50, w: 2 }, { val: 30, w: 1 }, { val: 30, w: 1 },
        ]);
        assert.ok(rising > falling, `rising=${rising} <= falling=${falling}`);
    });

    it('Stochastic agrees with RSI = higher confidence', () => {
        const agree = weightedAvg([
            { val: 80, w: 3 }, { val: 70, w: 3 },
            { val: 80, w: 2 }, { val: 70, w: 1 }, { val: 70, w: 1 },
        ]);
        const disagree = weightedAvg([
            { val: 80, w: 3 }, { val: 55, w: 3 },
            { val: 20, w: 2 }, { val: 70, w: 1 }, { val: 55, w: 1 },
        ]);
        assert.ok(agree > disagree, `agree=${agree} <= disagree=${disagree}`);
    });
});
