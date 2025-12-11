#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sourceDir = path.join(__dirname, '../public');
const targetDir = path.join(__dirname, '../dist');

// 确保dist目录存在
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 复制manifest.json
const manifestSource = path.join(sourceDir, 'manifest.json');
const manifestTarget = path.join(targetDir, 'manifest.json');
if (fs.existsSync(manifestSource)) {
  fs.copyFileSync(manifestSource, manifestTarget);
  console.log('✓ Copied manifest.json');
}

// 复制service-worker.js
const swSource = path.join(sourceDir, 'service-worker.js');
const swTarget = path.join(targetDir, 'service-worker.js');
if (fs.existsSync(swSource)) {
  fs.copyFileSync(swSource, swTarget);
  console.log('✓ Copied service-worker.js');
}

// 复制content-script.js
const csSource = path.join(sourceDir, 'content-script.js');
const csTarget = path.join(targetDir, 'content-script.js');
if (fs.existsSync(csSource)) {
  fs.copyFileSync(csSource, csTarget);
  console.log('✓ Copied content-script.js');
}

// 复制popup.html
const htmlSource = path.join(sourceDir, 'popup.html');
const htmlTarget = path.join(targetDir, 'popup.html');
if (fs.existsSync(htmlSource)) {
  fs.copyFileSync(htmlSource, htmlTarget);
  console.log('✓ Copied popup.html');
}

// 创建icons目录并复制图标
const iconsSourceDir = path.join(sourceDir, 'icons');
const iconsTargetDir = path.join(targetDir, 'icons');
if (fs.existsSync(iconsSourceDir)) {
  if (!fs.existsSync(iconsTargetDir)) {
    fs.mkdirSync(iconsTargetDir, { recursive: true });
  }
  
  const icons = fs.readdirSync(iconsSourceDir);
  icons.forEach(icon => {
    const source = path.join(iconsSourceDir, icon);
    const target = path.join(iconsTargetDir, icon);
    fs.copyFileSync(source, target);
  });
  console.log(`✓ Copied ${icons.length} icon files`);
} else {
  console.log('⚠ Icons directory not found, skipping...');
}

console.log('✓ Build assets copied successfully!');

