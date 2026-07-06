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

describe('Overall Score', () => {
    it('all dimensions high = overall high', () => {
        const s = weightedAvg([
            { val: 90, w: 30 }, { val: 85, w: 30 },
            { val: 80, w: 20 }, { val: 85, w: 20 },
        ]);
        assert.ok(s >= 80, `got ${s}`);
    });

    it('all dimensions low = overall low', () => {
        const s = weightedAvg([
            { val: 10, w: 30 }, { val: 15, w: 30 },
            { val: 20, w: 20 }, { val: 15, w: 20 },
        ]);
        assert.ok(s <= 25, `got ${s}`);
    });

    it('mixed dimensions = moderate overall', () => {
        const s = weightedAvg([
            { val: 90, w: 30 }, { val: 10, w: 30 },
            { val: 80, w: 20 }, { val: 20, w: 20 },
        ]);
        assert.ok(s >= 30 && s <= 70, `got ${s}`);
    });

    it('trend dominant when weight is highest', () => {
        const highTrend = weightedAvg([
            { val: 90, w: 50 }, { val: 50, w: 20 },
            { val: 50, w: 15 }, { val: 50, w: 15 },
        ]);
        const lowTrend = weightedAvg([
            { val: 90, w: 10 }, { val: 50, w: 40 },
            { val: 50, w: 30 }, { val: 50, w: 20 },
        ]);
        assert.ok(highTrend > lowTrend, `highTrend=${highTrend} <= lowTrend=${lowTrend}`);
    });

    it('should handle missing dimension gracefully', () => {
        const s = weightedAvg([
            { val: 90, w: 30 }, { val: 80, w: 30 },
            { val: null, w: 20 }, { val: null, w: 20 },
        ]);
        assert.ok(s > 0, `got ${s}`);
    });

    it('should return null when all dimensions null', () => {
        assert.equal(weightedAvg([{ val: null, w: 30 }, { val: null, w: 30 }]), null);
    });
});
