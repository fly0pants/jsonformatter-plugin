import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import { dirname, join } from "https://deno.land/std/path/mod.ts";

const __dirname = dirname(new URL(import.meta.url).pathname);
const ROOT = join(__dirname, "..", "..");

class Dir {
  constructor(private path: string) {}

  async read() {
    const entries = await Deno.readDir(this.path);
    const files: { path: string; content: string }[] = [];

    for await (const entry of entries) {
      if (entry.isFile) {
        const path = join(this.path, entry.name);
        const content = await Deno.readTextFile(path);
        files.push({ path: entry.name, content });
      }
    }

    return files;
  }

  async write(files: { path: string; content: string }[]) {
    await ensureDir(this.path);

    for (const file of files) {
      const path = join(this.path, file.path);
      await ensureDir(dirname(path));
      await Deno.writeTextFile(path, file.content);
    }
  }
}

export const src = new Dir(join(ROOT, "src"));
export const dist = new Dir(join(ROOT, "dist"));
