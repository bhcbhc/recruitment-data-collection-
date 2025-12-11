#!/usr/bin/env node

/**
 * 生成Chrome扩展所需的图标
 * 注意：这是一个简化版本，实际项目中应该使用专业的设计工具
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 简单的SVG图标定义
const iconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <!-- 背景 -->
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2C5AA0;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1e4620;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="128" height="128" fill="url(#grad1)" rx="16"/>
  
  <!-- 中文"招"字 -->
  <text x="64" y="90" font-size="80" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial, sans-serif">招</text>
</svg>`;

const iconsDir = path.join(__dirname, '../public/icons');

// 确保icons目录存在
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 由于无法直接生成PNG，我们输出SVG作为占位符
const iconPath = path.join(iconsDir, 'icon.svg');
fs.writeFileSync(iconPath, iconSvg);
console.log('✓ Generated icon.svg');

// 创建简单的base64 PNG占位符
const createSimplePNG = (size) => {
  // 这是一个极小的1x1 PNG文件的base64，用作占位符
  const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const buffer = Buffer.from(pngBase64, 'base64');
  return buffer;
};

// 写入占位符PNG文件
const sizes = [16, 48, 128];
sizes.forEach(size => {
  const fileName = `icon-${size}.png`;
  const filePath = path.join(iconsDir, fileName);
  
  // 由于无法生成真实的PNG，我们创建一个最小的占位符
  const minimalPng = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG签名
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // width=1, height=1
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, // bit depth
    0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, // IDAT
    0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0xFE, // 
    0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, 0x49, // 
    0xB4, 0xE8, 0xB7, 0x00, 0x00, 0x00, 0x00, 0x49, // IEND
    0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82         //
  ]);
  
  fs.writeFileSync(filePath, minimalPng);
  console.log(`✓ Created placeholder icon-${size}.png`);
});

console.log('✓ Icon generation complete!');
console.log('💡 提示：请使用专业的图标设计工具（如Figma或Illustrator）');
console.log('  来替换 public/icons 目录中的 PNG 文件以获得更好的效果。');

