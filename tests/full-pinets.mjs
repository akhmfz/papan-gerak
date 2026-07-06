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

    it('should execute with mock data and produce valid scores', async () => {
        const dataDir = path.join(root, 'tests', '.pinets-tmp', '_data');
        fs.mkdirSync(dataDir, { recursive: true });

        const now = Date.now();

        function generateCandles(count, startPrice, startTime, intervalMs) {
            const candles = [];
            let price = startPrice;
            let t = startTime;
            for (let i = 0; i < count; i++) {
                const change = (Math.random() - 0.48) * 60;
                const o = price;
                const h = o + Math.max(Math.random() * 40, 5);
                const l = o - Math.max(Math.random() * 40, 5);
                const c = o + change;
                const v = Math.floor(50000000 + Math.random() * 100000000);
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

        const start1h = now - 200 * 3600000;
        const end1h = start1h + 199 * 3600000;
        fs.writeFileSync(
            path.join(dataDir, `BBRI-1h-${start1h}-${end1h}.json`),
            JSON.stringify(generateCandles(200, 4500, start1h, 3600000))
        );

        const start1w = now - 12 * 7 * 86400000;
        const end1w = start1w + 11 * 7 * 86400000;
        fs.writeFileSync(
            path.join(dataDir, `BBRI-1w-${start1w}-${end1w}.json`),
            JSON.stringify(generateCandles(12, 4500, start1w, 7 * 86400000))
        );

        fs.writeFileSync(path.join(dataDir, 'api-exchangeInfo.json'), JSON.stringify({
            timezone: 'Asia/Jakarta',
            symbols: [{ symbol: 'BBRI', baseAsset: 'BBRI', quoteAsset: 'IDR',
                filters: [
                    { filterType: 'PRICE_FILTER', minPrice: '1', maxPrice: '100000', tickSize: '1' },
                    { filterType: 'LOT_SIZE', minQty: '100', maxQty: '10000000', stepSize: '100' }
                ]
            }]
        }));

        Provider.Mock.setDataDirectory(path.join(root, 'tests', '.pinets-tmp', '_data'));

        try {
            const pts = new PineTS(Provider.Mock, 'BBRI', '60', 200);
            await pts.ready();
            const context = await pts.run(code, 200);

            const scorePlot = context.plots['Overall Score'];
            assert.ok(scorePlot, 'Overall Score plot exists');
            const validScores = scorePlot.data.filter(v => v && v.value != null);
            assert.ok(validScores.length > 0, 'At least one non-null score');

            // Verify scores in [0, 100] range
            for (const v of validScores) {
                assert.ok(v.value >= 0 && v.value <= 100,
                    `Score ${v.value} in [0, 100]`);
            }

            // Verify scores vary
            const unique = new Set(validScores.map(v => Math.round(v.value)));
            assert.ok(unique.size > 1, 'Scores vary across bars');

            // Check sub-scores exist
            const expectedPlots = ['Overall Score', 'OB Line', 'OS Line', 'Midline'];
            for (const name of expectedPlots) {
                assert.ok(context.plots[name], `Plot '${name}' exists`);
            }
        } finally {
            try { fs.rmSync(path.join(root, 'tests', '.pinets-tmp'), { recursive: true }); } catch { }
        }
    }, { timeout: 60000 });
});
