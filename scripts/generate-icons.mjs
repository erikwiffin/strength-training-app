import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const svg = readFileSync(join(publicDir, 'pwa-512x512.svg'));

await sharp(svg).resize(180, 180).png().toFile(join(publicDir, 'apple-touch-icon.png'));
await sharp(svg).resize(192, 192).png().toFile(join(publicDir, 'pwa-192x192.png'));
await sharp(svg).resize(512, 512).png().toFile(join(publicDir, 'pwa-512x512.png'));
console.log('Generated public/apple-touch-icon.png, pwa-192x192.png, pwa-512x512.png');
