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

describe('Trend Score', () => {
    it('should return null when no components available', () => {
        assert.equal(weightedAvg([]), null);
        assert.equal(weightedAvg([{ val: null, w: 3 }]), null);
    });

    it('should return weighted average for available components', () => {
        const s = weightedAvg([
            { val: 100, w: 3 }, { val: 100, w: 2 },
            { val: 80, w: 2 }, { val: 100, w: 2 }, { val: 100, w: 1 },
        ]);
        assert.equal(s, 96);
    });

    it('should handle missing components gracefully', () => {
        const s = weightedAvg([{ val: null, w: 3 }, { val: 100, w: 2 }]);
        assert.equal(s, 100);
    });

    it('should return >90 when all trend indicators bullish', () => {
        const s = weightedAvg([
            { val: 100, w: 3 }, { val: 100, w: 2 },
            { val: 80, w: 2 }, { val: 100, w: 2 }, { val: 100, w: 1 },
        ]);
        assert.ok(s >= 90, `got ${s}`);
    });

    it('EMA position maps -1..2 to 0..100', () => {
        const emaScore = (pos) => (pos + 1) / 3 * 100;
        assert.equal(emaScore(2), 100);
        assert.equal(emaScore(1), 66.66666666666666);
        assert.equal(emaScore(0), 33.33333333333333);
        assert.equal(emaScore(-1), 0);
    });

    it('ADX strength: strong > weak score', () => {
        const strong = weightedAvg([{ val: 80, w: 2 }, { val: 100, w: 8 }]);
        const weak = weightedAvg([{ val: 50, w: 2 }, { val: 100, w: 8 }]);
        assert.ok(strong > weak, `strong=${strong} <= weak=${weak}`);
    });
});
