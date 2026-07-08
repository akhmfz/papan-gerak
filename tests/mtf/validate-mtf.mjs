#!/usr/bin/env node
// validate-mtf.mjs — MTF Alignment Score formula validation
// The MTF formula is purely mathematical (no TA/request.security).
// Expected values are pre-computed to match the Pine Script implementation.
//
// Usage:
//   node validate-mtf.mjs                     # run validation
//   node validate-mtf.mjs --update-golden     # update golden snapshots
//   node validate-mtf.mjs --json              # machine-readable output

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCENARIOS_FILE = resolve(__dirname, 'scenarios.json');
const GOLDEN_FILE = resolve(__dirname, 'golden/scenarios.json');

const args = process.argv.slice(2);
const UPDATE_GOLDEN = args.includes('--update-golden');
const JSON_OUTPUT = args.includes('--json');

function fail(msg) { console.error('FAIL: ' + msg); process.exit(1); }

// --- MTF Alignment Formula (matches Pine Script f_mtfAlignmentScore) ---
function computeMTF(inputs, params = {}) {
    const p = {
        mtfPrimaryWeight: 0.50,
        mtfSecondaryWeight: 0.35,
        mtfTertiaryWeight: 0.15,
        mtfAlpha: 0.70,
        mtfMaxPenalty: 0.25,
        mtfDirectionHysteresis: 10.0,
        ...params,
    };

    // Directional scores
    const tf1Dir = inputs.mtfTf1Trend * 0.55 + inputs.mtfTf1Mom * 0.45;
    const tf2Dir = inputs.mtfTf2Trend * 0.55 + inputs.mtfTf2Mom * 0.45;
    const tf3Dir = inputs.mtfTf3Trend * 0.55 + inputs.mtfTf3Mom * 0.45;

    // Context scores
    const tf1Ctx = inputs.mtfTf1Vol * 0.55 + inputs.mtfTf1Volm * 0.45;
    const tf2Ctx = inputs.mtfTf2Vol * 0.55 + inputs.mtfTf2Volm * 0.45;
    const tf3Ctx = inputs.mtfTf3Vol * 0.55 + inputs.mtfTf3Volm * 0.45;

    if (isNaN(tf1Dir) || isNaN(tf2Dir)) return null;

    const totalW = p.mtfPrimaryWeight + p.mtfSecondaryWeight + p.mtfTertiaryWeight;
    const normW1 = totalW > 0 ? p.mtfPrimaryWeight / totalW : 0.50;
    const normW2 = totalW > 0 ? p.mtfSecondaryWeight / totalW : 0.35;
    const normW3 = totalW > 0 ? p.mtfTertiaryWeight / totalW : 0.15;

    const mtfDirRaw = tf1Dir * normW1 + tf2Dir * normW2 + tf3Dir * normW3;
    const mtfCtxRaw = tf1Ctx * normW1 + tf2Ctx * normW2 + tf3Ctx * normW3;

    const clamp = (v) => Math.max(0, Math.min(1, v));
    const bullConf = (s) => clamp((s - 50) / 20);
    const bearConf = (s) => clamp((50 - s) / 20);

    const tf1Bull = bullConf(tf1Dir);
    const tf2Bull = bullConf(tf2Dir);
    const tf3Bull = bullConf(tf3Dir);
    const tf1Bear = bearConf(tf1Dir);
    const tf2Bear = bearConf(tf2Dir);
    const tf3Bear = bearConf(tf3Dir);

    const weightedBull = tf1Bull * normW1 + tf2Bull * normW2 + tf3Bull * normW3;
    const weightedBear = tf1Bear * normW1 + tf2Bear * normW2 + tf3Bear * normW3;

    const hysteresis = p.mtfDirectionHysteresis / 100;
    let direction = 0;
    if (weightedBull > weightedBear + hysteresis) direction = 1;
    else if (weightedBear > weightedBull + hysteresis) direction = -1;

    const maxDiv = Math.max(
        Math.abs(tf1Dir - tf2Dir),
        Math.abs(tf1Dir - tf3Dir),
        Math.abs(tf2Dir - tf3Dir)
    );
    const penalty = (maxDiv / 100) * p.mtfMaxPenalty;

    const conflictScore = mtfDirRaw * (1 - penalty);
    const finalScore = conflictScore * p.mtfAlpha + mtfCtxRaw * (1 - p.mtfAlpha);

    return {
        mtfScore: Math.round(finalScore * 10) / 10,
        mtfDirection: direction,
        mtfTf1Dir: Math.round(tf1Dir * 10) / 10,
        mtfTf2Dir: Math.round(tf2Dir * 10) / 10,
        mtfTf3Dir: Math.round(tf3Dir * 10) / 10,
        mtfPenaltyPct: Math.round(penalty * 100 * 10) / 10,
    };
}

// --- Main ---
const scenarios = JSON.parse(readFileSync(SCENARIOS_FILE, 'utf-8'));

if (UPDATE_GOLDEN) {
    const golden = scenarios.map(s => ({
        name: s.name,
        description: s.description,
        inputs: s.inputs,
        expected: computeMTF(s.inputs),
    }));
    const dir = dirname(GOLDEN_FILE);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    writeFileSync(GOLDEN_FILE, JSON.stringify(golden, null, 2) + '\n');
    if (!JSON_OUTPUT) console.log(`Golden updated: ${GOLDEN_FILE}`);
    process.exit(0);
}

if (!existsSync(GOLDEN_FILE)) fail('No golden file. Run with --update-golden first.');

const golden = JSON.parse(readFileSync(GOLDEN_FILE, 'utf-8'));
const TOLERANCE = 0.5; // tighter tolerance since formula is deterministic
let allPass = true;
const results = [];

for (const s of scenarios) {
    const actual = computeMTF(s.inputs);
    const gold = golden.find(g => g.name === s.name);
    if (!gold) {
        results.push({ name: s.name, status: 'NO_GOLDEN' });
        allPass = false;
        continue;
    }
    const checks = ['mtfScore', 'mtfDirection', 'mtfTf1Dir', 'mtfTf2Dir', 'mtfTf3Dir', 'mtfPenaltyPct'];
    const failures = [];
    for (const key of checks) {
        const expected = gold.expected[key];
        const got = actual[key];
        if (expected !== undefined && Math.abs(got - expected) > TOLERANCE) {
            failures.push(`${key}: expected ${expected}, got ${got}`);
        }
    }
    if (failures.length > 0) {
        allPass = false;
        results.push({ name: s.name, status: 'FAIL', failures });
    } else {
        results.push({ name: s.name, status: 'PASS', actual });
    }
}

if (JSON_OUTPUT) {
    console.log(JSON.stringify({ results, allPass }, null, 2));
} else {
    for (const r of results) {
        const icon = r.status === 'PASS' ? '✓' : '✗';
        console.log(`  ${icon} ${r.name}: ${r.status}`);
        if (r.failures) r.failures.forEach(f => console.log(`      ${f}`));
    }
    console.log(`\n${allPass ? 'All PASS' : 'Some FAILED'}`);
    process.exit(allPass ? 0 : 1);
}
