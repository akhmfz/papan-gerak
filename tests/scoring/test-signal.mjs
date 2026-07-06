import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

function pullbackTrigger(trendScore, close, emaFast, atrValue, rsiValue, rsiDirection) {
    if (trendScore == null || trendScore < 65) return false;
    if (close == null || emaFast == null || atrValue == null) return false;
    if (rsiValue == null || rsiDirection == null) return false;
    const nearEma = Math.abs(close - emaFast) <= atrValue * 1.5;
    const rsiOk = rsiValue <= 50 && rsiDirection === 1;
    return nearEma && rsiOk;
}

function breakoutTrigger(volumeScore, close, recentHigh, recentLow) {
    if (volumeScore == null || volumeScore < 60) return false;
    if (close == null) return false;
    if (close >= recentHigh || close <= recentLow) return true;
    return false;
}

function calcAtraposalSl(entryPrice, atrCapture, slAtrMult, signalDirection) {
    if (entryPrice == null || atrCapture == null) return null;
    return entryPrice - atrCapture * slAtrMult * signalDirection;
}

function calcTargetPrice(entryPrice, slPrice, targetR) {
    if (entryPrice == null || slPrice == null) return null;
    return entryPrice + Math.abs(entryPrice - slPrice) * targetR * (entryPrice > slPrice ? 1 : -1);
}

function calcRiskPct(entryPrice, slPrice) {
    if (entryPrice == null || slPrice == null || entryPrice === 0) return null;
    return Math.abs(entryPrice - slPrice) / entryPrice * 100;
}

function calcSuggestedLots(accountBalance, riskPct, riskAmount) {
    if (accountBalance == null || riskPct == null || riskAmount == null || riskAmount <= 0) return null;
    const riskRp = accountBalance * riskPct / 100;
    const shares = riskRp / riskAmount;
    return Math.max(1, Math.floor(shares / 100));
}

function calcRiskRpDisplay(accountBalance, riskPct) {
    if (accountBalance == null || riskPct == null) return '';
    const riskRp = accountBalance * riskPct / 100;
    const riskRpK = Math.round(riskRp / 1000);
    if (riskRpK >= 1000) return 'Rp' + Math.round(riskRpK / 1000) + 'jt';
    return 'Rp' + riskRpK + 'rb';
}

function mtfConflict(mtfTrendScore, overallScore) {
    if (mtfTrendScore == null || overallScore == null) return false;
    return (mtfTrendScore >= 50 && overallScore < 40) ||
           (mtfTrendScore < 50 && overallScore >= 70);
}

function signalDirection(mode, currentZone, prevZone, close, recentHigh) {
    if (mode === 'Composite Score') {
        if (currentZone > prevZone) return 1;
        return -1;
    }
    if (mode === 'Pullback') return 1;
    if (mode === 'Breakout') {
        return close >= recentHigh ? 1 : -1;
    }
    return 0;
}

function zoneFromScore(score) {
    if (score == null || Number.isNaN(score)) return -1;
    if (score >= 70) return 2;
    if (score >= 40) return 1;
    return 0;
}

function currentZoneLabel(zone) {
    if (zone === -1) return 'N/A';
    if (zone === 2) return 'Bullish';
    if (zone === 1) return 'Neutral';
    return 'Bearish';
}

describe('Signal Engine — Entry Triggers', () => {
    it('Pullback: should trigger when trend strong, near EMA, RSI recovering', () => {
        const r = pullbackTrigger(75, 1500, 1490, 15, 45, 1);
        assert.equal(r, true);
    });

    it('Pullback: should not trigger when trendScore < 65', () => {
        const r = pullbackTrigger(50, 1500, 1490, 15, 45, 1);
        assert.equal(r, false);
    });

    it('Pullback: should not trigger when RSI > 50', () => {
        const r = pullbackTrigger(75, 1500, 1490, 15, 55, 1);
        assert.equal(r, false);
    });

    it('Pullback: should not trigger when RSI still falling', () => {
        const r = pullbackTrigger(75, 1500, 1490, 15, 45, -1);
        assert.equal(r, false);
    });

    it('Pullback: should not trigger when price far from EMA', () => {
        const r = pullbackTrigger(75, 1600, 1490, 15, 45, 1);
        assert.equal(r, false);
    });

    it('Pullback: return false for null inputs', () => {
        assert.equal(pullbackTrigger(null, 1500, 1490, 15, 45, 1), false);
    });

    it('Breakout: should trigger on bullish break above recent high', () => {
        const r = breakoutTrigger(75, 1600, 1580, 1500);
        assert.equal(r, true);
    });

    it('Breakout: should trigger on bearish break below recent low', () => {
        const r = breakoutTrigger(75, 1480, 1580, 1500);
        assert.equal(r, true);
    });

    it('Breakout: should not trigger when volume score < 60', () => {
        const r = breakoutTrigger(45, 1600, 1580, 1500);
        assert.equal(r, false);
    });

    it('Breakout: should not trigger when inside range', () => {
        const r = breakoutTrigger(75, 1550, 1580, 1500);
        assert.equal(r, false);
    });
});

