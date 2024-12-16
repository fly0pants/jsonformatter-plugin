import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sizes = [16, 48, 128];

async function ensureDir(path) {
    await mkdir(dirname(path), { recursive: true });
}

async function generateIcons() {
    const svgPath = join(__dirname, '../src/icons/icon.svg');
    
    for (const size of sizes) {
        const outputPath = join(__dirname, `../src/icons/icon${size}.png`);
        await ensureDir(outputPath);
        
        await sharp(svgPath)
            .resize(size, size, {
                kernel: sharp.kernel.lanczos3,
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .png({
                compressionLevel: 9,
                quality: 100
            })
            .toFile(outputPath);
        
        console.log(`Generated ${size}x${size} icon at ${outputPath}`);
    }
}

generateIcons().catch(console.error); 