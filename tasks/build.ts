import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(__dirname);
const SRC_DIR = path.join(ROOT, "src");
const DIST_DIR = path.join(ROOT, "dist");

// List of files/directories that should be copied directly
const STATIC_FILES = [
  "manifest.json",
  "popup/popup.html",
  "popup/popup.css",
  "options/options.html",
  "icons",
  "*.css"
];

// List of TypeScript files that should be skipped (they'll be handled by Vite)
const SKIP_TS_FILES = [
  "content.entry.ts",
  "popup/popup.ts",
  "options/options.ts"
];

async function ensureDir(dir: string) {
  await fs.promises.mkdir(dir, { recursive: true });
}

async function copyFile(src: string, dest: string) {
  await fs.promises.copyFile(src, dest);
}

async function readFile(path: string) {
  return fs.promises.readFile(path, 'utf-8');
}

async function writeFile(path: string, content: string) {
  await fs.promises.writeFile(path, content);
}

function shouldSkipFile(filePath: string): boolean {
  const relativePath = path.relative(SRC_DIR, filePath);
  return SKIP_TS_FILES.includes(relativePath);
}

async function processFile(srcPath: string, destPath: string) {
  // Skip TypeScript files that will be handled by Vite
  if (shouldSkipFile(srcPath)) {
    return;
  }
  
  const ext = path.extname(srcPath);
  
  // For static files, just copy them directly
  if (STATIC_FILES.some(pattern => {
    if (pattern.includes("*")) {
      const regex = new RegExp(pattern.replace("*", ".*"));
      return regex.test(srcPath);
    }
    return srcPath.endsWith(pattern);
  })) {
    await copyFile(srcPath, destPath);
    return;
  }

  // For other files, process them based on extension
  switch (ext) {
    case '.ts': {
      // Skip TypeScript files - they should be handled by Vite
      return;
    }

    case '.css':
    case '.html':
    case '.json': {
      const content = await readFile(srcPath);
      await writeFile(destPath, content);
      break;
    }

    default:
      await copyFile(srcPath, destPath);
  }
}

async function copyDir(src: string, dest: string) {
  await ensureDir(dest);
  
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await ensureDir(path.dirname(destPath));
      await processFile(srcPath, destPath);
    }
  }
}

async function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
}

async function cleanDist() {
  if (fs.existsSync(DIST_DIR)) {
    await fs.promises.rm(DIST_DIR, { recursive: true });
  }
  await ensureDir(DIST_DIR);
  await ensureDir(path.join(DIST_DIR, 'popup'));
  await ensureDir(path.join(DIST_DIR, 'options'));
  await ensureDir(path.join(DIST_DIR, 'icons'));
}

async function cleanupDuplicates() {
  console.log('🧹 Cleaning up duplicate files...');
  const filesToRemove = [
    'content.js',
    'popup.js',
    'options.js'
  ];
  
  for (const file of filesToRemove) {
    const filePath = path.join(DIST_DIR, file);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}

async function build(copyOnly = false) {
  try {
    if (!copyOnly) {
      // Clean dist directory and create subdirectories
      await cleanDist();
      
      // Run Vite build first
      console.log('🏗️ Running Vite build...');
      await runCommand('vite', ['build']);
    }
    
    // Copy all static files from src to dist
    console.log('📂 Copying static files...');
    await copyDir(SRC_DIR, DIST_DIR);
    
    // Clean up any .ts files that might have been copied
    console.log('🧹 Cleaning up TypeScript files...');
    const cleanupFiles = async (dir: string) => {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          await cleanupFiles(fullPath);
        } else if (entry.name.endsWith('.ts')) {
          await fs.promises.unlink(fullPath);
        }
      }
    };
    await cleanupFiles(DIST_DIR);
    
    // Clean up duplicate files
    await cleanupDuplicates();
    
    console.log('✅ Build completed successfully!');
    console.log('📁 Files in dist directory:');
    const files = await fs.promises.readdir(DIST_DIR);
    files.forEach(file => console.log(`   ${file}`));
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Watch mode implementation
async function watch() {
  console.log('👀 Watching for changes...');
  await build();

  fs.watch(SRC_DIR, { recursive: true }, async (eventType, filename) => {
    if (filename) {
      console.log(`🔄 Changes detected in ${filename}, rebuilding...`);
      await build();
    }
  });
}

// Main execution
const copyOnly = process.argv.includes('--copy-only');
const watchMode = process.argv.includes('--watch');

if (watchMode) {
  watch();
} else {
  build(copyOnly);
}
