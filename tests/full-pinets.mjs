import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function setup() {
    const pinets = await import('pinets');
    const code = fs.readFileSync(path.join(root, 'src', 'PapanGerak.pine'), 'utf8');
    return { ...pinets, code };
}

describe('Full Script — PineTS Integration', () => {
    let Indicator, PineTS, Provider, code;

    it('should compile the full PapanGerak.pine without syntax error', async () => {
        const m = await setup();
        Indicator = m.Indicator;
        PineTS = m.PineTS;
        Provider = m.Provider;
        code = m.code;

        const indicator = new Indicator({ code, studyName: 'PG Test' });
        assert.ok(indicator, 'Indicator constructor succeeded — Pine v6 compilation OK');
        assert.ok(indicator.source || indicator._prepared !== undefined, 'Indicator has internal state');
    });

    it('should execute with mock data across 7 IDX tickers', async () => {
        function generateCandles(count, startPrice, startTime, intervalMs, opts = {}) {
            const candles = [];
            let price = startPrice;
            let t = startTime;
            const drift = opts.drift ?? 0;
            const volScale = opts.volScale ?? 1;
            const volatility = opts.volatility ?? 60;
            for (let i = 0; i < count; i++) {
                const trend = drift * (i / count) * volatility;
                const noise = (Math.random() - 0.48) * volatility;
                const change = trend + noise;
                const o = price;
                const h = o + Math.max(Math.random() * volatility * 0.7 * volScale, 5);
                const l = o - Math.max(Math.random() * volatility * 0.7 * volScale, 5);
                const c = o + change;
                const baseVol = 20000000 + Math.random() * 50000000;
                const spike = Math.random() < 0.05 ? 3 + Math.random() * 5 : 1;
                const v = Math.floor(baseVol * volScale * spike);
                price = c;
                candles.push({
                    openTime: t, open: Math.round(o * 100) / 100,
                    high: Math.round(h * 100) / 100, low: Math.round(l * 100) / 100,
                    close: Math.round(c * 100) / 100, volume: v,
                    closeTime: t + Math.floor(intervalMs * 0.999)
                });
                t += intervalMs;
            }
            return candles;
        }

        const TICKERS = [
            { symbol: 'BBRI',  price: 4500,  drift: 0.08, volScale: 2.0, volatility: 50,  desc: 'large cap bullish high vol' },
            { symbol: 'BBCA',  price: 9800,  drift: 0.10, volScale: 1.8, volatility: 40,  desc: 'large cap strong uptrend' },
            { symbol: 'ASII',  price: 5200,  drift: -0.05, volScale: 1.5, volatility: 70,  desc: 'cyclical bearish moderate vol' },
            { symbol: 'TLKM',  price: 3800,  drift: 0.02, volScale: 1.2, volatility: 35,  desc: 'defensive stable low vol' },
            { symbol: 'UNVR',  price: 3200,  drift: 0,    volScale: 1.0, volatility: 30,  desc: 'consumer ranging sideways' },
            { symbol: 'GOTO',  price: 80,    drift: -0.15, volScale: 3.0, volatility: 120, desc: 'tech high vol high vola' },
            { symbol: 'ADRO',  price: 2600,  drift: 0.04, volScale: 1.6, volatility: 90,  desc: 'energy cyclical moderate vol' },
        ];

        const now = Date.now();
        const dataDir = path.join(root, 'tests', '.pinets-tmp', '_data');
        fs.mkdirSync(dataDir, { recursive: true });

        const start1h = now - 200 * 3600000;
        const end1h = start1h + 199 * 3600000;
        const start1w = now - 52 * 7 * 86400000;
        const end1w = start1w + 51 * 7 * 86400000;

        for (const t of TICKERS) {
            fs.writeFileSync(
                path.join(dataDir, `${t.symbol}-1h-${start1h}-${end1h}.json`),
                JSON.stringify(generateCandles(200, t.price, start1h, 3600000, t))
            );
            fs.writeFileSync(
                path.join(dataDir, `${t.symbol}-1w-${start1w}-${end1w}.json`),
                JSON.stringify(generateCandles(52, t.price * 0.95, start1w, 7 * 86400000, { ...t, volatility: t.volatility * 1.5 }))
            );
        }

        fs.writeFileSync(path.join(dataDir, 'api-exchangeInfo.json'), JSON.stringify({
            timezone: 'Asia/Jakarta',
            symbols: TICKERS.map(t => ({
                symbol: t.symbol, baseAsset: t.symbol, quoteAsset: 'IDR',
                filters: [
                    { filterType: 'PRICE_FILTER', minPrice: '1', maxPrice: '100000', tickSize: t.price < 100 ? '0.01' : '1' },
                    { filterType: 'LOT_SIZE', minQty: '100', maxQty: '10000000', stepSize: '100' }
                ]
            }))
        }));

        Provider.Mock.setDataDirectory(dataDir);

        try {
            for (const t of TICKERS) {
                const pts = new PineTS(Provider.Mock, t.symbol, '60', 200);
                await pts.ready();
                const context = await pts.run(code, 200);

                const scorePlot = context.plots['Overall Score'];
                assert.ok(scorePlot, `${t.symbol}: Overall Score plot exists`);
                const validScores = scorePlot.data.filter(v => v && v.value != null);
                assert.ok(validScores.length > 0, `${t.symbol}: At least one non-null score`);

                for (const v of validScores) {
                    assert.ok(v.value >= 0 && v.value <= 100,
                        `${t.symbol}: Score ${v.value} in [0, 100]`);
                }

                const unique = new Set(validScores.map(v => Math.round(v.value)));
                assert.ok(unique.size > 1, `${t.symbol}: Scores vary across bars`);

                const expectedPlots = ['Overall Score', 'OB Line', 'OS Line', 'Midline'];
                for (const name of expectedPlots) {
                    assert.ok(context.plots[name], `${t.symbol}: Plot '${name}' exists`);
                }
            }
        } finally {
            try { fs.rmSync(path.join(root, 'tests', '.pinets-tmp'), { recursive: true }); } catch { }
        }
    }, { timeout: 120000 });
});
