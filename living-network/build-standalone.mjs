/* Builds the file to host elsewhere: one HTML page with the stylesheet and every script inside it.
   The script is obfuscated. That stops a casual view-source reading; it is not secrecy. The browser
   has to run the code, so a determined reader can still recover it from the running page.
   Source of truth stays index.html, styles.css and js/. Regenerate with: npm install && npm run build */
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const { minify: minifyCss } = createRequire(import.meta.url)('csso');
import JavaScriptObfuscator from 'javascript-obfuscator';

const root = path.dirname(fileURLToPath(import.meta.url));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script src="(js\/[^"]+\.js)"><\/script>/g)].map(m => m[1]);
if (scripts.length < 2 || !html.includes('href="styles.css"')) {
  throw new Error('index.html no longer matches what this build expects');
}

const source = scripts.map(rel => fs.readFileSync(path.join(root, rel), 'utf8')).join('\n;\n');
/* One function so the top-level names are local and get renamed. The page starts itself with boot(). */
const wrapped = `(() => {\n${source}\n})();\n`;

const code = JavaScriptObfuscator.obfuscate(wrapped, {
  target: 'browser',
  compact: true,
  seed: 8186,
  simplify: true,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 1,
  stringArrayWrappersCount: 1,
  stringArrayWrappersChainedCalls: false,
  stringArrayWrappersType: 'function',
  splitStrings: false,
  transformObjectKeys: false,
  controlFlowFlattening: false,
  deadCodeInjection: false,
  selfDefending: false,
  debugProtection: false,
  disableConsoleOutput: false,
  unicodeEscapeSequence: false
}).getObfuscatedCode();

/* A string in the bundle must not close the script element that carries it. */
const safe = code.replace(/<\/script/gi, '<\\/script');
const css = minifyCss(fs.readFileSync(path.join(root, 'styles.css'), 'utf8')).css;

let out = html.replace(
  '<link rel="stylesheet" href="styles.css">',
  () => `<style>${css}</style>`
);
out = out.replace(/\n<script src="js\/[^"]+\.js"><\/script>/g, '');
/* Function form: a string replacement would treat $' and $& in the bundle as special. */
const embedded = '<script>' + safe + '</script>\n</body>';
out = out.replace('</body>', () => embedded);
if (out.includes('src="js/') || out.includes('href="styles.css"')) {
  throw new Error('a source reference survived into the share build');
}

const dest = path.join(root, 'dist', 'index.html');
fs.mkdirSync(path.dirname(dest), { recursive: true });
const script = out.slice(out.lastIndexOf('<script>') + 8, out.lastIndexOf('</script>'));
fs.writeFileSync('/tmp/ln-share-check.js', script);
const checked = spawnSync(process.execPath, ['--check', '/tmp/ln-share-check.js']);
fs.rmSync('/tmp/ln-share-check.js', { force: true });
if (checked.status !== 0) throw new Error('share build is not valid JavaScript\n' + checked.stderr.toString().slice(0, 400));
fs.writeFileSync(dest, out);
