import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function f_scoreHigher(val, min, max) {
    if (val == null || Number.isNaN(val)) return null;
    return Math.max(0, Math.min(100, (val - min) / (max - min) * 100));
}

function f_scoreLower(val, min, max) {
    if (val == null || Number.isNaN(val)) return null;
    return Math.max(0, Math.min(100, (max - val) / (max - min) * 100));
}

function f_scoreRange(val, min, max, idealLow, idealHigh) {
    if (val == null || Number.isNaN(val)) return null;
    if (val >= idealLow && val <= idealHigh) return 100.0;
    if (val < idealLow) {
        if (val <= min) return 0.0;
        return (val - min) / (idealLow - min) * 100;
    }
    if (val >= max) return 0.0;
    return (max - val) / (max - idealHigh) * 100;
}

function f_colorScore(score) {
    if (score == null || Number.isNaN(score)) return 'gray';
    if (score >= 70) return 'green';
    if (score >= 40) return 'yellow';
    return 'red';
}

function f_signalText(score) {
    if (score == null || Number.isNaN(score)) return 'N/A';
    if (score >= 70) return 'BULLISH';
    if (score >= 40) return 'NEUTRAL';
    return 'BEARISH';
}

describe('Utility Functions', () => {
    it('f_scoreHigher: should return 100 when val >= max', () => {
        assert.equal(f_scoreHigher(100, 0, 100), 100);
        assert.equal(f_scoreHigher(150, 0, 100), 100);
        assert.equal(f_scoreHigher(0, -50, 0), 100);
    });

    it('f_scoreHigher: should return 0 when val <= min', () => {
        assert.equal(f_scoreHigher(0, 0, 100), 0);
        assert.equal(f_scoreHigher(-10, 0, 100), 0);
    });

    it('f_scoreHigher: should return 50 when val is midpoint', () => {
        assert.equal(f_scoreHigher(50, 0, 100), 50);
        assert.equal(f_scoreHigher(25, 0, 50), 50);
    });

    it('f_scoreLower: should return 100 when val <= min', () => {
        assert.equal(f_scoreLower(0, 0, 100), 100);
        assert.equal(f_scoreLower(-10, 0, 100), 100);
    });

    it('f_scoreLower: should return 0 when val >= max', () => {
        assert.equal(f_scoreLower(100, 0, 100), 0);
        assert.equal(f_scoreLower(150, 0, 100), 0);
    });

    it('f_scoreLower: should return 50 when val is midpoint', () => {
        assert.equal(f_scoreLower(50, 0, 100), 50);
    });

    it('f_scoreRange: should return 100 when val in ideal range', () => {
        assert.equal(f_scoreRange(1.0, 0.3, 3.0, 0.8, 1.2), 100);
        assert.equal(f_scoreRange(0.8, 0.3, 3.0, 0.8, 1.2), 100);
        assert.equal(f_scoreRange(1.2, 0.3, 3.0, 0.8, 1.2), 100);
    });

    it('f_scoreRange: should return 0 at or beyond min/max', () => {
        assert.equal(f_scoreRange(0.3, 0.3, 3.0, 0.8, 1.2), 0);
        assert.equal(f_scoreRange(0.2, 0.3, 3.0, 0.8, 1.2), 0);
        assert.equal(f_scoreRange(3.0, 0.3, 3.0, 0.8, 1.2), 0);
        assert.equal(f_scoreRange(5.0, 0.3, 3.0, 0.8, 1.2), 0);
    });

    it('f_scoreRange: should scale linearly between min and idealLow', () => {
        const result = f_scoreRange(0.55, 0.3, 3.0, 0.8, 1.2);
        assert.ok(Math.abs(result - 50) < 0.001, `got ${result}`);
    });

    it('f_scoreRange: should scale linearly between idealHigh and max', () => {
        const result = f_scoreRange(2.1, 0.3, 3.0, 0.8, 1.2);
        assert.ok(Math.abs(result - 50) < 0.001, `got ${result}`);
    });

    it('f_colorScore: should return green for score >= 70', () => {
        assert.equal(f_colorScore(70), 'green');
        assert.equal(f_colorScore(100), 'green');
    });

    it('f_colorScore: should return yellow for 40-70', () => {
        assert.equal(f_colorScore(40), 'yellow');
        assert.equal(f_colorScore(55), 'yellow');
        assert.equal(f_colorScore(69), 'yellow');
    });

    it('f_colorScore: should return red for < 40', () => {
        assert.equal(f_colorScore(39), 'red');
        assert.equal(f_colorScore(0), 'red');
    });

    it('f_signalText: should return BULLISH for score >= 70', () => {
        assert.equal(f_signalText(70), 'BULLISH');
        assert.equal(f_signalText(100), 'BULLISH');
    });

    it('f_signalText: should return NEUTRAL for 40-70', () => {
        assert.equal(f_signalText(40), 'NEUTRAL');
        assert.equal(f_signalText(55), 'NEUTRAL');
    });

    it('f_signalText: should return BEARISH for < 40', () => {
        assert.equal(f_signalText(39), 'BEARISH');
        assert.equal(f_signalText(0), 'BEARISH');
    });
});