describe('Risk Levels — SL & Target', () => {
    it('Bullish SL: slPrice = entry - ATR * mult', () => {
        const sl = calcAtraposalSl(1500, 20, 1.5, 1);
        assert.equal(sl, 1470);
    });

    it('Bearish SL: slPrice = entry + ATR * mult', () => {
        const sl = calcAtraposalSl(1500, 20, 1.5, -1);
        assert.equal(sl, 1530);
    });

    it('Target: 2R above entry for bullish', () => {
        const target = calcTargetPrice(1500, 1470, 2);
        assert.equal(target, 1560);
    });

    it('Target: 2R below entry for bearish', () => {
        const target = calcTargetPrice(1500, 1530, 2);
        assert.equal(target, 1440);
    });

    it('SL risk percentage: bullish', () => {
        const pct = calcRiskPct(1500, 1470);
        assert.ok(Math.abs(pct - 2.0) < 0.001, `got ${pct}`);
    });

    it('SL risk percentage: bearish', () => {
        const pct = calcRiskPct(1500, 1530);
        assert.ok(Math.abs(pct - 2.0) < 0.001, `got ${pct}`);
    });

    it('SL: return null for null entryPrice', () => {
        assert.equal(calcAtraposalSl(null, 20, 1.5, 1), null);
    });
});

describe('Position Sizing', () => {
    it('suggested lots: Rp50jt, 1% risk, SL=30', () => {
        const lots = calcSuggestedLots(50000000, 1.0, 30);
        assert.equal(lots, 166);
    });

    it('minimum 1 lot even if risk is small', () => {
        const lots = calcSuggestedLots(1000000, 1.0, 50000);
        assert.equal(lots, 1);
    });

    it('risk Rp display: 500rb for 50jt at 1%', () => {
        const d = calcRiskRpDisplay(50000000, 1.0);
        assert.equal(d, 'Rp500rb');
    });

    it('risk Rp display: 5jt for 500jt at 1%', () => {
        const d = calcRiskRpDisplay(500000000, 1.0);
        assert.equal(d, 'Rp5jt');
    });

    it('return null for invalid risk amount', () => {
        assert.equal(calcSuggestedLots(50000000, 1.0, -1), null);
    });
});

describe('MTF Conflict Detection', () => {
    it('no conflict when MTF bullish and daily bullish', () => {
        assert.equal(mtfConflict(65, 75), false);
    });

    it('no conflict when MTF bearish and daily bearish', () => {
        assert.equal(mtfConflict(35, 30), false);
    });

    it('conflict: MTF bullish but daily bearish', () => {
        assert.equal(mtfConflict(65, 30), true);
    });

    it('conflict: MTF bearish but daily bullish', () => {
        assert.equal(mtfConflict(35, 75), true);
    });

    it('no conflict when daily is neutral', () => {
        assert.equal(mtfConflict(65, 50), false);
        assert.equal(mtfConflict(35, 50), false);
    });

    it('return false for null inputs', () => {
        assert.equal(mtfConflict(null, 75), false);
    });
});

describe('Signal Direction & Zone', () => {
    it('Composite: bullish when zone improves', () => {
        const dir = signalDirection('Composite Score', 1, 0, 1500, 1600);
        assert.equal(dir, 1);
    });

    it('Composite: bearish when zone worsens', () => {
        const dir = signalDirection('Composite Score', 1, 2, 1500, 1600);
        assert.equal(dir, -1);
    });

    it('Pullback: always long', () => {
        const dir = signalDirection('Pullback', 2, 1, 1500, 1600);
        assert.equal(dir, 1);
    });

    it('Breakout: long when price breaks high', () => {
        const dir = signalDirection('Breakout', 2, 1, 1600, 1580);
        assert.equal(dir, 1);
    });

    it('Breakout: short when price breaks low', () => {
        const dir = signalDirection('Breakout', 2, 1, 1480, 1580);
        assert.equal(dir, -1);
    });

    it('zoneFromScore: 2 for >= 70', () => {
        assert.equal(zoneFromScore(85), 2);
        assert.equal(zoneFromScore(70), 2);
    });

    it('zoneFromScore: 1 for 40-70', () => {
        assert.equal(zoneFromScore(55), 1);
        assert.equal(zoneFromScore(40), 1);
    });

    it('zoneFromScore: 0 for < 40', () => {
        assert.equal(zoneFromScore(30), 0);
        assert.equal(zoneFromScore(0), 0);
    });

    it('zoneFromScore: -1 for null', () => {
        assert.equal(zoneFromScore(null), -1);
    });
});
