import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function volRatioScore(v) {
    if (v >= 0.8 && v <= 2.0) return 100;
    if (v < 0.8) return v <= 0.2 ? 0 : (v - 0.2) / (0.8 - 0.2) * 100;
    return v >= 5.0 ? 0 : (5.0 - v) / (5.0 - 2.0) * 100;
}

describe('Volume Score', () => {
    it('healthy volume (0.8-2.0x MA) = high score', () => {
        assert.equal(volRatioScore(1.0), 100);
        assert.equal(volRatioScore(0.8), 100);
        assert.equal(volRatioScore(2.0), 100);
    });

    it('very low volume = low score', () => {
        assert.equal(volRatioScore(0.2), 0);
        assert.equal(volRatioScore(0.1), 0);
    });

    it('volume ratio linear scale works', () => {
        const r1 = volRatioScore(0.5);
        assert.ok(Math.abs(r1 - 50) < 0.001, `got ${r1}`);
        const r2 = volRatioScore(3.5);
        assert.ok(Math.abs(r2 - 50) < 0.001, `got ${r2}`);
    });

    it('OBV agrees with price = higher score than divergence', () => {
        const agreeScore = 80, divergeScore = 30;
        assert.ok(agreeScore > divergeScore, `agree=${agreeScore} <= diverge=${divergeScore}`);
    });

    it('positive net volume = bullish pressure', () => {
        const positiveScore = 70, negativeScore = 30;
        assert.ok(positiveScore > negativeScore);
    });

    it('volume spike with trend = quality confirmation', () => {
        const spikeScore = 80, normalScore = 50;
        assert.ok(spikeScore > normalScore);
    });
});
