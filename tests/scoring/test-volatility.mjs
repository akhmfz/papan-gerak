import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function bbWidthScore(v) {
    if (v >= 0.8 && v <= 1.2) return 100;
    if (v < 0.8) return v <= 0.3 ? 0 : (v - 0.3) / (0.8 - 0.3) * 100;
    return v >= 3.0 ? 0 : (3.0 - v) / (3.0 - 1.2) * 100;
}

function chopScore(chopVal) {
    return 100 - Math.min(100, chopVal);
}

function f_choppiness(atrSum, range_, length) {
    if (range_ === 0) return 100.0;
    return Math.log(atrSum / range_) / Math.log(length) * 100;
}

function atrScore(v) {
    if (v >= 1.0 && v <= 3.0) return 100;
    if (v < 1.0) return v <= 0.5 ? 0 : (v - 0.5) / (1.0 - 0.5) * 100;
    return v >= 10.0 ? 0 : (10.0 - v) / (10.0 - 3.0) * 100;
}

function bbPosScore(pos) {
    return 100 - Math.abs(pos - 50) * 2;
}

describe('Volatility Score', () => {
    it('moderate BB width = high score', () => {
        assert.equal(bbWidthScore(1.0), 100);
        assert.equal(bbWidthScore(0.8), 100);
        assert.equal(bbWidthScore(1.2), 100);
    });

    it('extreme BB width (squeeze) = 0', () => {
        assert.equal(bbWidthScore(0.3), 0);
        assert.equal(bbWidthScore(3.0), 0);
    });

    it('BB width linear scale: midpoints', () => {
        const r1 = bbWidthScore(0.55);
        assert.ok(Math.abs(r1 - 50) < 0.001, `got ${r1}`);
        const r2 = bbWidthScore(2.1);
        assert.ok(Math.abs(r2 - 50) < 0.001, `got ${r2}`);
    });

    it('f_choppiness: trending market (low atrSum/range) = low value', () => {
        const val = f_choppiness(2, 10, 14);
        assert.ok(val < 40, `trending chop=${val}, expected <40`);
        const downstream = chopScore(val);
        assert.ok(downstream > 60, `trending score=${downstream}, expected >60`);
    });

    it('f_choppiness: ranging market (high atrSum/range) = high value', () => {
        const val = f_choppiness(12, 2, 14);
        assert.ok(val > 60, `ranging chop=${val}, expected >60`);
        const downstream = chopScore(val);
        assert.ok(downstream < 40, `ranging score=${downstream}, expected <40`);
    });

    it('f_choppiness: extreme trending (atrSum=range) = 0', () => {
        const val = f_choppiness(1, 1, 14);
        assert.equal(val, 0);
        assert.equal(chopScore(val), 100);
    });

    it('f_choppiness: handles zero range', () => {
        assert.equal(f_choppiness(5, 0, 14), 100);
    });

    it('low choppiness (trending) = high score', () => {
        assert.equal(chopScore(0), 100);
        assert.ok(chopScore(25) > 70, `got ${chopScore(25)}`);
    });

    it('high choppiness (ranging) = low score', () => {
        assert.equal(chopScore(100), 0);
        assert.ok(chopScore(75) < 30, `got ${chopScore(75)}`);
    });

    it('moderate ATR% = ideal', () => {
        assert.equal(atrScore(2.0), 100);
        assert.equal(atrScore(1.0), 100);
        assert.equal(atrScore(3.0), 100);
        assert.equal(atrScore(10.0), 0);
        assert.equal(atrScore(0.5), 0);
    });

    it('price near BB middle better than at bands', () => {
        assert.equal(bbPosScore(50), 100);
        assert.ok(bbPosScore(60) < bbPosScore(55));
        assert.ok(bbPosScore(0) < bbPosScore(25));
    });
});
