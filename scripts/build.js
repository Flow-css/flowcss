#!/usr/bin/env node
/**
 * FlowCSS Build Script
 * Minifies src/flow.css and src/flow.js into dist/
 */

const fs   = require('fs');
const path = require('path');

const SRC  = path.join(__dirname, '..', 'src');
const DIST = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });

// ── Minify CSS ────────────────────────────────────────────────
function minifyCSS(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')  // strip comments
    .replace(/\s{2,}/g, ' ')           // collapse whitespace
    .replace(/\n/g, '')                // remove newlines
    .replace(/\s*([{};:,>~+])\s*/g, '$1') // remove spaces around symbols
    .replace(/;}/g, '}')               // remove last semicolon in block
    .trim();
}

// ── Minify JS (basic) ─────────────────────────────────────────
function minifyJS(src) {
  return src
    .replace(/\/\/[^\n]*/g, '')        // strip line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')  // strip block comments
    .replace(/\s{2,}/g, ' ')
    .replace(/\n/g, '')
    .replace(/\s*([{}();,=+\-*/<>!&|?:[\]])\s*/g, '$1')
    .trim();
}

// ── Read sources ─────────────────────────────────────────────
const cssSource = fs.readFileSync(path.join(SRC, 'flow.css'), 'utf-8');
const jsSource  = fs.readFileSync(path.join(SRC, 'flow.js'),  'utf-8');

// ── Write unminified copies ───────────────────────────────────
fs.writeFileSync(path.join(DIST, 'flow.css'), cssSource, 'utf-8');
fs.writeFileSync(path.join(DIST, 'flow.js'),  jsSource,  'utf-8');
console.log('✓ Copied  → dist/flow.css and dist/flow.js');

// ── Write minified copies ─────────────────────────────────────
const minCSS = minifyCSS(cssSource);
const minJS  = minifyJS(jsSource);

fs.writeFileSync(path.join(DIST, 'flow.min.css'), minCSS, 'utf-8');
fs.writeFileSync(path.join(DIST, 'flow.min.js'),  minJS,  'utf-8');
console.log('✓ Minified → dist/flow.min.css and dist/flow.min.js');

// ── Print sizes ───────────────────────────────────────────────
const kb = (str) => (Buffer.byteLength(str, 'utf-8') / 1024).toFixed(1) + ' KB';
console.log(`\n  flow.css      ${kb(cssSource)}`);
console.log(`  flow.min.css  ${kb(minCSS)}`);
console.log(`  flow.js       ${kb(jsSource)}`);
console.log(`  flow.min.js   ${kb(minJS)}`);
console.log('\nBuild complete.');
