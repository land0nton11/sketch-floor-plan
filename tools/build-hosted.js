#!/usr/bin/env node
/*
 * Derive the hosted build from index.html.
 *
 * index.html is the source of truth: a standalone document you can open from
 * disk. A host that injects page content into its own <!doctype>/<head>/<body>
 * (such as a Claude artifact) needs those wrapper tags removed, and needs the
 * app pinned to the viewport rather than trusting <body> to be the layout grid
 * — the host's own reset may add padding or a max-width.
 *
 *   node tools/build-hosted.js [outfile]     # default: hosted.html
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const outPath = path.resolve(root, process.argv[2] || 'hosted.html');

const OVERRIDE = `<style>
  /* Hosted build: the page body belongs to the host, so pin the app to the
     viewport instead of relying on body being the layout grid. */
  html,body{margin:0; padding:0; height:100%; max-width:none; overflow:hidden; background:var(--bg);}
  body{display:block;}
  #appRoot{
    position:fixed; inset:0; z-index:1;
    display:grid; grid-template-rows:var(--toolbar-h) 1fr var(--status-h);
    background:var(--bg); color:var(--text);
    font:13px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  }
  @media (max-width: 860px){
    #appRoot #sidebar,#appRoot #props{top:var(--toolbar-h); bottom:var(--status-h);}
  }
</style>
<div id="appRoot">
`;

// 1. drop the document-level tags the host provides
const stripped = src.split('\n')
  .filter(l => !/^\s*(<!DOCTYPE html>|<html\b|<\/html>|<head>|<\/head>|<meta\b|<body>|<\/body>)/i.test(l))
  .join('\n');

// 2. locate the split points
const markupStart = stripped.indexOf('<div id="toolbar">');
const scriptStart = stripped.lastIndexOf('<script>');
if (markupStart < 0 || scriptStart < 0 || scriptStart < markupStart) {
  console.error('build-hosted: could not locate <div id="toolbar"> and <script> in index.html');
  process.exit(1);
}

// 3. reassemble: <title>+<style>, override CSS + app root, markup, script
const out = stripped.slice(0, markupStart)
  + OVERRIDE
  + stripped.slice(markupStart, scriptStart)
  + '</div>\n'
  + stripped.slice(scriptStart);

fs.writeFileSync(outPath, out);
console.log('wrote ' + path.relative(root, outPath) + ' (' + out.length + ' bytes)');
